const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const sqlite = require("sqlite3").verbose();
const url = require("url")
let sql;
const db = new sqlite.Database("./vendas.db", sqlite.OPEN_READWRITE,(err) => {
    if (err) return console.error(err);

});
app.use(bodyParser.json());
//post request
app.post("/vendas",(req,res)=>{
    try {
        const {codVendedor, nomeVendedor, cargoVendedor, valorVenda} = req.body;
        sql = "INSERT INTO vendas(codVendedor, nomeVendedor, cargoVendedor, valorVenda) VALUES(?,?,?,?)"
        db.run(sql,[codVendedor, nomeVendedor, cargoVendedor, valorVenda], (err)=>{
            if(err) return res.json({status:300, success: false, error:err})
            console.log("successful input", codVendedor, nomeVendedor, cargoVendedor, valorVenda);
        });
        res.json({
            status: 200,
            success: true,
        })
    }catch (error){
        return res.json({
            status: 400,
            sucess: false,
        });
    }
});
//get request
app.get("/vendas", (req, res) => {
    sql = "SELECT * FROM vendas"; // Correção aqui
    try {
        const queryObject = url.parse(req.url, true).query; // parâmetros da consulta
        if (queryObject.field && queryObject.type)
            sql += ` WHERE ${queryObject.field} LIKE '%${queryObject.type}%'`;
        db.all(sql, [], (err, rows) => {
            if (err) return res.json({ status: 300, success: false, error: err })

            if (rows.length < 1)
                return res.json({ status: 300, success: false, error: "No match" })
            return res.json({ status: 200, data: rows, success: true })
        })

    } catch (error) {
        return res.json({
            status: 400,
            success: false,
        });
    }
})
app.listen(3001)