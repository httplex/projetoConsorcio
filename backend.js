const http = require('http')

//CONEXÃO com o banco (DEU CERTO)
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database.sqlite');

function obterClientes(req, res) {
    db.all('SELECT * FROM empresa', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Erro ao obter dados da tabela' }));
            return;
        }
        res.statusCode = 200;
        res.end(JSON.stringify(rows));
    });
}

//ADICIONAR CLIENTE DEU CERTO
function adicionarCliente(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let cliente = JSON.parse(body);
        db.run('INSERT INTO empresa (codVendedor, nomeVendedor, cargoVendedor, codVenda, valorVenda) VALUES (?, ?, ?, ?, ?)', [cliente.codVendedor, cliente.nomeVendedor, cliente.cargoVendedor, cliente.codVenda, cliente.valorVenda], function (err) {
            if (err) {
                console.error(err.message);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Erro ao adicionar cliente ao banco de dados' }));
                return;
            }
            res.statusCode = 200;
            res.end(JSON.stringify(cliente));
        });
    });
}

//Atualizar os dados da pessoa DEU CERTO
function atualizarCliente(req, res) {
    const idParaProcurar = req.url.split('/')[2];
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const sql = 'UPDATE empresa SET codVendedor = ?, nomeVendedor = ?, cargoVendedor = ?, codVenda = ?, valorVenda = ? WHERE id = ?';
        const clienteAtualizado = JSON.parse(body);
        db.run(sql, [clienteAtualizado.codVendedor, clienteAtualizado.nomeVendedor, clienteAtualizado.cargoVendedor, clienteAtualizado.codVenda, clienteAtualizado.valorVenda, idParaProcurar], function (err) {
            if (err) {
                console.error(err.message);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Erro ao atualizar cliente no banco de dados' }));
                return;
            }
            res.statusCode = 200;
            res.end(JSON.stringify(clienteAtualizado));
        });
    });
}

//Apagar o item DEU CERTO
function apagarCliente(req, res) {
    const idParaProcurar = req.url.split('/')[2];
    const sql = 'DELETE FROM empresa WHERE id = ?';

    db.run(sql, [idParaProcurar], function (err) {
        if (err) {
            console.error(err.message);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Erro ao apagar cliente do banco de dados' }));
            return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ mensagem: 'Cliente apagado com sucesso' }));
    });
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
        apagarCliente(req, res)
    } else {
        res.statusCode = 404
        res.end(JSON.stringify({ mensagem: "rota não encontrada" }))
    }

})

servidorWEB.listen(5000, () => console.log("Servidor tá ON!"))