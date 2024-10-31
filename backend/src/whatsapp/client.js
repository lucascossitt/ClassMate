const {Client, LocalAuth} = require('whatsapp-web.js')
const qr = require('qrcode-terminal')

class WhatsAppClient {
    constructor() {
        if (WhatsAppClient.instance) {
            return WhatsAppClient.instance
        }

        this.client = new Client({
            authStrategy: new LocalAuth({clientId: 'ClassMate'}),
            puppeteer: {
                headless: true
            }
        })

        this.botInfo = {
            state: 'DISCONNECTED',
            groupCount: 0,
            messageCount: 0,
            uptime: 0,
            startTime: null
        }

        WhatsAppClient.instance = this
    }

    initialize() {
        this.client.on('qr', (qrCode) => {
            qr.generate(qrCode, {small: true})
            console.log('QR Code gerado')
        })

        this.client.on('ready', () => {
            console.log('Cliente WhatsApp pronto')
            this.botInfo.state = 'CONNECTED'
            this.botInfo.startTime = Date.now()
            this.updateBotInfo()
        })

        this.client.on('authenticated', () => {
            console.log('Cliente WhatsApp autenticado')
        })

        this.client.on('auth_failure', (msg) => {
            console.error('Falha na autenticação:', msg)
        })

        this.client.initialize()

        setInterval(() => this.updateBotInfo(), 60000)
    }

    async updateBotInfo() {
        try {
            const chats = await this.client.getChats()
            this.botInfo.groupCount = chats.filter(c => c.isGroup).length
            this.botInfo.state = await this.client.getState()
            this.botInfo.uptime = Math.floor((Date.now() - this.botInfo.startTime) / 1000)
        } catch (error) {
            console.error('Erro ao atualizar informações do bot:', error)
        }
    }

    getBotInfo() {
        return this.botInfo
    }

    getClient() {
        return this.client
    }
}

const whatsappClient = new WhatsAppClient()
module.exports = whatsappClient