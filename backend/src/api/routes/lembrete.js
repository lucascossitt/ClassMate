const express = require('express')
const Lembrete = require('../../models/lembrete.model')
const router = express.Router()
const whatsappModule = require('../../whatsapp')

router.post('/', async (req, res) => {
    try {
        const lembrete = new Lembrete(req.body)
        await lembrete.save()

        const reminderHandler = whatsappModule.getReminderHandler()
        if (reminderHandler) {
            await reminderHandler.addReminder(lembrete)
        }

        res.status(201).json(lembrete)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/', async (req, res) => {
    try {
        const {turmaId} = req.query
        const filtro = turmaId ? {turma: turmaId} : {}
        const lembretes = await Lembrete.find(filtro).populate('turma')
        res.json(lembretes)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const lembrete = await Lembrete.findById(req.params.id).populate('turma')
        if (!lembrete) return res.status(404).json({message: 'Lembrete não encontrado'})
        res.json(lembrete)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.put('/:id', async (req, res) => {
    try {
        const lembreteAntigo = await Lembrete.findById(req.params.id)
        if (!lembreteAntigo) {
            return res.status(404).json({message: 'Lembrete não encontrado'})
        }

        const lembreteAtualizado = await Lembrete.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        ).populate('turma')

        if (!lembreteAtualizado) {
            return res.status(404).json({message: 'Lembrete não encontrado'})
        }

        const reminderHandler = whatsappModule.getReminderHandler()
        if (reminderHandler) {
            if (lembreteAntigo.dataHora.getTime() !== new Date(lembreteAtualizado.dataHora).getTime() ||
                lembreteAntigo.mensagem !== lembreteAtualizado.mensagem) {
                await reminderHandler.updateReminder(lembreteAtualizado)
            }
        }

        res.json(lembreteAtualizado)
    } catch (error) {
        console.error('Erro ao atualizar lembrete:', error)
        res.status(400).json({message: error.message})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const lembrete = await Lembrete.findByIdAndDelete(req.params.id)
        if (!lembrete) return res.status(404).json({message: 'Lembrete não encontrado'})

        const reminderHandler = whatsappModule.getReminderHandler()
        if (reminderHandler) {
            await reminderHandler.removeReminder(lembrete._id.toString())
        }

        res.json({message: 'Lembrete excluído com sucesso'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post('/cleanup', async (req, res) => {
    try {
        const reminderHandler = whatsappModule.getReminderHandler()
        if (!reminderHandler) {
            return res.status(503).json({message: 'Serviço de lembretes não disponível'})
        }

        const stats = await reminderHandler.forceCleanup()
        res.json({
            message: 'Limpeza de lembretes executada com sucesso',
            stats
        })
    } catch (error) {
        logger.error('Erro ao executar limpeza de lembretes:', error)
        res.status(500).json({message: 'Erro ao executar limpeza de lembretes'})
    }
})

router.get('/stats', (req, res) => {
    try {
        const reminderHandler = whatsappModule.getReminderHandler()
        if (!reminderHandler) {
            return res.status(503).json({message: 'Serviço de lembretes não disponível'})
        }

        const stats = reminderHandler.getStats()
        res.json(stats)
    } catch (error) {
        logger.error('Erro ao obter estatísticas dos lembretes:', error)
        res.status(500).json({message: 'Erro ao obter estatísticas dos lembretes'})
    }
})

module.exports = router