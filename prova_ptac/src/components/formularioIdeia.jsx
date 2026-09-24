import { useState, useEffect } from 'react'

export default function NovaIdeia({ideiaEditando, onTerminarEdicao}) {
  const [title, setTitle] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)
  const [criado, setCriado] = useState(null)  // recurso recém-criado

  useEffect(() => {
    if (ideiaEditando) {
      setTitle(ideiaEditando.title)
    }
  }, [ideiaEditando])

   async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    setCriado(null)
    try {
      const editando = !!ideiaEditando
      const url = editando
        ? `https://jsonplaceholder.typicode.com/todos/${ideiaEditando.id}`
        : 'https://jsonplaceholder.typicode.com/todos'

      const resp = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      setCriado(data)
      setTitle('')
      if (editando) onTerminarEdicao?.()  // sai do modo edição
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar}>
      <h2>{ideiaEditando ? 'Editar ideia' : 'Nova ideia'}</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nome da ideia"
      />

      <button disabled={enviando}>{ideiaEditando ? 'Salvar' : 'Enviar'}</button>
      {ideiaEditando && (
        <button type="button" onClick={onTerminarEdicao}>Cancelar</button>
      )}
      {enviando && <p>Enviando...</p>}
      {erro && <p>Erro: {erro}</p>}
      {criado && <p>Criado/atualizado com id={criado.id} e nome={criado.title}.</p>}
    </form>
  )
}