import { useEffect, useState } from 'react'

export default function ListarIdeias({ onEditar, onExcluir }){
    const [ideias, setIdeias] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)
    const [excluindoId, setExcluindoId] = useState(null)

    useEffect(() => {
        const controle = new AbortController()  
        const signal = controle.signal 

        async function buscarIdeias(){
            try {
                setCarregando(true)
                setErro(null)
                const resp = await fetch('https://jsonplaceholder.typicode.com/todos', { signal })
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
                const data = await resp.json()
                setIdeias(data)
            } catch (e) {
                if (e.name !== 'AbortError') {
                // Ignora AbortError: é quando nós mesmos cancelamos
                setErro(e.message)
                }
            } finally {
                setCarregando(false)
            }
        }
        buscarIdeias()
        return () => controle.abort()
    }, [])

    async function excluir(id) {
        setExcluindoId(id)
        try {
            const resp = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'DELETE',
            })
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
            // remove do estado local só se a API confirmar
            setIdeias(atuais => atuais.filter(ideia => ideia.id !== id))
        } catch (e) {
            setErro(`Erro ao excluir: ${e.message}`)
        } finally {
            setExcluindoId(null)
        }
    }

    if (carregando) return <p>Carregando...</p>
    if (erro)     return <p>Erro: {erro}</p>
    if (ideias.length === 0) return <p>Nenhuma ideia encontrada.</p>
    const primeiros = ideias.slice(0, 15)

    return (
        <ul style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
          {primeiros.map(ideia => (
            <li key={ideia.id}>
                <div style={{ width: '50%', height: '70px', backgroundColor: "blueviolet", borderRadius: "20px" }}>
                    <p>{ideia.title}</p>
                    <p>id:{ideia.id}</p>
                    <button onClick={() => onEditar(ideia)}>Editar</button>
                    <button
                      onClick={() => excluir(ideia.id)}
                      disabled={excluindoId === ideia.id}
                    >
                      {excluindoId === ideia.id ? 'Excluindo...' : 'Excluir'}
                    </button>
                </div>
            </li>
          ))}
        </ul>
    )
}