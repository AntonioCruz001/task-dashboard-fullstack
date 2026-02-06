import { useState } from "react"

export default function TaskItem({ tarefa, aoAlternar, aoRemover, aoEditar }) {
    const [editando, setEditando] = useState(false);
    const [novoTexto, setNovoTexto] = useState(tarefa.title);
    const [estaExcluindo, setEstaExcluindo] = useState(false);

    const handleSalvar = () => {
        if (novoTexto.trim() !== "" && novoTexto !== tarefa.title) {
            aoEditar(tarefa.id, novoTexto);
            setEditando(false);
        } else {
            setNovoTexto(tarefa.title)
            setEditando(false)
        }
    };



    const handleCancelar = () => {
        setNovoTexto(tarefa.title);
        setEditando(false);
    }

    const handleIniciarEdicao = () => {
        setNovoTexto(tarefa.title);
        setEditando(true);
    }

    const handleExclusao = (e) => {
        e.stopPropagation();
        setEstaExcluindo(true);

        setTimeout(() => {
            aoRemover(tarefa.id)
        }, 300);
    }

    const estaConcluida = tarefa.status === 'feito'

    return (
        <div className={`task-item ${estaConcluida ? 'completed' : ''} priority-${tarefa.priority} ${editando ? 'editing' : ''} ${estaExcluindo ? 'deleting' : ''}`}
            onClick={() => !editando && aoAlternar(tarefa.id, tarefa.status)}
            style={{ cursor: editando ? 'default' : 'pointer' }}
        >
            <div className="task-content">
                <span className="status-icon">
                    {estaConcluida ? '✅' : '⭕'}
                </span>


                {editando ? (
                    <input
                        type="text"
                        className="edit-input"
                        value={novoTexto}
                        onChange={(e) => setNovoTexto(e.target.value)}
                        onBlur={handleSalvar}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSalvar();
                            if (e.key === 'Escape') handleCancelar();
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <div className="text-wrapper">
                        <span className="task-text">{tarefa.title}</span>
                        {tarefa.description && (
                            <small className="task-desc">{tarefa.description}</small>
                        )}
                    </div>
                )}
            </div>

            <div className="task-actions">
                <button
                    className="edit-btn action-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleIniciarEdicao();
                    }}
                >
                    ✏️
                </button>

                <button className="delete-btn action-btn"
                    // onClick={(e) => {
                    //     e.stopPropagation();
                    //     aoRemover(tarefa.id);
                    // }}
                    onClick={handleExclusao}
                >
                    🗑️
                </button>
            </div>
        </div>
    )
}