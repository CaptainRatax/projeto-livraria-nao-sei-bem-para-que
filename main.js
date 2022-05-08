var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const dbUrl = "mongodb://localhost:27017/ProjetoLivrariaDB"; //url da base de dados local mongodb
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Importar rotas
var clientes = require("./routes/clientes");
var funcionarios = require("./routes/funcionarios");
var compras = require("./routes/compras");
var vendas = require("./routes/vendas");
var livros = require("./routes/livros");

//Conectar à base de dados
mongoose.connect(
    dbUrl, { useUnifiedTopology: true, useNewUrlParser: true },
    (err) => {
        if (err != null) {
            console.log(
                "Ocorreu algo errado ao tentar conectar ao MongoDB.\nErros:\n",
                err
            );
        } else {
            console.log("Conectado ao MongoDB.");
        }
    }
);

//Iniciar o server express
var server = app.listen(port, () => {
    console.log("O server está à escuta na porta", server.address().port);
});

//Usar as rotas no server express
app.use("/clientes", clientes);
app.use("/funcionarios", funcionarios);
app.use("/compras", compras);
app.use("/vendas", vendas);
app.use("/livros", livros);
//Ao colocar "/exemplo" todos os endpoints o que estiverem dentro do ficheiro da rota exemplo seram executados só se for chamado o url "127.0.0.1:3000/exemplo/..."
//Ou seja se o nome do endpoint for "teste" o url a ser chamado será "127.0.0.1:3000/exemplo/exemplo" e não "127.0.0.1:3000/teste"