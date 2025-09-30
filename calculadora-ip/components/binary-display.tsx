import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BinaryDisplayProps {
  ipBinary: string
  maskBinary: string
  networkBits: number
}

export function BinaryDisplay({ ipBinary, maskBinary, networkBits }: BinaryDisplayProps) {
  // Split binary into octets
  const octets = ipBinary.match(/.{1,8}/g) || []

  // Calculate which bits are network, subnet, and host
  const renderBinaryWithColors = () => {
    let bitIndex = 0
    return octets.map((octet, octetIndex) => {
      const bits = octet.split("").map((bit) => {
        const currentBit = bitIndex++
        let colorClass = ""

        if (currentBit < networkBits) {
          colorClass = "text-red-600 font-bold" // Network portion
        } else {
          colorClass = "text-green-600 font-bold" // Host portion
        }

        return (
          <span key={currentBit} className={colorClass}>
            {bit}
          </span>
        )
      })

      return (
        <span key={octetIndex} className="inline-block">
          {bits}
          {octetIndex < octets.length - 1 && <span className="text-muted-foreground mx-1">.</span>}
        </span>
      )
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Representación Binaria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <div className="font-mono text-lg break-all">{renderBinaryWithColors()}</div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>Porción de Red</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span>Porción de Host</span>
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">IP en binario:</span>
            <span className="font-mono">{ipBinary}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Máscara en binario:</span>
            <span className="font-mono">{maskBinary}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
