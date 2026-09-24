import { useEffect, useState } from 'react'

export default function ListarIdeias({ onEditar, onExcluir }){
    const [ideias, setIdeias] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)

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

    if (carregando) return <p>Carregando...</p>
    if (erro)     return <p>Erro: {erro}</p>
    if (ideias.length === 0) return <p>Nenhuma ideia encontrada.</p>
    const primeiros = ideias.slice(0, 15)

    return (
        <>
    <ul style={{ display:"flex",gap:"20px", flexDirection:"column",}}>
      {primeiros.map(ideia => (
        <li key={ideia.id} >
            <div style={{ width: '50%', height: '70px', backgroundColor:"blueviolet", borderRadius:"20px"}}>
                <p>{ideia.title}</p>
                <p>id:{ideia.id}</p>
                <button onClick={() => onEditar(ideia)}>Editar</button>
                <button onClick={() => onExcluir(ideia.id)}>Excluir</button>
            </div>
            </li>
      ))}
    </ul>
        </>
    )
}