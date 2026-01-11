export default function TaskItem({ tarefa, aoAlternar, aoRemover }) {
    return (
        <div className={`task-item ${tarefa.concluida ? 'completed' : ''}`}
            onClick={() => aoAlternar(tarefa.id)}
            style={{ cursor: 'pointer' }}
        >
            <div className="task-content">
                <span className="status-icon">
                    {tarefa.concluida ? '✅' : '⭕'}
                </span>
                <span className="task-text">{tarefa.texto}</span>
            </div>

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