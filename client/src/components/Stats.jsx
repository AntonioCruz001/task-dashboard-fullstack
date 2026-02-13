export default function Stats({ tarefas }) {
    // Cálculos de Estatísticas
    const totalTarefas = tarefas.length;
    const concluidas = tarefas.filter(t => t.status === 'feito').length;
    const pendentes = tarefas.filter(t => t.status === 'para fazer').length;
    const porcentagem = totalTarefas > 0 ? Math.round((concluidas / totalTarefas) * 100) : 0;

    return (
        <section className='stats-container'>

            <div className='stats-text'>
                <span>{porcentagem}%</span>
            </div>

            <div className='progress-bar-bg'>
                <div
                    className="progress-bar-fill"
                    style={{ width: `${porcentagem}%` }}>
                </div>
            </div>

            <div className='stat-card'>
                <span>Total</span>
                <strong>{totalTarefas}</strong>
            </div>
            <div className='stat-card'>
                <span>Concluídas</span>
                <strong className='sucsses'>{concluidas}</strong>
            </div>
            <div className='stat-card'>
                <span>Pendentes</span>
                <strong className='warning'>{pendentes}</strong>
            </div>
        </section>
    )
}