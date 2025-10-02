'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  calculateNetworkIP,
  calculateBroadcastIP,
  calculateUtilsIPs,
  determineIPClass,
  isPrivateIP,
  calculateNetworkAndHostPortion,
  isValidIPv4,
  isValidSubnetMask
} from '@/lib/ipv4Service';

export default function IPv4Calculator() {
  const [ip, setIp] = useState('');
  const [subnetMask, setSubnetMask] = useState('');
  const [result, setResult] = useState<{
    networkIP: string;
    broadcastIP: string;
    utilsIPs: { totalCount: number; range: string };
    ipClass: string;
    isPrivate: boolean;
    networkAndHost: {
      networkPortion: string;
      hostPortion: string;
      ipBinary: string;
      maskBinary: string;
    };
  } | null>(null);
  const [error, setError] = useState('');

  const calculateIPv4 = () => {
    if (!isValidIPv4(ip)) {
      setError('IP inválida');
      return;
    }
    if (!isValidSubnetMask(subnetMask)) {
      setError('Máscara de subred inválida');
      return;
    }

    setError('');
    const networkIP = calculateNetworkIP(ip, subnetMask);
    const broadcastIP = calculateBroadcastIP(ip, subnetMask);
    const utilsIPs = calculateUtilsIPs(networkIP, broadcastIP);
    const ipClass = determineIPClass(ip);
    const privateIP = isPrivateIP(ip);
    const networkAndHost = calculateNetworkAndHostPortion(ip, subnetMask);

    setResult({
      networkIP,
      broadcastIP,
      utilsIPs: {
        totalCount: utilsIPs.totalCount,
        range: utilsIPs.range
      },
      ipClass,
      isPrivate: privateIP,
      networkAndHost: {
        networkPortion: networkAndHost.networkPortion,
        hostPortion: networkAndHost.hostPortion,
        ipBinary: networkAndHost.ipBinary,
        maskBinary: networkAndHost.maskBinary
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Entrada de Datos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Dirección IP</label>
              <Input
                type="text"
                placeholder="192.168.49.244"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Máscara de Subred</label>
              <Input
                type="text"
                placeholder="255.255.255.192"
                value={subnetMask}
                onChange={(e) => setSubnetMask(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={calculateIPv4}>
              Calcular
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => {
              setIp('');
              setSubnetMask('');
              setResult(null);
              setError('');
            }}>
              Limpiar
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Representación Binaria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm space-y-2">
                <div className="grid grid-cols-1 gap-1">
                  <div className="flex space-x-4 justify-center">
                    {result.networkAndHost.ipBinary.match(/.{8}/g)?.map((octet, i) => (
                      <div key={i} className="flex">
                        {octet.split('').map((bit, j) => {
                          const bitIndex = i * 8 + j;
                          const networkBits = result.networkAndHost.networkPortion.length;
                          const subnetBits = result.networkAndHost.maskBinary.split('1').length - 1;
                          
                          let color = '';
                          if (bitIndex < networkBits) {
                            color = 'text-red-500'; // Red portion
                          } else if (bitIndex < subnetBits) {
                            color = 'text-blue-500'; // Subnet portion
                          } else {
                            color = 'text-green-500'; // Host portion
                          }
                          
                          return (
                            <span key={j} className={color}>
                              {bit}
                            </span>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500"></div>
                    <span className="text-xs">Porción de Red</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500"></div>
                    <span className="text-xs">Porción de Subred</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500"></div>
                    <span className="text-xs">Porción de Host</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium">IP en binario:</div>
                  <div className="text-xs">{result.networkAndHost.ipBinary}</div>
                </div>
                <div>
                  <div className="text-xs font-medium">Máscara en binario:</div>
                  <div className="text-xs">{result.networkAndHost.maskBinary}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultados del Análisis</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Dirección de Red</div>
                  <div>{result.networkIP}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Dirección de Broadcast</div>
                  <div>{result.broadcastIP}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Rango de IPs Útiles</div>
                  <div className="text-sm">{result.utilsIPs.range}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Cantidad de Hosts Útiles</div>
                  <div>{result.utilsIPs.totalCount}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Clase de IP</div>
                  <Badge variant="outline">Clase {result.ipClass}</Badge>
                </div>
                <div>
                  <div className="text-sm font-medium">Tipo de IP</div>
                  <Badge className={result.isPrivate ? "bg-emerald-600" : "bg-blue-600"}>
                    {result.isPrivate ? 'Privada' : 'Pública'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}