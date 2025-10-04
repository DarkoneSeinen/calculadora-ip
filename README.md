# Calculadora IPv4

Una aplicación web moderna para calcular y analizar direcciones IPv4, construida con Next.js y desplegada en Rocky Linux 9.

## Tecnologías Utilizadas

### Next.js
Next.js es un framework de React que ofrece renderizado del lado del servidor (SSR), generación de sitios estáticos (SSG), y una experiencia de desarrollo optimizada. Proporciona:
- Enrutamiento basado en el sistema de archivos
- Optimización automática de imágenes
- Soporte para TypeScript
- Renderizado híbrido

### Otras Tecnologías
- **TypeScript**: Tipado estático para JavaScript
- **Tailwind CSS**: Framework de CSS utilitario
- **Radix UI**: Componentes accesibles y sin estilos
- **React 19**: Biblioteca para construir interfaces de usuario
- **Shadcn**: Colección de componentes de intefaz de usuario UI

## Estructura del Proyecto

```
calculadora-ipv4/
├── src/
│   ├── app/              # Rutas y layouts de la aplicación
│   ├── components/       # Componentes reutilizables
│   │   ├── ui/          # Componentes de interfaz de usuario
│   │   └── IPv4Calculator.tsx
│   └── lib/             # Utilidades y servicios
├── public/              # Archivos estáticos
└── ...                  # Archivos de configuración
```

## Instalación y Despliegue

### Requisitos Previos
- Node.js (versión recomendada: 18 o superior)
- npm (gestor de paquetes de Node.js)


### Pasos para Desplegar

1. Clonar el repositorio:
```bash
git clone https://github.com/DarkoneSeinen/calculadora-ip-v4.git
cd calculadora-ipv4
```

2. Instalar dependencias:
```bash
npm install o
npm i
```

3. Construir la aplicación:
```bash
npm run build
```

4. Iniciar el servidor en el puerto por defecto (package.json):
```bash
npm run start o
npm run dev

```

La aplicación estará disponible en `http://localhost:8080` por defecto para que posteriormente desde el servidor sea configurado el puerto 80.

## Despliegue en Rocky Linux 9

La aplicación fue desplegada en un servidor linux Rocky 9 en VirtualBox, al ser desplegada en el servidor linux, se utilizaron los siguientes comandos:
```bash
ip  addr show           #conocer la ip de la maquina virtual

ls                      #verificar la existencia de la aplicación

cd calculadora-ipv4     #cambio de directorio a el de la aplicación

ls                      #verificar la existencia de todos los archivos de la app

npm i                   #instalación y/o actualizacion de de dependencias

npm run build           #construccion de la app para producción

npm run start -- -p80   #inicio del servidor en el puerto 80
```

Al ser ejecutados estos comandos la aplicación estará disponible en:

- local:     http://localhost:80
- Network:   http://ip-maquina-vbox:80

Al 




