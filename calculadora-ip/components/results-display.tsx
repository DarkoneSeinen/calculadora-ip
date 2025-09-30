import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { IPv4Result } from "@/lib/ipv4-utils"

interface ResultsDisplayProps {
  result: IPv4Result
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados del Análisis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Dirección de Red</div>
            <div className="text-lg font-mono font-semibold">{result.networkAddress}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Dirección de Broadcast</div>
            <div className="text-lg font-mono font-semibold">{result.broadcastAddress}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Rango de IPs Útiles</div>
            <div className="text-lg font-mono font-semibold">
              {result.usableRange.start} - {result.usableRange.end}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Cantidad de Hosts Útiles</div>
            <div className="text-lg font-semibold">{result.usableHosts.toLocaleString()}</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Clase de IP</div>
              <Badge variant="secondary" className="text-base">
                Clase {result.ipClass}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Tipo de IP</div>
              <Badge variant={result.isPrivate ? "default" : "outline"} className="text-base">
                {result.isPrivate ? "Privada" : "Pública"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="text-sm font-semibold">Información Adicional</div>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total de direcciones:</span>
              <span className="font-mono">{result.totalAddresses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bits de red:</span>
              <span className="font-mono">{result.networkBits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bits de host:</span>
              <span className="font-mono">{32 - result.networkBits}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
