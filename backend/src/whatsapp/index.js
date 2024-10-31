const whatsappClient = require('./client')
const CommandHandler = require('./handlers/commandHandler')
const ReminderHandler = require('./handlers/reminderHandler')
const GrupoModel = require('../models/grupo.model')

class WhatsAppModule {
    constructor() {
        this.client = whatsappClient.getClient()
        this.reminderHandler = null
    }

    initialize() {
        whatsappClient.initialize()

        this.setupMessageHandler()
        this.setupGroupHandler()

        this.client.on('ready', () => {
            this.client.bot = '554488441949@c.us'
            this.reminderHandler = new ReminderHandler(this.client)
            this.syncGroups()
        })
    }

    async setupMessageHandler() {
        this.client.on('message', async msg => {
            try {
                whatsappClient.botInfo.messageCount++

                if (!msg.from.endsWith('@g.us')) return

                if (msg.body.startsWith('!')) {
                    const [command, ...args] = msg.body.trim().split(' ')
                    const response = await CommandHandler.handleCommand(msg, command.toLowerCase(), args)
                    if (response) {
                        await msg.reply(response)
                    }
                }
            } catch (error) {
                console.error('Erro ao processar mensagem:', error)
            }
        })
    }

    async setupGroupHandler() {
        this.client.on('group_join', async (notification) => {
            try {
                if (notification.recipientIds.includes(this.client.bot)) {
                    const chat = await notification.getChat()
                    await GrupoModel.create({
                        id: chat.id._serialized,
                        nome: chat.name
                    })
                    whatsappClient.botInfo.groupCount++
                    console.log(`Bot adicionado ao grupo: ${chat.name}`)
                }
            } catch (error) {
                console.error('Erro ao processar entrada em grupo:', error)
            }
        })
    }

    async syncGroups() {
        try {
            const chats = await this.client.getChats()
            await Promise.allSettled(chats.filter(c => c.isGroup).map(async grupo => {
                try {
                    const grupoDb = await GrupoModel.findOne({id: grupo.id._serialized})
                    if (!grupoDb) {
                        await GrupoModel.create({
                            id: grupo.id._serialized,
                            nome: grupo.name
                        })
                        console.log(`Grupo ${grupo.name} adicionado no banco de dados`)
                    } else if (grupoDb.nome !== grupo.name) {
                        grupoDb.nome = grupo.name
                        await grupoDb.save()
                        console.log(`Nome do grupo ${grupo.name} atualizado no banco de dados`)
                    }
                } catch (err) {
                    console.error('Erro ao cadastrar grupo:', err)
                }
            }))
        } catch (error) {
            console.error('Erro ao sincronizar grupos:', error)
        }
    }

    getReminderHandler() {
        return this.reminderHandler
    }
}

module.exports = new WhatsAppModule()