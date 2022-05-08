var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { Cliente } = require("../models/clientesSchema");

router.post("/novo", async(req, res) => {
    try {
        var cliente = new Cliente(req.body);
        var clienteGuardado = await cliente.save();
        res.status(200).send(clienteGuardado);
        return console.log(
            "Pedido POST de novo cliente recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Ocorreu algo errado ao tentar criar o cliente");
        console.log("Pedido POST de novo cliente falhou! Erros:");
        return console.error(error);
    }
});

router.get("/", async(req, res) => {
    try {
        var clientes = await Cliente.find({});
        res.status(200).send(clientes);
        return console.log(
            "Pedido GET de todos os clientes recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de todos os clientes falhou! Erros:");
        return console.error(error);
    }
});

router.get("/id/:id", async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!");
        }
        var cliente = await Cliente.find({ _id: req.params.id });
        if (cliente.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum cliente com esse id");
        }
        res.status(200).send(cliente[0]);
        return console.log(
            "Pedido GET de cliente por ID recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de cliente por ID falhou! Erros:");
        return console.error(error);
    }
});

router.patch("/alterar", async(req, res) => {
    try {
        var cliente = new Cliente(req.body);
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body._id)) {
            return res.status(400).send("Esse id não é válido!");
        }
        var verifyCliente = await Cliente.find({ _id: req.body._id });
        if (verifyCliente.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum cliente com esse id");
        }
        var clienteGuardado = await Cliente.findOneAndUpdate({ _id: req.body._id },
            cliente, { new: true, useFindAndModify: false }
        );
        res.status(200).send(clienteGuardado);
        return console.log(
            "Pedido PATCH de alterar um cliente recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido PATCH de alterar um cliente falhou! Erros:");
        return console.error(error);
    }
});

router.delete("/eliminar/:id", async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!");
        }
        var cliente = await Cliente.find({ _id: req.params.id });
        if (cliente.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum cliente com esse id");
        }
        await Cliente.deleteOne({ _id: req.params.id });
        res.status(200).send("O cliente foi eliminado com sucesso!");
        return console.log("Pedido DELETE cliente recebido e feito com sucesso");
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido DELETE cliente falhou! Erros:");
        return console.error(error);
    }
});

module.exports = router;