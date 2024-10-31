const express = require('express')
const Grupo = require('../../models/grupo.model')
const Lembrete = require('../../models/lembrete.model')
const Turma = require('../../models/turma.model')
const Wiki = require('../../models/wiki.model')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const grupoCount = await Grupo.countDocuments()
        const lembreteCount = await Lembrete.countDocuments()
        const turmaCount = await Turma.countDocuments()
        const wikiCount = await Wiki.countDocuments()

        res.status(200).json({
            grupoCount,
            lembreteCount,
            turmaCount,
            wikiCount
        })
    } catch (error) {
        res.status(500).json({message: error.message})
        console.error(error)
    }
})

module.exports = router