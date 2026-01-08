import { useState, useEffect } from 'react';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import './App.css'

export default function App() {

  const [tarefas, setTarefas] = useState(() => {

    const salvas = localStorage.getItem('meu_dashboard_tarefas');

    return salvas ? JSON.parse(salvas) : []
  });

  useEffect(() => {
    localStorage.setItem('meu_dashboard_tarefas', JSON.stringify(tarefas));
  }, [tarefas])


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

  const [busca, setBusca] = useState("");

  // 'busca' será usado quando a página re-renderizar com 'setBusca'
  const tarefasFiltradas = tarefas.filter(tarefa => {

    // Se a busca estiver vazia, retornamos TRUE para todos (mostra tudo)
    if (!busca || busca.trim() === "") return true;

    // Se a tarefa não tiver texto, retornamos FALSE (esconde ela)
    if (!tarefa.texto) return false;
    
    return tarefa.texto.toLowerCase().includes(busca.toLowerCase())
  });

  console.log("Valor atual da busca:", `'${busca}'`);


  return (
    <div className="app-container">
      <header className="dashboard-header">
        <h1>Dashboard de Tarefas (React)</h1>
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

          <h2>Minhas Tarefas</h2>

          <div className='search-container'>
            <input
              type="text"
              placeholder='Pesquisar tarefas'
              value={busca}
              onChange={(e) => setBusca(e.target.value)} // quando digitar uma letra será disparado o filter
              className='search-input'
            />
          </div>

          {/* a "props.aoAdicionar" recebe a função adicionarTarefa */}
          <TaskForm aoAdicionar={adicionarTarefa} />

          <div className='tasks-container'>
            {tarefasFiltradas.map(tarefa => (
              <TaskItem
                key={tarefa.id}
                tarefa={tarefa}
                aoAlternar={alterarConclusao}
                aoRemover={removerTarefa}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Observação: Use <main> e <nav> (ou <aside>) no nível principal para o Grid */}

    </div>
  )
}

