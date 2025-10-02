import { useState } from 'react';
import {
    calculateNetworkIP,
    calculateBroadcastIP,
    calculateUtilsIPs,
    determineIPClass,
    isPrivateIP,
    calculateNetworkAndHostPortion,
    isValidIPv4,
    isValidSubnetMask
} from '../utils/ipv4Service';
import './IPv4Calculator.css';

export function IPv4Calculator() {
    const [ip, setIp] = useState('');
    const [subnetMask, setSubnetMask] = useState('');
    const [result, setResult] = useState(null);
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
            utilsIPs,
            ipClass,
            isPrivate: privateIP,
            networkAndHost
        });
    };

    return (
        <div className="calculator-container">
            <div className="input-section">
                <h2>Entrada de Datos</h2>
                <div className="input-group">
                    <div>
                        <label>Dirección IP</label>
                        <input
                            type="text"
                            placeholder="192.168.49.244"
                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Máscara de Subred</label>
                        <input
                            type="text"
                            placeholder="255.255.255.192"
                            value={subnetMask}
                            onChange={(e) => setSubnetMask(e.target.value)}
                        />
                    </div>
                </div>
                <div className="button-group">
                    <button className="button-calculate" onClick={calculateIPv4}>
                        Calcular
                    </button>
                    <button className="button-clear" onClick={() => {
                        setIp('');
                        setSubnetMask('');
                        setResult(null);
                        setError('');
                    }}>
                        Limpiar
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>

            {result && (
                <>
                    <div className="binary-section">
                        <h2>Representación Binaria</h2>
                        <div className="binary-display">
                            <div className="binary-octets">
                                {result.networkAndHost.ipBinary.match(/.{8}/g)?.map((octet, i) => (
                                    <div key={i} className="octet">
                                        {octet.split('').map((bit, j) => {
                                            const bitIndex = i * 8 + j;
                                            const networkBits = result.networkAndHost.networkPortion.length;
                                            const subnetBits = result.networkAndHost.maskBinary.split('1').length - 1;
                                            
                                            let className = '';
                                            if (bitIndex < networkBits) {
                                                className = 'network-portion'; // Red portion
                                            } else if (bitIndex < subnetBits) {
                                                className = 'subnet-portion'; // Subnet portion (blue)
                                            } else {
                                                className = 'host-portion'; // Host portion (green)
                                            }
                                            
                                            return (
                                                <span key={j} className={className}>
                                                    {bit}
                                                </span>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                            <div className="binary-legend">
                                <div className="legend-item">
                                    <div className="color-indicator color-red"></div>
                                    <span>Porción de Red</span>
                                </div>
                                <div className="legend-item">
                                    <div className="color-indicator color-blue"></div>
                                    <span>Porción de Subred</span>
                                </div>
                                <div className="legend-item">
                                    <div className="color-indicator color-green"></div>
                                    <span>Porción de Host</span>
                                </div>
                            </div>
                            <div className="binary-details">
                                <div>
                                    <span>IP en binario:</span>
                                    <code>{result.networkAndHost.ipBinary}</code>
                                </div>
                                <div>
                                    <span>Máscara en binario:</span>
                                    <code>{result.networkAndHost.maskBinary}</code>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="results-section">
                        <h2>Resultados del Análisis</h2>
                        <div className="results-grid">
                            <div>
                                <h3>Dirección de Red</h3>
                                <p>{result.networkIP}</p>
                            </div>
                            <div>
                                <h3>Dirección de Broadcast</h3>
                                <p>{result.broadcastIP}</p>
                            </div>
                            <div>
                                <h3>Rango de IPs Útiles</h3>
                                <p>{result.utilsIPs.range}</p>
                            </div>
                            <div>
                                <h3>Cantidad de Hosts Útiles</h3>
                                <p>{result.utilsIPs.totalCount}</p>
                            </div>
                            <div>
                                <h3>Clase de IP</h3>
                                <p className="badge">{`Clase ${result.ipClass}`}</p>
                            </div>
                            <div>
                                <h3>Tipo de IP</h3>
                                <p className={`badge ${result.isPrivate ? 'private' : 'public'}`}>
                                    {result.isPrivate ? 'Privada' : 'Pública'}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}