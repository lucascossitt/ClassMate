const express = require('express');
const Wiki = require('../models/Wiki');
const router = express.Router();

// Cria uma nova wiki
router.post('/', async (req, res) => {
    try {
        const wiki = new Wiki(req.body);
        await wiki.save();
        res.status(201).json(wiki);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Lista todas as wikis
router.get('/', async (req, res) => {
    try {
        const {turmaId} = req.query
        const filtro = turmaId ? {turma: turmaId} : {}
        const wikis = await Wiki.find(filtro).populate('turma');
        res.json(wikis);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Busca uma wiki por ID
router.get('/:id', async (req, res) => {
    try {
        const wiki = await Wiki.findById(req.params.id).populate('turma');
        if (!wiki) return res.status(404).json({message: 'Wiki não encontrada'});
        res.json(wiki);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Atualiza uma wiki por ID
router.put('/:id', async (req, res) => {
    try {
        const wiki = await Wiki.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!wiki) return res.status(404).json({message: 'Wiki não encontrada'});
        res.json(wiki);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Exclui uma wiki por ID
router.delete('/:id', async (req, res) => {
    try {
        const wiki = await Wiki.findByIdAndDelete(req.params.id);
        if (!wiki) return res.status(404).json({message: 'Wiki não encontrada'});
        res.json({message: 'Wiki excluída com sucesso'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;