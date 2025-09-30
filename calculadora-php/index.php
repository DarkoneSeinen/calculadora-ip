<?php
// Funciones PHP para cálculos de IP
function validateIP($ip) {
    $octets = explode('.', $ip);
    if (count($octets) !== 4) return false;
    
    foreach ($octets as $octet) {
        if (!is_numeric($octet) || $octet < 0 || $octet > 255) {
            return false;
        }
    }
    return true;
}

function ipToDecimal($ip) {
    $octets = explode('.', $ip);
    return ($octets[0] << 24) + ($octets[1] << 16) + ($octets[2] << 8) + $octets[3];
}

function decimalToIP($decimal) {
    return sprintf("%d.%d.%d.%d",
        ($decimal >> 24) & 255,
        ($decimal >> 16) & 255,
        ($decimal >> 8) & 255,
        $decimal & 255
    );
}

function ipToBinary($ip) {
    $octets = explode('.', $ip);
    $binary = [];
    foreach ($octets as $octet) {
        $binary[] = str_pad(decbin($octet), 8, '0', STR_PAD_LEFT);
    }
    return implode('.', $binary);
}

function getIPClass($ip) {
    $firstOctet = (int)explode('.', $ip)[0];
    if ($firstOctet >= 1 && $firstOctet <= 126) return 'A';
    if ($firstOctet >= 128 && $firstOctet <= 191) return 'B';
    if ($firstOctet >= 192 && $firstOctet <= 223) return 'C';
    if ($firstOctet >= 224 && $firstOctet <= 239) return 'D';
    if ($firstOctet >= 240 && $firstOctet <= 255) return 'E';
    return 'Inválida';
}

function isPrivateIP($ip) {
    $octets = explode('.', $ip);
    
    // 10.0.0.0 - 10.255.255.255
    if ($octets[0] == 10) return true;
    
    // 172.16.0.0 - 172.31.255.255
    if ($octets[0] == 172 && $octets[1] >= 16 && $octets[1] <= 31) return true;
    
    // 192.168.0.0 - 192.168.255.255
    if ($octets[0] == 192 && $octets[1] == 168) return true;
    
    // 127.0.0.0 - 127.255.255.255 (Loopback)
    if ($octets[0] == 127) return true;
    
    return false;
}

function getColoredBinary($ipBinary, $maskBinary) {
    $ipBits = str_replace('.', '', $ipBinary);
    $maskBits = str_replace('.', '', $maskBinary);
    
    $html = '';
    for ($i = 0; $i < 32; $i++) {
        $bit = $ipBits[$i];
        
        if ($maskBits[$i] === '1') {
            // Porción de red (rojo)
            $html .= '<span class="network-portion">' . $bit . '</span>';
        } else {
            // Porción de host (verde)
            $html .= '<span class="host-portion">' . $bit . '</span>';
        }
        
        // Agregar punto cada 8 bits
        if (($i + 1) % 8 === 0 && $i < 31) {
            $html .= '<span class="dot">.</span>';
        }
    }
    
    return $html;
}

function countOnes($num) {
    $count = 0;
    while ($num) {
        $count += $num & 1;
        $num >>= 1;
    }
    return $count;
}

// Variables para resultados y errores
$error = '';
$results = null;

// Procesar el formulario si se envió
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ipAddress = trim($_POST['ipAddress'] ?? '');
    $subnetMask = trim($_POST['subnetMask'] ?? '');
    
    // Validaciones
    if (empty($ipAddress) || empty($subnetMask)) {
        $error = 'Por favor, ingrese tanto la dirección IP como la máscara de subred.';
    } elseif (!validateIP($ipAddress)) {
        $error = 'Dirección IP inválida. Use el formato X.X.X.X donde cada octeto está entre 0 y 255.';
    } elseif (!validateIP($subnetMask)) {
        $error = 'Máscara de subred inválida. Use el formato X.X.X.X donde cada octeto está entre 0 y 255.';
    } else {
        // Calcular todos los valores
        $ipDecimal = ipToDecimal($ipAddress);
        $maskDecimal = ipToDecimal($subnetMask);
        
        // IP de red
        $networkDecimal = $ipDecimal & $maskDecimal;
        $networkIP = decimalToIP($networkDecimal);
        
        // IP de broadcast
        $wildcardDecimal = (~$maskDecimal) & 0xFFFFFFFF;
        $broadcastDecimal = $networkDecimal | $wildcardDecimal;
        $broadcastIP = decimalToIP($broadcastDecimal);
        
        // Hosts útiles
        $totalHosts = pow(2, 32 - countOnes($maskDecimal));
        $usableHosts = $totalHosts > 2 ? $totalHosts - 2 : 0;
        
        // Primera y última IP útil
        $firstUsableIP = decimalToIP($networkDecimal + 1);
        $lastUsableIP = decimalToIP($broadcastDecimal - 1);
        
        // Clase de IP
        $ipClass = getIPClass($ipAddress);
        
        // Tipo de IP
        $isPrivate = isPrivateIP($ipAddress);
        $ipType = $isPrivate ? 'Privada' : 'Pública';
        
        // Binarios
        $ipBinary = ipToBinary($ipAddress);
        $maskBinary = ipToBinary($subnetMask);
        $networkBinary = ipToBinary($networkIP);
        $coloredBinary = getColoredBinary($ipBinary, $maskBinary);
        
        // Guardar resultados
        $results = [
            'networkIP' => $networkIP,
            'broadcastIP' => $broadcastIP,
            'usableHosts' => number_format($usableHosts),
            'ipRange' => $usableHosts > 0 ? "$firstUsableIP - $lastUsableIP" : 'No hay IPs útiles',
            'ipClass' => $ipClass,
            'ipType' => $ipType,
            'isPrivate' => $isPrivate,
            'ipBinary' => $ipBinary,
            'maskBinary' => $maskBinary,
            'networkBinary' => $networkBinary,
            'coloredBinary' => $coloredBinary
        ];
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculadora IPv4</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 30px;
        }

        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2em;
        }

        .input-section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 30px;
        }

        .input-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-weight: 600;
            color: #555;
            margin-bottom: 8px;
            font-size: 0.95em;
        }

        input {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1em;
            transition: border-color 0.3s;
        }

        input:focus {
            outline: none;
            border-color: #667eea;
        }

        button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        button:active {
            transform: translateY(0);
        }

        .result-item {
            background: #f8f9fa;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .result-label {
            font-weight: 600;
            color: #555;
            margin-bottom: 5px;
        }

        .result-value {
            color: #333;
            font-size: 1.1em;
        }

        .binary-section {
            background: #2d3748;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            font-family: 'Courier New', monospace;
        }

        .binary-title {
            font-weight: 600;
            margin-bottom: 15px;
            color: #a0aec0;
            font-size: 0.9em;
        }

        .binary-row {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }

        .binary-label {
            min-width: 120px;
            color: #a0aec0;
        }

        .binary-value {
            color: #68d391;
            letter-spacing: 2px;
        }

        .network-portion {
            color: #fc8181;
            font-weight: bold;
        }

        .host-portion {
            color: #68d391;
            font-weight: bold;
        }

        .dot {
            color: #a0aec0;
        }

        .error {
            background: #fee;
            color: #c33;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #c33;
        }

        .badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 600;
            margin-left: 10px;
        }

        .badge-public {
            background: #48bb78;
            color: white;
        }

        .badge-private {
            background: #ed8936;
            color: white;
        }

        .badge-class {
            background: #667eea;
            color: white;
        }

        .results-section {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Calculadora IPv4</h1>
        <div style="text-align: center; margin-bottom: 20px; color: #666;">
            <p>Calculadora IP V4 - Taller Redes de datos 1 2025-2</p>
            <p>Carlos Andres Aponte Bustos</p>
        </div>
        

        <form method="POST" class="input-section">
            <div class="input-group">
                <label for="ipAddress">Dirección IP (formato: X.X.X.X)</label>
                <input type="text" 
                       id="ipAddress" 
                       name="ipAddress" 
                       value="<?php echo isset($_POST['ipAddress']) ? htmlspecialchars($_POST['ipAddress']) : ''; ?>" 
                       placeholder="Ej: 192.168.1.10"
                       required />
            </div>
            
            <div class="input-group">
                <label for="subnetMask">Máscara de subred (formato: X.X.X.X)</label>
                <input type="text" 
                       id="subnetMask" 
                       name="subnetMask" 
                       value="<?php echo isset($_POST['subnetMask']) ? htmlspecialchars($_POST['subnetMask']) : ''; ?>" 
                       placeholder="Ej: 255.255.255.0"
                       required />
            </div>
            
            <button type="submit">Calcular</button>
        </form>

        <?php if ($error): ?>
            <div class="error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        
        <?php if ($results): ?>
        <div class="results-section">
            <div class="result-item">
                <div class="result-label">IP de Red</div>
                <div class="result-value"><?php echo $results['networkIP']; ?></div>
            </div>

            <div class="result-item">
                <div class="result-label">IP de Broadcast</div>
                <div class="result-value"><?php echo $results['broadcastIP']; ?></div>
            </div>

            <div class="result-item">
                <div class="result-label">Cantidad de IPs Útiles (Hosts)</div>
                <div class="result-value"><?php echo $results['usableHosts']; ?></div>
            </div>

            <div class="result-item">
                <div class="result-label">Rango de IPs Útiles</div>
                <div class="result-value"><?php echo $results['ipRange']; ?></div>
            </div>

            <div class="result-item">
                <div class="result-label">Clase de IP</div>
                <div class="result-value">
                    <span>Clase <?php echo $results['ipClass']; ?></span>
                    <span class="badge badge-class"><?php echo $results['ipClass']; ?></span>
                </div>
            </div>

            <div class="result-item">
                <div class="result-label">Tipo de IP</div>
                <div class="result-value">
                    <span><?php echo $results['ipType']; ?></span>
                    <span class="badge <?php echo $results['isPrivate'] ? 'badge-private' : 'badge-public'; ?>">
                        <?php echo $results['ipType']; ?>
                    </span>
                </div>
            </div>

            <div class="binary-section">
                <div class="binary-title">REPRESENTACIÓN BINARIA</div>
                <div class="binary-row">
                    <span class="binary-label">IP:</span>
                    <span class="binary-value"><?php echo $results['ipBinary']; ?></span>
                </div>
                <div class="binary-row">
                    <span class="binary-label">Máscara:</span>
                    <span class="binary-value"><?php echo $results['maskBinary']; ?></span>
                </div>
                <div class="binary-row">
                    <span class="binary-label">IP de Red:</span>
                    <span class="binary-value"><?php echo $results['networkBinary']; ?></span>
                </div>
                <div class="binary-row" style="margin-top: 20px;">
                    <span class="binary-label">BINARIO:</span>
                    <span style="letter-spacing: 1px;"><?php echo $results['coloredBinary']; ?></span>
                </div>
                <div class="binary-row" style="margin-top: 15px; font-size: 0.85em;">
                    <span style="background: #fc8181; padding: 2px 8px; border-radius: 3px; margin-right: 10px;">red</span>
                    <span style="background: #68d391; padding: 2px 8px; border-radius: 3px;">host</span>
                </div>
            </div>
        </div>
        <?php endif; ?>
    </div>
</body>
</html>