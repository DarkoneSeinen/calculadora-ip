import { IPv4Calculator } from './components/IPv4Calculator'
import './App.css'

function App() {
  return (
    <div className="app">
      <header>
        <h1>Calculadora IPv4</h1>
        <div className="header-info">
          <p>Taller Redes de datos1 - Calculadora IP V4</p>
          <p>Nombre: <span>Carlos Andrés Aponte Bustos</span></p>
        </div>
      </header>
      <main>
        <IPv4Calculator />
      </main>
    </div>
  )
}

export default App
