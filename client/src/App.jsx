import './App.css'
import { useState, useEffect } from 'react';

export default function App() {

  const [tarefas, setTarefas] = useState(() => {

    const salvas = localStorage.getItem('meu_dashboard_tarefas');

    return salvas ? JSON.parse(salvas) : [
      { id: 1, texto: "Estudar React e Programação Funcional" },
      { id: 2, texto: "Finalizar o layout do Dashboard" },
      { id: 3, texto: "Aprender a usar o método Map" },
      { id: 4, texto: "Configurar o ambiente Node.js" },
    ]
  });

  useEffect(() => {
    localStorage.setItem('meu_dashboard_tarefas', JSON.stringify(tarefas));
  }, [tarefas])

  const removerTarefa = (id) => {
    //Excluir a tarefa com o id atual 
    //E retornar nova lista sem a tarefa excuida
    const novaLista = tarefas.filter(tarefa => tarefa.id !== id)
    //Muda o valor de tarefas no useState
    setTarefas(novaLista);
  }

  const [novoTexto, setNovotexto] = useState("");

  const adicionarTarefa = (event) => {
    event.preventDefault();

    // Não adiciona se o campo estiver vazio
    // trim() remove os espaços etc...
    if (novoTexto.trim() === "") return;

    const novaTarefa = {
      id: Date.now(),
      texto: novoTexto, // referencia o useState
      concluida: false
    }

    setTarefas([...tarefas, novaTarefa]); // adiciona a nova tarefa no final do novo array

    setNovotexto(""); // reseta o campo de texto
  }

  const alterarConclusao = (id) => {
    const novaLista = tarefas.map(tarefa => {
      if (tarefa.id === id) {
        // Retorna uma cópia da tarefa com o valor de 'concluida' invertido
        return { ...tarefa, concluida: !tarefa.concluida }
      }

      return tarefa; // As outras tarefas permanecem iguais
    })
    setTarefas(novaLista);
  };

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

          {/* Formulário */}
          <form onSubmit={adicionarTarefa} className='task-form'>
            <input
              type="text"
              placeholder='Adicionar tarefa...'
              value={novoTexto} // o valor vem do useState
              onChange={(e) => setNovotexto(e.target.value)} // atualiza o valor ao digitar
            />
            <button type='submit' className='add-btn'>Adicionar</button>
          </form>



          <h2>Minhas Tarefas</h2>

          {/*Aqui entrarão os componentes das tarefas*/}

          <div className='tasks-container'>
            {tarefas.map((tarefa) => (
              <div
                key={tarefa.id}
                className={`task-item ${tarefa.concluida ? 'completed' : ''}`} >

                <span onClick={() => alterarConclusao(tarefa.id)}>{tarefa.texto}</span>

                <button className='delete-btn' onClick={() => removerTarefa(tarefa.id)}>
                  Excluir
                </button>
              </div>
            ))}
          </div>

          {/* <div className="task-item">
            <span>Tarefa 1: Estudar React</span>
            <button className="delete-btn">Excluir</button>
          </div>

          <div className="task-item">
            <span>Tarefa 2: Estudar API</span>
            <button className="delete-btn">Excluir</button>
          </div> */}

        </section>

      </main>

      {/* Observação: Use <main> e <nav> (ou <aside>) no nível principal para o Grid */}

    </div>
  )
}

