const http = require('http')

let clientes = [
    {codigo: 0o3, nome: 'Laura Alves', cargo: 'Sênior', venda: 0o1, valor: 'R$ 2.235.000,00'},
    {codigo: 0o4, nome: 'Maria Cardozo Alves', cargo: 'Sênior', venda: 0o5, valor: 'R$ 235.000,00'}
]

function obterClientes(req, res) {
    res.statusCode = 200
    res.end(JSON.stringify(clientes))
}

function adicionarCliente(req, res) {
    let body = ''
    req.on('data', chunk => {
        body += chunk.toString()
    })
    req.on('end', () => {
        let cliente = JSON.parse(body)
        clientes.push(cliente)
        res.statusCode = 200
        res.end(JSON.stringify(cliente))
    })
}

function atualizarCliente(req, res) {
    const nomeParaProcurar = req.url.split('/')[2]
    let body = ''
    req.on('data', chunk => {
        body += chunk.toString()
    })
    req.on('end', () => {
        const index = clientes.findIndex(cliente => cliente.nome === nomeParaProcurar)
        if (index > -1) {
            clientes[index] = JSON.parse(body);
            res.statusCode = 200
            res.end(JSON.stringify(clientes[index]))
        } else {
            res.statusCode = 404
            res.end(JSON.stringify({ mensagem: "rota não encontrada" }))
        }
    })
}

function apagarCliente(req, res) {
    const nomeParaProcurar = req.url.split('/')[2]
    const index = clientes.findIndex(cliente => cliente.nome === nomeParaProcurar)
    if (index > -1) {
        clientes.splice(index, 1);
        res.statusCode = 200
        res.end(JSON.stringify({ mensagem: "apagado com sucesso" }))
    } else {
        res.statusCode = 404
        res.end(JSON.stringify({ mensagem: "rota não encontrada" }))
    }
}

const servidorWEB = http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.statusCode = 204; // No Content
        res.end();
        return;
    }

    res.setHeader('Content-Type', 'application/json')

    if (req.url === '/api') {
        obterClientes(req, res)
    } else if (req.url === '/create' && req.method === 'POST') {
        adicionarCliente(req, res)
    } else if (req.url.startsWith('/update/') && req.method === 'PUT') {
        atualizarCliente(req, res)
    } else if (req.url.startsWith('/delete/') && req.method === 'DELETE') {
        apagarCliente(req,res)
    } else {
        res.statusCode = 404
        res.end(JSON.stringify({ mensagem: "rota não encontrada" }))
    }

})

servidorWEB.listen(5000, () => console.log("Servidor tá ON!"))