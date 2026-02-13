import { useState, useRef } from "react";

export default function TaskForm({ aoAdicionar, aoFechar }) {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [prioridade, setPrioridade] = useState("baixa");
    // const [exibirToast, setExibirToast] = useState(false);
    // const [exibirToastErro, setExibirToastErro] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: "", tipo: "" })

    const timerRef = useRef(null);

    const limiteTitulo = 24;
    const limiteDesc = 48;

    const lidarComEnvio = async (e) => {
        e.preventDefault();

        if (titulo.trim() === "") return;

        const novaTarefa = {
            titulo: titulo,
            descricao: descricao,
            prioridade: prioridade,
            status: 'para fazer'
        };

        const mostrarAviso = (texto, tipo) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            setMensagem({ texto, tipo });

            timerRef.current = setTimeout(() => {
                setMensagem({ texto: "", tipo: "" }); // Aqui ele some da tela!
                timerRef.current = null;
            }, 2500);
        }

        try {


            await aoAdicionar(novaTarefa);

            mostrarAviso('Salvo!', 'sucesso');

            //Resets
            setTitulo("");
            setDescricao("");
            setPrioridade("baixa");
        }

        catch (erro) {
            console.error("Erro ao salvar no BD:", erro);
            mostrarAviso('Erro ao Salvar!', 'erro');
        }
    };



    return <form onSubmit={lidarComEnvio} className="task-form" >
        <div className="form-inputs">
            <div className="input-container">
                <input
                    type="text"
                    maxLength={limiteTitulo}
                    className="input-main"
                    placeholder="Título da tarefa"
                    onChange={(e) => setTitulo(e.target.value)}
                    value={titulo}
                />

                <span className={`contador ${titulo.length >= limiteTitulo ? 'limite' : ''}`}>
                    {titulo.length}/{limiteTitulo}
                </span>
            </div>

            <div className="input-container">
                <textarea
                    placeholder="Descrição (opcional)"
                    maxLength={limiteDesc}
                    className="input-desc"
                    onChange={(e) => setDescricao(e.target.value)}
                    value={descricao}
                />

                <span className={`contador ${descricao.length >= limiteDesc ? 'limite' : ''}`}>
                    {descricao.length}/{limiteDesc}
                </span>
            </div>

            <div className="form-footer">

                <div className="footer_row1">
                    <div className="select-group">
                        <label>Prioridade</label>
                        <select
                            value={prioridade}
                            onChange={(e) => setPrioridade(e.target.value)}
                            className={`select-prioridade priority-${prioridade}`}
                        >
                            <option value="baixa">🟢 Baixa</option>
                            <option value="media">🟠 Média</option>
                            <option value="alta">🔴 Alta</option>
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
                </div>

                <div className="footer_row2">
                    <div className="toast-wrapper">
                        {mensagem.texto && (
                            <div className={`toast-mini ${mensagem.tipo}`}>
                                {mensagem.tipo === 'sucesso' ? '✅' : '❌'} {mensagem.texto}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </form>
}