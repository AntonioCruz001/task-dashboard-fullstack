import { useState } from 'react';

export default function TaskForm({ aoAdicionar }) {
    const [novoTexto, setNovoTexto] = useState("");

    const lidarComEnvio = (e) => {
        e.preventDefault();
        if (novoTexto.trim() === "") return;

        // aqui a função adicionarTarefa é chamada na "props.aoAdicionar"
        aoAdicionar(novoTexto);
        setNovoTexto("");
    };

    return (
        <form onSubmit={lidarComEnvio} className='task-form'>
            <input
                type="text"
                placeholder='O que precisa ser feito?'
                value={novoTexto}
                onChange={(e) => setNovoTexto(e.target.value)}
            />
            <button type='submit' className='add-btn'>
                Adicionar
            </button>
        </form>
    );
};