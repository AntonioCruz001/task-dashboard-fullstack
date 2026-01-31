export default function Venda({vendas}) {
    return (
        <div>
            <h1>Meu Dashboard de Vendas</h1>
            <ul>
                {vendas.map(venda => (
                    <li key={venda.id}>
                        {venda.item} - R$ {venda.preco} (Qtd: {venda.quantidade})
                    </li>
                ))}
            </ul>
        </div>
    )
}