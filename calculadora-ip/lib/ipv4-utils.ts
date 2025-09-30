export interface IPv4Result {
  networkAddress: string
  broadcastAddress: string
  usableRange: {
    start: string
    end: string
  }
  usableHosts: number
  totalAddresses: number
  ipClass: string
  isPrivate: boolean
  ipBinary: string
  maskBinary: string
  networkBits: number
}

// Validate IPv4 address format
function validateIPv4(ip: string): boolean {
  const parts = ip.split(".")
  if (parts.length !== 4) return false

  return parts.every((part) => {
    const num = Number.parseInt(part, 10)
    return !isNaN(num) && num >= 0 && num <= 255
  })
}

// Convert IP address to 32-bit integer
function ipToInt(ip: string): number {
  const parts = ip.split(".").map(Number)
  return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]
}

// Convert 32-bit integer to IP address
function intToIp(int: number): string {
  return [(int >>> 24) & 0xff, (int >>> 16) & 0xff, (int >>> 8) & 0xff, int & 0xff].join(".")
}

// Convert IP to binary string
function ipToBinary(ip: string): string {
  return ip
    .split(".")
    .map((octet) => Number.parseInt(octet, 10).toString(2).padStart(8, "0"))
    .join("")
}

// Determine IP class
function getIPClass(firstOctet: number): string {
  if (firstOctet >= 1 && firstOctet <= 126) return "A"
  if (firstOctet >= 128 && firstOctet <= 191) return "B"
  if (firstOctet >= 192 && firstOctet <= 223) return "C"
  if (firstOctet >= 224 && firstOctet <= 239) return "D"
  if (firstOctet >= 240 && firstOctet <= 255) return "E"
  return "Unknown"
}

// Check if IP is private
function isPrivateIP(ip: string): boolean {
  const parts = ip.split(".").map(Number)
  const firstOctet = parts[0]
  const secondOctet = parts[1]

  // 10.0.0.0 - 10.255.255.255
  if (firstOctet === 10) return true

  // 172.16.0.0 - 172.31.255.255
  if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return true

  // 192.168.0.0 - 192.168.255.255
  if (firstOctet === 192 && secondOctet === 168) return true

  return false
}

// Count network bits in subnet mask
function countNetworkBits(mask: string): number {
  const binary = ipToBinary(mask)
  return binary.split("").filter((bit) => bit === "1").length
}

// Validate subnet mask
function validateSubnetMask(mask: string): boolean {
  if (!validateIPv4(mask)) return false

  const binary = ipToBinary(mask)
  // Check if mask has contiguous 1s followed by contiguous 0s
  const pattern = /^1*0*$/
  return pattern.test(binary)
}

export function calculateIPv4Info(ip: string, mask: string): IPv4Result {
  // Validate inputs
  if (!validateIPv4(ip)) {
    throw new Error("Dirección IP inválida. Use el formato X.X.X.X (ej: 192.168.1.1)")
  }

  if (!validateSubnetMask(mask)) {
    throw new Error("Máscara de subred inválida. Use el formato X.X.X.X (ej: 255.255.255.0)")
  }

  // Convert to integers
  const ipInt = ipToInt(ip)
  const maskInt = ipToInt(mask)

  // Calculate network and broadcast addresses
  const networkInt = ipInt & maskInt
  const wildcardInt = ~maskInt & 0xffffffff
  const broadcastInt = networkInt | wildcardInt

  const networkAddress = intToIp(networkInt)
  const broadcastAddress = intToIp(broadcastInt)

  // Calculate usable range
  const firstUsableInt = networkInt + 1
  const lastUsableInt = broadcastInt - 1

  const usableRange = {
    start: intToIp(firstUsableInt),
    end: intToIp(lastUsableInt),
  }

  // Calculate number of hosts
  const networkBits = countNetworkBits(mask)
  const hostBits = 32 - networkBits
  const totalAddresses = Math.pow(2, hostBits)
  const usableHosts = Math.max(0, totalAddresses - 2) // Subtract network and broadcast

  // Get IP class
  const firstOctet = Number.parseInt(ip.split(".")[0], 10)
  const ipClass = getIPClass(firstOctet)

  // Check if private
  const isPrivate = isPrivateIP(ip)

  // Get binary representations
  const ipBinary = ipToBinary(ip)
  const maskBinary = ipToBinary(mask)

  return {
    networkAddress,
    broadcastAddress,
    usableRange,
    usableHosts,
    totalAddresses,
    ipClass,
    isPrivate,
    ipBinary,
    maskBinary,
    networkBits,
  }
}
