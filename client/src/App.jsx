import { useState, useEffect } from 'react';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import './App.css'
import Lupa from './assets/Lupa.png'

export default function App() {

  const [tarefas, setTarefas] = useState(() => {
    const salvas = localStorage.getItem('meu_dashboard_tarefas');
    return salvas ? JSON.parse(salvas) : []
  });

  useEffect(() => {
    localStorage.setItem('meu_dashboard_tarefas', JSON.stringify(tarefas));
  }, [tarefas])

  const [tema, setTema] = useState('escuro');

  const alterarTema = () => {
    setTema(tema === 'escuro' ? 'claro' : 'escuro');
  }


  const adicionarTarefa = (texto) => {
    const nova = { id: Date.now(), texto, concluida: false }
    setTarefas([...tarefas, nova]); // adiciona a nova tarefa no final do novo array
  }

  const removerTarefa = (id) => {
    //Excluir a tarefa com o id atual 
    //E retornar nova lista sem a tarefa excuida
    //Muda o valor de tarefas no useState
    setTarefas(tarefas.filter(t => t.id !== id));
  }

  const alterarConclusao = (id) => {
    setTarefas(tarefas.map(t => t.id === id ? { ...t, concluida: !t.concluida } : t));
  };

  // 'busca' será usado quando a página re-renderizar com 'setBusca'
  const [busca, setBusca] = useState("");

  const tarefasFiltradas = tarefas.filter(tarefa => {
    // Se a busca estiver vazia, retorna TRUE para todos (mostra tudo)
    if (!busca || busca.trim() === "") return true;
    // Se a tarefa não tiver texto, retorna FALSE (esconde ela)
    if (!tarefa.texto) return false;
    return tarefa.texto.toLowerCase().includes(busca.toLowerCase())
  });

  const tarefasOrdenadas = [...tarefasFiltradas].sort((a, b) => {
    if (a.concluida === b.concluida) return 0;
    return a.concluida ? 1 : -1;
  })

  console.log("Valor atual da busca:", `'${busca}'`);

  const totalTarefas = tarefas.length;
  const concluidas = tarefas.filter(t => t.concluida).length;
  const pendentes = totalTarefas - concluidas
  const porcentagem = totalTarefas > 0 ?
    Math.round((concluidas / totalTarefas) * 100) :
    0;

  const editarTarefa = (id, novoTexto) => {
    const tarefasAtualizadas = tarefas.map(
      t => t.id === id ? { ...t, texto: novoTexto } : t);
    setTarefas(tarefasAtualizadas);
  }

  return (
    <div className={`app-container ${tema}`}>

      <header className="dashboard-header">
        <h1>Dashboard de Tarefas (React)</h1>
        <button onClick={alterarTema} className='btn-tema'>
          {tema === 'escuro' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>
      </header>

      <nav className="dashboard-sidebar">
        <h2>Menu</h2>
        <ul>
          <li>Início</li>
          <li>Tarefas</li>
          <li>Configurações</li>
        </ul>
      </nav>

      <main className='dashboard-content'>
        <section className="task-list">

          <div className='title-and-stats'>
            <h2>Minhas Tarefas</h2>

            <section className='stats-container'>

              <div className='stats-text'>
                {/* <span>{concluidas}de {totalTarefas} tarefas concluídas</span> */}
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

            <div className='search-container'>
              <svg
                className="search-icon-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                // placeholder='Pesquisar tarefas'
                value={busca}
                onChange={(e) => setBusca(e.target.value)} // quando digitar uma letra será disparado o filter
                className='search-input'
              />
            </div>

          </div>

          {/* a "props.aoAdicionar" recebe a função adicionarTarefa */}
          <TaskForm aoAdicionar={adicionarTarefa} />

          <div className='tasks-container'>
            {tarefasOrdenadas.map(tarefa => (
              <TaskItem
                key={tarefa.id}
                tarefa={tarefa}
                aoAlternar={alterarConclusao}
                aoRemover={removerTarefa}
                aoEditar={editarTarefa}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Observação: Use <main> e <nav> (ou <aside>) no nível principal para o Grid */}

    </div>
  )
}

