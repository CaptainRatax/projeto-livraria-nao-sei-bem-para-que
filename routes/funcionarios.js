var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { Funcionario } = require("../models/funcionariosSchema");

router.post("/novo", async(req, res) => {
    try {
        var funcionario = new Funcionario(req.body);
        var funcionarioGuardado = await funcionario.save();
        res.status(200).send(funcionarioGuardado);
        return console.log(
            "Pedido POST de novo funcionário recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Ocorreu algo errado ao tentar criar o funcionário");
        console.log("Pedido POST de novo funcionário falhou! Erros:");
        return console.error(error);
    }
});

router.get("/", async(req, res) => {
    try {
        var funcionarios = await Funcionario.find({});
        res.status(200).send(funcionarios);
        return console.log(
            "Pedido GET de todos os funcionarios recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de todos os funcionarios falhou! Erros:");
        return console.error(error);
    }
});

router.get("/id/:id", async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!");
        }
        var funcionario = await Funcionario.find({ _id: req.params.id });
        if (funcionario.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum funcionario com esse id");
        }
        res.status(200).send(funcionario[0]);
        return console.log(
            "Pedido GET de funcionario por ID recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de funcionario por ID falhou! Erros:");
        return console.error(error);
    }
});

router.patch("/alterar", async(req, res) => {
    try {
        var funcionario = new Funcionario(req.body);
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body._id)) {
            return res.status(400).send("Esse id não é válido!");
        }
        var verifyFuncionario = await Funcionario.find({ _id: req.body._id });
        if (verifyFuncionario.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum funcionario com esse id");
        }
        var funcionarioGuardado = await Funcionario.findOneAndUpdate({ _id: req.body._id },
            funcionario, { new: true, useFindAndModify: false }
        );
        res.status(200).send(funcionarioGuardado);
        return console.log(
            "Pedido PATCH de alterar um funcionario recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido PATCH de alterar um funcionario falhou! Erros:");
        return console.error(error);
    }
});

router.delete("/eliminar/:id", async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!");
        }
        var funcionario = await Funcionario.find({ _id: req.params.id });
        if (funcionario.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum funcionario com esse id");
        }
        await Funcionario.deleteOne({ _id: req.params.id });
        res.status(200).send("O funcionario foi eliminado com sucesso!");
        return console.log(
            "Pedido DELETE funcionario recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido DELETE funcionario falhou! Erros:");
        return console.error(error);
    }
});

module.exports = router;