import { useState, useEffect } from 'react';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import { supabase } from './supabaseClient';
import './App.css'
// import Venda from './components/Venda';
// import Lupa from './assets/Lupa.png'

export default function App() {

  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [tema, setTema] = useState('escuro');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const nomeTabela = 'tasks';

  const STATUS = {
    DONE: 'feito',
    INPROGRESS: 'fazendo',
    TODO: 'para fazer'
  }

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(nomeTabela)
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setTarefas(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchTasks()
  }, []);

  useEffect(() => {
    const tratarTeclado = (e) => {
      if (e.key === 'Escape') {
        setIsFormOpen(false);
      }
    };

    window.addEventListener('keydown', tratarTeclado);

    return () => window.removeEventListener('keydown', tratarTeclado);
  }, [])

  // ---Mostrar Form---
  const mostrarForm = () => { setIsFormOpen(!isFormOpen) };

  // --- ADICIONAR (CREATE) ---
  // Agora a função recebe um objeto 'novaTarefa'
  const adicionarTarefa = async (dadosDaTarefa) => {
    const { data, error } = await supabase
      .from(nomeTabela)
      .insert([
        {
          title: dadosDaTarefa.titulo,
          description: dadosDaTarefa.descricao,
          status: dadosDaTarefa.status || 'todo',
          priority: dadosDaTarefa.prioridade || 'media',
          due_date: dadosDaTarefa.dataTarefa
        }])
      .select()

    if (error) {
      alert("Erro ao salvar: " + error.message)
      console.log(error);
    } else {
      // pega a linha 0 (nova tarefa) do array de itens da tabela 
      // e poe no topo da pilha de tarefas
      // setTarefas ira renderizar a pagina
      setTarefas([data[0], ...tarefas]);
    }
  }

  // --- REMOVER (DELETE) ---
  const removerTarefa = async (id) => {
    const { error } = await supabase
      .from(nomeTabela)
      .delete()
      .eq('id', id)

    if (error) {
      alert("Não foi possível excluir a tarefa: " + error.message);
      console.error("Erro ao deletar:", error);
    } else {
      // 2. Só atualiza a tela (UI) se o banco deletou com sucesso
      setTarefas(tarefas.filter(t => t.id !== id));
    }
  }

  // --- EDITAR (UPDATE) ---
  const editarTarefa = async (id, novoTitulo) => {
    const { error } = await supabase
      .from(nomeTabela)
      .update({ title: novoTitulo })// O que mudar
      .eq('id', id) // eq compara o id da tabela com a var id

    if (error) {
      alert("Erro ao editar: " + error.message);
    } else {
      setTarefas(tarefas.map(t => t.id === id ? { ...t, title: novoTitulo } : t));
    }
  }

  // --- ALTERAR CONCLUSÃO (UPDATE) ---

  // const alterarConclusao = async (id, statusAtual) => {

  //   const novoStatus = statusAtual === STATUS.DONE ? STATUS.TODO : STATUS.DONE;

  //   const { error } = await supabase
  //     .from('tasks')
  //     .update({ status: novoStatus })
  //     .eq('id', id);

  //   if (!error) {
  //     setTarefas(tarefas.map(t => t.id === id ? { ...t, status: novoStatus } : t));
  //   }
  // };

  // --- //

  const alterarConclusao = async (id, statusAtual) => {

    const novoStatus = statusAtual === STATUS.DONE ? STATUS.TODO : STATUS.DONE;

    setTarefas(tarefas.map(t => t.id === id ? { ...t, status: novoStatus } : t));

    const { error } = await supabase
      .from('tasks')
      .update({ status: novoStatus })
      .eq('id', id);

    if (error) {
      alert("Erro ao sincronizar. Tentando reverter...");
      setTarefas(tarefas.map(t => t.id === id ? { ...t, status: statusAtual } : t));
    }
  };

  const tarefasFiltradas = tarefas.filter(t =>
    t.title?.toLowerCase().includes(busca.toLowerCase())
  )

  const tarefasOrdenadas = [...tarefasFiltradas].sort((a, b) => { a.status === STATUS.DONE ? 1 : -1 });

  // Cálculos de Estatísticas
  const totalTarefas = tarefas.length;
  const concluidas = tarefas.filter(t => t.status === STATUS.DONE).length;
  const pendentes = tarefas.filter(t => t.status === STATUS.TODO).length;
  const porcentagem = totalTarefas > 0 ? Math.round((concluidas / totalTarefas) * 100) : 0;

  const alterarTema = () => {
    setTema(tema === 'escuro' ? 'claro' : 'escuro');
  }

  if (loading) return <div className="loading">Carregando Dashboard...</div>;

  return (
    <div className={`app-container ${tema}`}>

      <header className="dashboard-header">
        <h1>Dashboard de Tarefas (React)</h1>
        <button onClick={alterarTema} className='btn-tema'>
          {tema === 'escuro' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>
      </header>

      {/* <nav className="dashboard-sidebar">
        <h2>Menu</h2>
        <ul>
          <li>Início</li>
          <li>Tarefas</li>
          <li>Configurações</li>
        </ul>
      </nav> */}

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
          <button className="nova-tarefa" onClick={mostrarForm}>
            {isFormOpen ? 'Fechar' : 'Nova Tarefa'}
          </button>

          {isFormOpen && <TaskForm 
          aoAdicionar={adicionarTarefa} 
          aoFechar={mostrarForm}
          />}

          <div className='tasks-container'>
            {tarefasOrdenadas.map(tarefa => (
              <TaskItem
                key={tarefa.id}
                tarefa={tarefa}
                aoAlternar={() => alterarConclusao(tarefa.id, tarefa.status)}
                aoRemover={removerTarefa}
                aoEditar={editarTarefa}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

