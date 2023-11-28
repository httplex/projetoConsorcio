const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./vendas.db', sqlite.OPEN_READWRITE,(err) => {
    if (err) return console.error(err);

});

const sql= 'CREATE TABLE vendas(ID INTEGER PRIMARY KEY, codVendedor, nomeVendedor, cargoVendedor, valorVenda)';
db.run(sql);