import {useState} from 'react';

export default function TaskItem({ tarefa, aoAlternar, aoRemover, aoEditar }) {
    const [editando, setEditando] = useState(false);
    const [novoTexto, setNovoTexto] = useState(tarefa.texto);

    const handleSalvar = () => {
        if (novoTexto.trim() !== "") {
            aoEditar(tarefa.id, novoTexto);
            setEditando(false);
        }
    };

    const handleCancelar = () => {
        setNovoTexto(tarefa.texto);
        setEditando(false);
    }


    return (
        <div className={`task-item ${tarefa.concluida ? 'completed' : ''} ${editando ? 'editing' : ''}`}
            onClick={() => !editando && aoAlternar(tarefa.id)}// Só alterna se não estiver editando
            style={{ cursor: editando ? 'default' : 'pointer' }}
        >
            <div className="task-content">
                <span className="status-icon">
                    {tarefa.concluida ? '✅' : '⭕'}
                </span>

                {editando ? (
                    <input
                        type="text"
                        className="edit-input"
                        value={novoTexto}
                        onChange={(e) => setNovoTexto(e.target.value)}
                        onBlur={handleSalvar} // Salvar se clicar fora
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSalvar();
                            if (e.key === 'Escape') handleCancelar();
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}// Impede de marcar como concluída ao clicar no input
                    />
                ) :
                    <span className="task-text">{tarefa.texto}</span>
                };

            </div>

            <div className="task-actions">
                <button
                    className="edit-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        setEditando(true);
                    }}
                >
                    ✏️
                </button>

                <button
                    className="delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        aoRemover(tarefa.id);
                    }}
                >
                    🗑️
                </button>
            </div>

        </div>
    )
}



// export default function TaskItem({ tarefa, aoAlternar, aoRemover }) {
//     return (
//         <div className={`task-item ${tarefa.concluida ? 'completed' : ''}`}>
//             <span onClick={() => aoAlternar(tarefa.id)}>
//                 {tarefa.texto}
//             </span>
//             <button onClick={() => aoRemover(tarefa.id)} className="delete-btn">
//                 Excluir
//             </button>
//         </div>
//     )
// }