import { useState, useRef } from "react";

export default function TaskForm({ aoAdicionar, aoFechar }) {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [prioridade, setPrioridade] = useState("media");
    const [exibirToast, setExibirToast] = useState(false);

    const timerRef = useRef(null);

    const lidarComEnvio = (e) => {
        e.preventDefault();

        if (titulo.trim() === "") return;

        const novaTarefa = {
            titulo: titulo,
            descricao: descricao,
            prioridade: prioridade,
            status: 'para fazer'
        };

        aoAdicionar(novaTarefa);

        //Resets
        setTitulo("");
        setDescricao("");
        setPrioridade("media");

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setExibirToast(true);

        timerRef.current = setTimeout(() => {
            setExibirToast(false);
            timerRef.current = null;
        }, 2000);
    };



    return <form onSubmit={lidarComEnvio} className="task-form" >
        <div className="form-inputs">
            <input
                type="text"
                className="input-main"
                placeholder="Título da tarefa"
                onChange={(e) => setTitulo(e.target.value)}
                value={titulo}
            />

            <textarea
                placeholder="Descrição (opcional)"
                className="input-desc"
                onChange={(e) => setDescricao(e.target.value)}
                value={descricao}
            />

            <div className="form-footer">
                <div className="select-group">
                    <label>Prioridade</label>
                    <select
                        value={prioridade}
                        onChange={(e) => setPrioridade(e.target.value)}
                    >
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>

                <div className="btn-container">
                    <button type="button" className="cancel-btn" onClick={aoFechar}>
                        Cancelar
                    </button>

                    <button type="submit" className="add-btn">
                        Adicionar Tarefa
                    </button>
                </div>

                <div className="toast-container">
                    {exibirToast &&
                        <div className="toast-success">
                            Tarefa salva! ✅
                        </div>
                    }
                </div>
            </div>
        </div>
    </form>
}