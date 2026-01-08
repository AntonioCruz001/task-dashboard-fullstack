export default function TaskItem({ tarefa, aoAlternar, aoRemover }) {
    return (
        <div className={`task-item ${tarefa.concluida ? 'completed' : ''}`}>
            <span onClick={() => aoAlternar(tarefa.id)}>
                {tarefa.texto}
            </span>
            <button onClick={() => aoRemover(tarefa.id)} className="delete-btn">
                Excluir
            </button>
        </div>
    )
}