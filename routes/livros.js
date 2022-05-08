var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { Livro } = require("../models/livrosSchema");

router.post("/novo", async(req, res) => {
    try {
        var livro = new Livro(req.body);

        var verifLivroExiste = await Livro.find({
            nLivro: req.body.nLivro,
            usado: req.body.usado,
        });

        var livroGuardado;

        if (verifLivroExiste.length === 0) {
            if (livro.stock == null) {
                livro.stock = 1;
            }
            livroGuardado = await livro.save();
            res.status(200).send(livroGuardado);
        } else {
            verifLivroExiste = verifLivroExiste[0];
            verifLivroExiste.stock = verifLivroExiste.stock + 1;

            livroGuardado = await Livro.findOneAndUpdate({ _id: verifLivroExiste._id },
                verifLivroExiste, {
                    new: true,
                    useFindAndModify: false,
                }
            );

            res.status(200).send(livroGuardado);
        }

        return console.log(
            "Pedido POST de novo livro recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Ocorreu algo errado ao tentar criar o livro");
        console.log("Pedido POST de novo livro falhou! Erros:");
        return console.error(error);
    }
});

router.get("/", async(req, res) => {
    try {
        var livros = await Livro.find({});
        res.status(200).send(livros);
        return console.log(
            "Pedido GET de todos os livros recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de todos os livros falhou! Erros:");
        return console.error(error);
    }
});

router.get("/id/:id", async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!");
        }
        var livro = await Livro.find({ _id: req.params.id });
        if (livro.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum livro com esse id");
        }
        res.status(200).send(livro[0]);
        return console.log(
            "Pedido GET de livro por ID recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido GET de livro por ID falhou! Erros:");
        return console.error(error);
    }
});

router.patch("/alterar", async(req, res) => {
    try {
        var livro = new Livro(req.body);
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body._id)) {
            return res.status(400).send("Esse id não é válido!");
        }
        var verifyLivro = await Livro.find({ _id: req.body._id });
        if (verifyLivro.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum livro com esse id");
        }
        var livroGuardado = await Livro.findOneAndUpdate({ _id: req.body._id },
            livro, { new: true, useFindAndModify: false }
        );
        res.status(200).send(livroGuardado);
        return console.log(
            "Pedido PATCH de alterar um livro recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido PATCH de alterar um livro falhou! Erros:");
        return console.error(error);
    }
});

router.put("/stock", async(req, res) => {
    try {
        if (!req.body.nLivro) {
            return res.status(400).send('Precisa de especificar o "nLivro"!');
        }
        if (req.body.usado == null) {
            return res
                .status(400)
                .send(
                    'Precisa de especificar se o livro é "usado" (true), ou não (false)!'
                );
        }
        if (!req.body.valor) {
            return res
                .status(400)
                .send(
                    'Precisa de especificar o "valor" a adicionar no stock! (Se quiser retirar stock adicione um valor negativo)'
                );
        }

        var verifyLivro = await Livro.find({
            nLivro: req.body.nLivro,
            usado: req.body.usado,
        });
        let aux1;
        if (req.body.usado) {
            aux1 = "usado";
        } else {
            aux1 = "novo";
        }
        if (verifyLivro.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum livro " + aux1 + " com esse id");
        }

        verifyLivro = verifyLivro[0];

        var novoStock = Math.trunc(verifyLivro.stock + req.body.valor);
        if (novoStock < 0) {
            novoStock = 0;
        }

        verifyLivro.stock = novoStock;

        var livroGuardado = await Livro.findOneAndUpdate({ _id: verifyLivro._id },
            verifyLivro, { new: true, useFindAndModify: false }
        );

        let aux2;
        if (req.body.valor < 0) {
            aux2 = "retirado";
        } else {
            aux2 = "adicionado";
        }

        res
            .status(200)
            .send(
                "Foi " +
                aux2 +
                " " +
                req.body.valor +
                ' ao livro "' +
                verifyLivro.nome +
                '" do autor "' +
                verifyLivro.autor +
                '" no estado "' +
                aux1 +
                '" ficando com um total de ' +
                verifyLivro.stock +
                " em stock."
            );
        return console.log(
            "Pedido PUT de alterar o stock de um livro recebido e feito com sucesso"
        );
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido PUT de alterar o stock de um livro falhou! Erros:");
        return console.error(error);
    }
});

router.delete("/eliminar/:id", async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!");
        }
        var livro = await Livro.find({ _id: req.params.id });
        if (livro.length === 0) {
            return res
                .status(404)
                .send("Não foi encontrado nenhum livro com esse id");
        }
        await Livro.deleteOne({ _id: req.params.id });
        res.status(200).send("O livro foi eliminado com sucesso!");
        return console.log("Pedido DELETE livro recebido e feito com sucesso");
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido");
        console.log("Pedido DELETE livro falhou! Erros:");
        return console.error(error);
    }
});

module.exports = router;