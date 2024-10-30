const express = require('express');
const Turma = require('../models/Turma');
const router = express.Router();

// Cria uma nova turma
router.post('/', async (req, res) => {
    try {
        const turma = new Turma(req.body);
        await turma.save();
        res.status(201).json(turma);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lista todas as turmas
router.get('/', async (req, res) => {
    try {
        const turmas = await Turma.find().populate('wikis lembretes');
        res.json(turmas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Busca uma turma por ID
router.get('/:id', async (req, res) => {
    try {
        const turma = await Turma.findById(req.params.id).populate('wikis lembretes');
        if (!turma) return res.status(404).json({ message: 'Turma não encontrada' });
        res.json(turma);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Atualiza uma turma por ID
router.put('/:id', async (req, res) => {
    try {
        const turma = await Turma.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!turma) return res.status(404).json({ message: 'Turma não encontrada' });
        res.json(turma);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Exclui uma turma por ID
router.delete('/:id', async (req, res) => {
    try {
        const turma = await Turma.findByIdAndDelete(req.params.id);
        if (!turma) return res.status(404).json({ message: 'Turma não encontrada' });
        res.json({ message: 'Turma excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;