const express = require('express')
const Grupo = require('../models/Grupo')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const grupos = await Grupo.find().populate('turma')
        res.json(grupos)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const grupo = await Grupo.findById(req.params.id).populate('turma')
        if (!grupo) return res.status(404).json({message: 'Grupo não encontrado'})
        res.json(grupo)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.put('/:id', async (req, res) => {
    try {

        const grupo = await Grupo.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    turma: req.body.turma || null,
                    termoPesquisaLaboratorio: req.body.termoPesquisaLaboratorio,
                    anotacoes: req.body.anotacoes
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).populate('turma')

        if (!grupo) {
            return res.status(404).json({message: 'Grupo não encontrado'})
        }

        res.json(grupo)
    } catch (error) {
        console.error('Erro ao atualizar grupo:', error)
        res.status(400).json({message: error.message})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const grupo = await Grupo.findByIdAndDelete(req.params.id)
        if (!grupo) return res.status(404).json({message: 'Grupo não encontrado'})
        res.json({message: 'Grupo excluído com sucesso'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

module.exports = router