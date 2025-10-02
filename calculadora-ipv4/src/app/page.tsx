import IPv4Calculator from '@/components/IPv4Calculator';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold">
            Calculadora IPv4
          </h1>
          <div className="text-gray-600">
            <p>Taller Redes de datos1 - Calculadora IP V4</p>
            <p>Nombre: <span className="font-medium">Carlos Andrés Aponte Bustos</span></p>
          </div>
        </div>
        <IPv4Calculator />
      </div>
    </main>
  );
}
