var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { Venda } = require("../models/vendasSchema");
const { Livro } = require("../models/livrosSchema");
const { Funcionario } = require("../models/funcionariosSchema");
const { Cliente } = require("../models/clientesSchema");

router.post("/nova", async(req, res) => {
    try {
        var venda = new Venda(req.body);

        //Verifica se o id do livro é válido
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body.livro._id)) {
            return res.status(400).send("Esse livro não é válido!");
        }

        //Verifica se o id do cliente é válido
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body.cliente._id)) {
            return res.status(400).send("Esse cliente não é válido!");
        }

        //Verifica se o id do funcionario é válido
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body.funcionario._id)) {
            return res.status(400).send("Esse funcionario não é válido!");
        }

        //Verifica se o livro existe
        var verifyLivro = await Livro.find({ _id: req.body.livro._id });
        if (verifyLivro.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum livro com esse id");
        }
        verifyLivro = verifyLivro[0];

        //Verifica se o cliente existe
        var verifyCliente = await Cliente.find({ _id: req.body.cliente._id });
        if (verifyCliente.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum cliente com esse id");
        }
        verifyCliente = verifyCliente[0];

        //Verifica se o funcionario existe
        var verifyFuncionario = await Funcionario.find({
            _id: req.body.funcionario._id,
        });
        if (verifyFuncionario.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum funcionario com esse id");
        }
        verifyFuncionario = verifyFuncionario[0];

        if (verifyLivro.stock <= 0) {
            return res
                .status(400)
                .send("O livro requisitado não tem stock no momento.");
        }

        if (verifyCliente.pontos < venda.pontosUsados) {
            return res
                .status(400)
                .send("O cliente não possui esse número de pontos.");
        }

        venda.valor = verifyLivro.preco;

        if (venda.pontosUsados != 0) {
            if (venda.pontosUsados > verifyLivro.preco * 100) {
                venda.pontosUsados = verifyLivro.preco * 100;
            }
            let auxFloat = verifyLivro.preco - venda.pontosUsados / 100;
            venda.valor = auxFloat.toFixed(2);
        }

        verifyLivro.stock = verifyLivro.stock - 1;

        var pontosGanhos = Math.trunc(venda.valor / 100);

        verifyCliente.pontos = Math.trunc(
            verifyCliente.pontos - venda.pontosUsados + pontosGanhos
        );

        venda.cliente = verifyCliente;
        venda.livro = verifyLivro;
        venda.funcionario = verifyFuncionario;

        var vendaGuardada = await venda.save();

        await Cliente.findOneAndUpdate({ _id: verifyCliente._id }, verifyCliente, {
            new: true,
            useFindAndModify: false,
        });

        await Livro.findOneAndUpdate({ _id: verifyLivro._id }, verifyLivro, {
            new: true,
            useFindAndModify: false,
        });

        res.status(200).send(vendaGuardada);
        return console.log(
            "Pedido POST de nova venda recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Ocorreu algo errado ao tentar criar a venda");
        console.log("Pedido POST de nova venda falhou! Erros:");
        return console.error(error);
    }
});

router.get("/", async(req, res) => {
    try {
        var vendas = await Venda.find({});
        res.status(200).send(vendas);
        return console.log(
            "Pedido GET de todas as vendas recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de todas as vendas falhou! Erros:");
        return console.error(error);
    }
});

router.get("/id/:id", async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!");
        }
        var venda = await Venda.find({ _id: req.params.id });
        if (venda.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhuma venda com esse id");
        }
        res.status(200).send(venda[0]);
        return console.log(
            "Pedido GET de venda por ID recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de venda por ID falhou! Erros:");
        return console.error(error);
    }
});

router.get("/nLivro/:nLivro", async(req, res) => {
    try {
        //Verifica se o livro existe
        var verifyLivro = await Livro.find({ nLivro: req.params.nLivro });
        if (verifyLivro.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum livro com esse número");
        }

        var vendas = await Venda.find({ "livro.nLivro": req.params.nLivro });
        if (vendas.length === 0) {
            return res
                .status(404)
                .send("Não foram encontradas nenhumas vendas desse livro");
        }
        res.status(200).send(vendas);
        return console.log(
            "Pedido GET de vendas por nLivro recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de vendas por nLivro falhou! Erros:");
        return console.error(error);
    }
});

router.get("/idCliente/:idCliente", async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.idCliente)) {
            return res.status(400).send("Esse id não é válido!");
        }
        //Verifica se o cliente existe
        var verifyCliente = await Cliente.find({ _id: req.params.idCliente });
        if (verifyCliente.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum cliente com esse id");
        }

        var vendas = await Venda.find({ "cliente._id": req.params.idCliente });
        if (vendas.length === 0) {
            return res
                .status(404)
                .send("Não foram encontradas nenhumas vendas para esse cliente");
        }
        res.status(200).send(vendas);
        return console.log(
            "Pedido GET de vendas por ID cliente recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de vendas por ID cliente falhou! Erros:");
        return console.error(error);
    }
});

router.get("/emailCliente/:emailCliente", async(req, res) => {
    try {
        //Verifica se o cliente existe
        var verifyCliente = await Cliente.find({ email: req.params.emailCliente });
        if (verifyCliente.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum cliente com esse email");
        }

        var vendas = await Venda.find({
            "cliente.email": req.params.emailCliente,
        });
        if (vendas.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum funcionario com esse id");
        }
        res.status(200).send(vendas);
        return console.log(
            "Pedido GET de funcionario por ID recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de funcionario por ID falhou! Erros:");
        return console.error(error);
    }
});

router.get("/nFuncionario/:nFuncionario", async(req, res) => {
    try {
        //Verifica se o funcionario existe
        var verifyFuncionario = await Funcionario.find({
            nFuncionario: req.params.nFuncionario,
        });
        if (verifyFuncionario.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum funcionario com esse número");
        }

        var vendas = await Venda.find({
            "funcionario.nFuncionario": req.params.nFuncionario,
        });
        if (vendas.length === 0) {
            return res
                .status(404)
                .send(
                    "Não foram encontradas nenhumas vendas realizadas por esse funcionário"
                );
        }
        res.status(200).send(vendas);
        return console.log(
            "Pedido GET de vendas por nFuncionario e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de vendas por nFuncionario falhou! Erros:");
        return console.error(error);
    }
});

router.get("/usados", async(req, res) => {
    try {
        var vendas = await Venda.find({ "livro.usado": true });
        if (vendas.length === 0) {
            return res
                .status(404)
                .send("Não foram encontradas nenhumas vendas de livros usados");
        }
        res.status(200).send(vendas);
        return console.log(
            "Pedido GET de vendas de livros usados recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de vendas de livros usados falhou! Erros:");
        return console.error(error);
    }
});

router.get("/novos", async(req, res) => {
    try {
        var vendas = await Venda.find({ "livro.usado": false });
        if (vendas.length === 0) {
            return res
                .status(404)
                .send("Não foram encontradas nenhumas vendas de livros novos");
        }
        res.status(200).send(vendas);
        return console.log(
            "Pedido GET de vendas de livros novos recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de vendas de livros novos falhou! Erros:");
        return console.error(error);
    }
});

module.exports = router;