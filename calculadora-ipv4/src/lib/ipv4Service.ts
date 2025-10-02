export interface IIPv4UtilsResult {
  totalCount: number;
  firstIPNum: number;
  lastIPNum: number;
  firstIP: string;
  lastIP: string;
  range: string;
}

export interface INetworkHostPortion {
  ipBinary: string;
  maskBinary: string;
  networkPortion: string;
  hostPortion: string;
  networkBits: number;
  hostBits: number;
}

export const calculateNetworkIP = (ip: string, subnetMask: string): string => {
  const ipParts = ip.split('.').map(Number);
  const maskParts = subnetMask.split('.').map(Number);
  const networkIPParts = ipParts.map((part, index) => part & maskParts[index]);
  return networkIPParts.join('.');
}

export const calculateBroadcastIP = (ip: string, subnetMask: string): string => {
  const ipParts = ip.split('.').map(Number);
  const maskParts = subnetMask.split('.').map(Number);
  const broadcastIPParts = ipParts.map((part, index) => part | (~maskParts[index] & 255));
  return broadcastIPParts.join('.');
}

export const calculateUtilsIPs = (networkIP: string, broadcastIP: string): IIPv4UtilsResult => {
  const networkParts = networkIP.split('.').map(Number);
  const broadcastParts = broadcastIP.split('.').map(Number);
  
  const networkNum = (networkParts[0] << 24) + (networkParts[1] << 16) + (networkParts[2] << 8) + networkParts[3];
  const broadcastNum = (broadcastParts[0] << 24) + (broadcastParts[1] << 16) + (broadcastParts[2] << 8) + broadcastParts[3];
  
  const totalUtilIPs = broadcastNum - networkNum - 1;
  const firstUtilIP = networkNum + 1;
  const lastUtilIP = broadcastNum - 1;
  
  return {
    totalCount: totalUtilIPs,
    firstIPNum: firstUtilIP,
    lastIPNum: lastUtilIP,
    firstIP: `${(firstUtilIP >>> 24) & 255}.${(firstUtilIP >>> 16) & 255}.${(firstUtilIP >>> 8) & 255}.${firstUtilIP & 255}`,
    lastIP: `${(lastUtilIP >>> 24) & 255}.${(lastUtilIP >>> 16) & 255}.${(lastUtilIP >>> 8) & 255}.${lastUtilIP & 255}`,
    range: `${(firstUtilIP >>> 24) & 255}.${(firstUtilIP >>> 16) & 255}.${(firstUtilIP >>> 8) & 255}.${firstUtilIP & 255} - ${(lastUtilIP >>> 24) & 255}.${(lastUtilIP >>> 16) & 255}.${(lastUtilIP >>> 8) & 255}.${lastUtilIP & 255}`
  };
}

export const determineIPClass = (ip: string): string => {
  const firstOctet = parseInt(ip.split('.')[0]);
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D';
  if (firstOctet >= 240 && firstOctet <= 254) return 'E';
  return 'Unknown';
}

export const isPrivateIP = (ip: string): boolean => {
  const parts = ip.split('.').map(Number);
  return (
    (parts[0] === 10) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

export const ipToBinary = (ip: string): string => {
  return ip.split('.').map(octet => {
    return parseInt(octet).toString(2).padStart(8, '0');
  }).join('');
}

export const subnetMaskToBinary = (subnetMask: string): string => {
  return subnetMask.split('.').map(octet => {
    return parseInt(octet).toString(2).padStart(8, '0');
  }).join('');
}

export const calculateNetworkAndHostPortion = (ip: string, subnetMask: string): INetworkHostPortion => {
  const ipBinary = ipToBinary(ip);
  const maskBinary = subnetMaskToBinary(subnetMask);
  
  const networkBits = maskBinary.split('').filter(bit => bit === '1').length;
  
  return {
    ipBinary,
    maskBinary,
    networkPortion: ipBinary.substring(0, networkBits),
    hostPortion: ipBinary.substring(networkBits),
    networkBits,
    hostBits: 32 - networkBits
  };
}

export const isValidIPv4 = (ip: string): boolean => {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  
  return parts.every(part => {
    const num = parseInt(part);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}

export const isValidSubnetMask = (mask: string): boolean => {
  const parts = mask.split('.');
  if (parts.length !== 4) return false;
  
  const binary = subnetMaskToBinary(mask);
  const ones = binary.match(/1/g)?.length || 0;
  const zeros = binary.match(/0/g)?.length || 0;
  
  // Una máscara válida debe tener todos los 1s consecutivos seguidos por todos los 0s
  return binary.indexOf('01') === -1 && (ones + zeros === 32);
}