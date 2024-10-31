const schedule = require('node-schedule')
const LembreteModel = require('../../models/lembrete.model')
const GrupoModel = require('../../models/grupo.model')
const logger = require('../../services/logger')

class ReminderHandler {
    constructor(client) {
        this.client = client
        this.jobs = new Map()
        this.cleanupJob = null
        this.initializeReminders()
        this.startCleanupSchedule()
    }

    async initializeReminders() {
        try {
            this.jobs.forEach(job => job.cancel())
            this.jobs.clear()

            const lembretes = await LembreteModel.find({
                dataHora: {$gte: new Date()}
            }).populate('turma')

            lembretes.forEach(lembrete => this.scheduleReminder(lembrete))

            logger.info(`Inicialização de lembretes concluída. ${lembretes.length} lembretes agendados.`)
        } catch (error) {
            logger.error('Erro ao inicializar lembretes:', error)
        }
    }

    startCleanupSchedule() {
        if (this.cleanupJob) {
            this.cleanupJob.cancel()
        }

        this.cleanupJob = schedule.scheduleJob('0 3 * * *', async () => {
            await this.cleanupOldReminders()
        })

        this.cleanupOldReminders()

        logger.info('Agendamento de limpeza de lembretes iniciado')
    }

    async cleanupOldReminders() {
        try {
            const now = new Date()
            const result = await LembreteModel.deleteMany({
                dataHora: {$lt: now}
            })

            logger.info(`Lembretes antigos removidos do banco de dados: ${result.deletedCount}`)

            let jobsRemoved = 0
            this.jobs.forEach((job, lembreteId) => {
                const nextInvocation = job.nextInvocation()
                if (!nextInvocation || nextInvocation < now) {
                    this.removeReminder(lembreteId)
                    jobsRemoved++
                }
            })

            const cleanupStats = {
                timestampCleanup: now.toISOString(),
                databaseRemoved: result.deletedCount,
                memoryJobsRemoved: jobsRemoved,
                activeJobs: this.jobs.size
            }

            logger.info('Limpeza de lembretes concluída', cleanupStats)

            return cleanupStats
        } catch (error) {
            logger.error('Erro durante a limpeza de lembretes:', error)
            throw error
        }
    }

    async forceCleanup() {
        return await this.cleanupOldReminders()
    }

    async scheduleReminder(lembrete) {
        try {
            this.removeReminder(lembrete._id.toString())

            if (new Date(lembrete.dataHora) <= new Date()) {
                logger.info(`Lembrete ${lembrete._id} não agendado: data já passou`)
                return
            }

            const grupos = await GrupoModel.find({turma: lembrete.turma._id})

            const job = schedule.scheduleJob(lembrete.dataHora, async () => {
                try {
                    const mensagem = `*LEMBRETE*\n\n📝 ${lembrete.mensagem}`

                    for (const grupo of grupos) {
                        try {
                            await this.client.sendMessage(grupo.id, mensagem)
                            logger.info(`Lembrete ${lembrete._id} enviado para grupo ${grupo.id}`)
                        } catch (error) {
                            logger.error(`Erro ao enviar lembrete para grupo ${grupo.id}:`, error)
                        }
                    }
                } catch (error) {
                    logger.error(`Erro ao processar lembrete ${lembrete._id}:`, error)
                } finally {
                    this.removeReminder(lembrete._id.toString())
                    this.cleanupOldReminders()
                }
            })

            this.jobs.set(lembrete._id.toString(), job)
            logger.info(`Lembrete ${lembrete._id} agendado para ${lembrete.dataHora}`)
        } catch (error) {
            logger.error('Erro ao agendar lembrete:', error)
            throw error
        }
    }

    async addReminder(lembrete) {
        await this.scheduleReminder(lembrete)
    }

    async updateReminder(lembrete) {
        await this.scheduleReminder(lembrete)
    }

    removeReminder(lembreteId) {
        const job = this.jobs.get(lembreteId)
        if (job) {
            job.cancel()
            this.jobs.delete(lembreteId)
            logger.info(`Lembrete ${lembreteId} removido`)
            return true
        }
        return false
    }

    hasReminder(lembreteId) {
        return this.jobs.has(lembreteId)
    }

    getScheduledReminders() {
        const scheduledReminders = []
        this.jobs.forEach((job, lembreteId) => {
            const nextInvocation = job.nextInvocation()
            if (nextInvocation) {
                scheduledReminders.push({
                    lembreteId,
                    nextInvocation: nextInvocation.toISOString()
                })
            }
        })
        return scheduledReminders
    }

    getStats() {
        return {
            totalScheduledReminders: this.jobs.size,
            nextCleanup: this.cleanupJob?.nextInvocation()?.toISOString(),
            scheduledReminders: this.getScheduledReminders()
        }
    }

    stop() {
        this.jobs.forEach(job => job.cancel())
        this.jobs.clear()
        if (this.cleanupJob) {
            this.cleanupJob.cancel()
            this.cleanupJob = null
        }
        logger.info('ReminderHandler parado')
    }
}

module.exports = ReminderHandler