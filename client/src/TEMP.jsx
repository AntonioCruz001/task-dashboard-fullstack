import { useState, useEffect } from 'react';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import { supabase } from './supabaseClient';
import './App.css';

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tema, setTema] = useState('escuro');
  const [busca, setBusca] = useState("");

  // --- BUSCAR TAREFAS (READ) ---
  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setTarefas(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- ADICIONAR (CREATE) ---
  const adicionarTarefa = async (titulo) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title: titulo, status: 'todo' }]) // 'title' é o nome na tabela SQL
      .select();

    if (!error) setTarefas([data[0], ...tarefas]);
  };

  // --- REMOVER (DELETE) ---
  const removerTarefa = async (id) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (!error) setTarefas(tarefas.filter(t => t.id !== id));
  };

  // --- ALTERAR CONCLUSÃO (UPDATE) ---
  // VERSAO 1

  const alterarConclusao = async (id, statusAtual) => {

    const STATUS = {
      DONE: 'feito',
      INPROGRESS:'fazendo',
      TODO: 'para fazer'
    }

    const novoStatus = statusAtual === STATUS.DONE ? STATUS.TODO : STATUS.DONE;

    const { error } = await supabase
      .from('tasks')
      .update({ status: novoStatus })
      .eq('id', id);

    if (!error) {
      setTarefas(tarefas.map(t => t.id === id ? { ...t, status: novoStatus } : t));
    }
  };

  // VERSAO 2 

  const alterarConclusao = async (id, statusAtual) => {
    const novoStatus = statusAtual === 'feito' ? 'para fazer' : 'feito';

    // Adicionamos o .select() para retornar os dados atualizados
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: novoStatus })
      .eq('id', id)
      .select('status') // Pede para retornar apenas o campo status
      .single();        // Garante que retorne um objeto e não um array

    if (error) {
      console.error("Erro ao atualizar:", error.message);
      return;
    }

    // Agora usamos o valor que veio do BANCO (data.status) 
    // para atualizar o estado do React, garantindo a verdade absoluta
    if (data) {
      setTarefas(tarefas.map(t =>
        t.id === id ? { ...t, status: data.status } : t
      ));
    }
  };


  // --- EDITAR TEXTO (UPDATE) ---
  const editarTarefa = async (id, novoTitulo) => {
    const { error } = await supabase
      .from('tasks')
      .update({ title: novoTitulo })
      .eq('id', id);

    if (!error) {
      setTarefas(tarefas.map(t => t.id === id ? { ...t, title: novoTitulo } : t));
    }
  };

  // Logica de Filtro e Ordenação (Mantém-se quase igual, apenas ajustando os nomes)
  const tarefasFiltradas = tarefas.filter(t =>
    t.title?.toLowerCase().includes(busca.toLowerCase())
  );

  const tarefasOrdenadas = [...tarefasFiltradas].sort((a, b) =>
    a.status === 'done' ? 1 : -1
  );

  // Cálculos de Estatísticas
  const totalTarefas = tarefas.length;
  const concluidas = tarefas.filter(t => t.status === 'done').length;
  const porcentagem = totalTarefas > 0 ? Math.round((concluidas / totalTarefas) * 100) : 0;

  if (loading) return <div className="loading">Carregando Dashboard...</div>;

  return (
    <div className={`app-container ${tema}`}>
      {/* ... O seu JSX de Header e Sidebar continua igual ... */}

      <main className='dashboard-content'>
        {/* ... JSX de Stats ... */}

        <TaskForm aoAdicionar={adicionarTarefa} />

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
      </main>
    </div>
  );
}