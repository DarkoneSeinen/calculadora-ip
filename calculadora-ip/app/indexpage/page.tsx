import { IPv4Calculator } from "@/components/ipv4-calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Calculadora IPv4</h1>
          <p className="text-muted-foreground">Herramienta profesional para análisis de subredes IPv4</p>
        </div>
        <IPv4Calculator />
      </div>
    </main>
  )
}
