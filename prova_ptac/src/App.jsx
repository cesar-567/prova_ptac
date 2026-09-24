import { useEffect, useState } from 'react'
import ListarIdeias from './components/listarIdeias'
import NovaIdeia from './components/formularioIdeia'
import './App.css'

function App() {
  const [ideiaEditando, setIdeiaEditando] = useState(null)

  return (
    <>
      <NovaIdeia
      ideiaEditando={ideiaEditando}
        onTerminarEdicao={() => setIdeiaEditando(null)}/>
      <ListarIdeias
      onEditar={(ideia) => setIdeiaEditando(ideia)}
        onExcluir={(id) => console.log('excluir', id) /* pendente */}/>
    </>
  )
}

export default App
