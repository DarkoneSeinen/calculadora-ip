"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { calculateIPv4Info, type IPv4Result } from "@/lib/ipv4-utils"
import { BinaryDisplay } from "@/components/binary-display"
import { ResultsDisplay } from "@/components/results-display"

export function IPv4Calculator() {
  const [ipAddress, setIpAddress] = useState("")
  const [subnetMask, setSubnetMask] = useState("")
  const [result, setResult] = useState<IPv4Result | null>(null)
  const [error, setError] = useState<string>("")

  const handleCalculate = () => {
    setError("")
    setResult(null)

    try {
      const calculatedResult = calculateIPv4Info(ipAddress, subnetMask)
      setResult(calculatedResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular")
    }
  }

  const handleReset = () => {
    setIpAddress("")
    setSubnetMask("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Entrada de Datos</CardTitle>
          <CardDescription>Ingresar la dirección IP y la máscara de subred en formato decimal (X.X.X.X)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ip-address">Dirección IP</Label>
              <Input
                id="ip-address"
                placeholder="192.168.1.10"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subnet-mask">Máscara de Subred</Label>
              <Input
                id="subnet-mask"
                placeholder="255.255.255.0"
                value={subnetMask}
                onChange={(e) => setSubnetMask(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={handleCalculate} className="flex-1">
              Calcular
            </Button>
            <Button onClick={handleReset} variant="outline">
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          <BinaryDisplay ipBinary={result.ipBinary} maskBinary={result.maskBinary} networkBits={result.networkBits} />
          <ResultsDisplay result={result} />
        </>
      )}
    </div>
  )
}
