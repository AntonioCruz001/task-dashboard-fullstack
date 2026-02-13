import { useState, useEffect } from 'react';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import Stats from './components/Stats';
import { supabase } from './supabaseClient';
import './App.css'
// import Venda from './components/Venda';
// import Lupa from './assets/Lupa.png';

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

  // --- fetchTasks - Supabase online ---
  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(nomeTabela)
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setTarefas(data);
    setLoading(false);
  }

  // --- fetchTasks OFFLINE ---
  // const fetchTasks = async () => {
  //   setLoading(true);
  //   const data = [{
  //     id: 1, title: 'UM', priority: 'baixa'
  //   }, {
  //     id: 2, title: 'Dois', priority: 'media'
  //   }]

  //   setTarefas(data);
  //   setLoading(false);
  // }

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
          status: dadosDaTarefa.status || 'para fazer',
          priority: dadosDaTarefa.prioridade,
          due_date: dadosDaTarefa.dataTarefa
        }])
      .select()

    if (error) {
      // alert("Erro ao salvar: " + error.message)
      console.log(error);
      throw error;

    } else {
      // pega a linha 0 (nova tarefa) do array de itens da tabela 
      // e poe no topo da pilha de tarefas
      // setTarefas ira renderizar a pagina
      setTarefas(prev => [data[0], ...prev]);
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
      setTarefas(prev => prev.map(t => t.id === id ? { ...t, title: novoTitulo } : t));
    }
  }

  // --- MUDANÇA DE STATUS ---
  const alterarConclusao = async (id, statusAtual) => {
    const novoStatus = statusAtual === STATUS.DONE ? STATUS.TODO : STATUS.DONE;
    setTarefas(prev => prev.map(t => t.id === id ? { ...t, status: novoStatus, isPending: true } : t));

    setTimeout(async () => {
      const { error } = await supabase
        .from(nomeTabela)
        .update({ status: novoStatus })
        .eq('id', id);

      setTarefas(prev => prev.map(t => t.id === id ? { ...t, isPending: false } : t));

      if (error) {
        alert("Erro ao sincronizar. Tentando reverter...");
        setTarefas(prev => prev.map(t => t.id === id ? { ...t, status: statusAtual } : t));
      }
    }, 600);
  };

  const tarefasFiltradas = tarefas.filter(t =>
    t.title?.toLowerCase().includes(busca.toLowerCase())
  )

  // --- ALTERAR PRIORIDADE ---
  const alterarPrioridade = (id) => {
    const ordem = ['baixa', 'media', 'alta']
    const tarefaAtual = tarefas.find(t => t.id === id);
    if (!tarefaAtual) return;

    const indexAtual = ordem.indexOf(tarefaAtual.priority);
    // Ciclo do index: 0+1 % 3 = 1 | 1+1 % 3 = 2 | 2+1 % 3 = 0
    const proximoIndex = (indexAtual + 1) % ordem.length;
    const novaPrioridade = ordem[proximoIndex];

    // Atualiza o estado
    setTarefas(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, priority: novaPrioridade, isPriorityPending: true, originalPriority: t.priority };
      }
      return t;
    }));

    // Timeout para aguardar e sincronizar
    setTimeout(async () => {
      const { error } = await supabase
        .from(nomeTabela)
        .update({ priority: novaPrioridade })
        .eq('id', id);

      setTarefas(prev => prev.map(t => {
        if (t.id === id) {
          const { isPriorityPending, originalPriority, ...tarefaSpread } = t;
          return { ...tarefaSpread, isPriorityPending: false };
        }
        return t;
      }
      ));

      if (error) {
        alert("Erro ao sincronizar. Revertendo...");
        setTarefas(prev => prev.map(t => t.id === id ? { ...t, priority: tarefaAtual.priority } : t));
      }
    }, 600)
  }

  // Ordenar Tarefas a partir da Prioridade
  const pesos = {
    alta: 3,
    media: 2,
    baixa: 1
  };
  const tarefasOrdenadas = [...tarefas].sort((a, b) => {

    // isPending para aguardar a mudança visual
    // com isPending = true a ordenação se mantém até o fim do setTimeout
    const obterStatusVisual = (t) => {
      if (t.isPending) {
        return t.status === STATUS.DONE ? STATUS.TODO : STATUS.DONE;
      }
      return t.status;
    };

    const obterPrioridadeVisual = (t) => {
      if (t.isPriorityPending && t.originalPriority) {
        return t.originalPriority;
      }
      return t.priority;
    };

    const statusA = obterStatusVisual(a);
    const statusB = obterStatusVisual(b);

    // Ordenação por Status - não concluidas > concluidas
    if (statusA !== statusB) {
      return statusA === STATUS.TODO ? -1 : 1;
    };

    // Peso maior primeiro - alta > media > baixa
    // -1 = a primeiro / 0 = empate / 1(positivo) = b primeiro
    const prioA = obterPrioridadeVisual(a);
    const prioB = obterPrioridadeVisual(b);

    const pesoA = pesos[prioA] || 0;
    const pesoB = pesos[prioB] || 0;

    if (pesoB !== pesoA) {
      return pesoB - pesoA;
    };
    return (a.title || '').localeCompare(b.title || '');
  })






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

      <main className='dashboard-content'>
        <section className="task-list">

          <div className='title-and-stats'>
            <h2>Minhas Tarefas</h2>

            <Stats tarefas={tarefas} />

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
                placeholder='Pesquisar tarefas'
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
                aoAlterarPrioridade={alterarPrioridade}
                aoEditar={editarTarefa}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

