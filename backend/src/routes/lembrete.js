const express = require('express');
const Lembrete = require('../models/Lembrete');
const router = express.Router();

// Cria um novo lembrete
router.post('/', async (req, res) => {
    try {
        const lembrete = new Lembrete(req.body);
        await lembrete.save();
        res.status(201).json(lembrete);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lista todos os lembretes
router.get('/', async (req, res) => {
    try {
        const {turmaId} = req.query
        const filtro = turmaId ? {turma: turmaId} : {}
        const lembretes = await Lembrete.find(filtro).populate('turma');
        res.json(lembretes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Busca um lembrete por ID
router.get('/:id', async (req, res) => {
    try {
        const lembrete = await Lembrete.findById(req.params.id).populate('turma');
        if (!lembrete) return res.status(404).json({ message: 'Lembrete não encontrado' });
        res.json(lembrete);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Atualiza um lembrete por ID
router.put('/:id', async (req, res) => {
    try {
        const lembrete = await Lembrete.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lembrete) return res.status(404).json({ message: 'Lembrete não encontrado' });
        res.json(lembrete);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Exclui um lembrete por ID
router.delete('/:id', async (req, res) => {
    try {
        const lembrete = await Lembrete.findByIdAndDelete(req.params.id);
        if (!lembrete) return res.status(404).json({ message: 'Lembrete não encontrado' });
        res.json({ message: 'Lembrete excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;