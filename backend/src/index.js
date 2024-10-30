const {Client, LocalAuth} = require('whatsapp-web.js')
const mongoose = require('mongoose')
const GrupoModel = require('./models/Grupo')
const qr = require('qrcode-terminal')

mongoose.connect('mongodb://127.0.0.1:27017/classmate')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(error => console.error('Erro ao conectar ao MongoDB:', error))

const client = new Client({
    authStrategy: new LocalAuth({clientId: 'ClassMate'}),
    puppeteer: {
        headless: true
    }
})

client.on('loading_screen', (percent) => console.log(`CARREGANDO: ${percent}%`))
client.on('auth_failure', msg => console.error(msg))
client.on('authenticated', async () => console.log('AUTENTICADO'))
client.on('call', async call => await call.reject())
client.on('ready', async function () {
    client.bot = '554488441949@c.us'

    const chats = await client.getChats()
    await Promise.allSettled(chats.filter(c => c.isGroup).map(async grupo => {
        try {
            const grupoDb = await GrupoModel.findOne({id: grupo.id._serialized})
            if (!grupoDb) {
                const result = await GrupoModel.create({id: grupo.id._serialized})
                console.log(`Grupo ${grupo.name} adicionado no banco de dados`, result)
            }
        } catch (err) {
            console.error('Erro ao cadastrar grupo', err, chat)
        }
    }))

    client.botInfo = {
        state: await client.getState(),
        groupCount: chats.filter(c => c.isGroup).length,
        messageCount: 0,
        uptime: 0,
        startTime: Date.now()
    }

    setInterval(async () => {
        const chats = await client.getChats()
        const grupos = chats.filter(c => c.isGroup)
        client.botInfo.groupCount = grupos.length
        client.botInfo.state = await client.getState()
        client.botInfo.uptime = Math.floor((Date.now() - client.botInfo.startTime) / 1000)
    }, 60000)
})

client.on('group_join', async function (data) {
    try {
        client.botInfo.groupCount++
        if (data.recipientIds.includes(client.bot)) {
            const grupo = await data.getChat()
            const grupoDb = await GrupoModel.findOne({id: grupo.id._serialized})
            if (!grupoDb) {
                const result = await GrupoModel.create({id: grupo.id._serialized})
                console.log(`Grupo ${grupo.name} adicionado no banco de dados`, result)
            }
        }
    } catch (err) {
        console.error(err)
    }
})

client.on('qr', async function (qrCode) {
    qr.generate(qrCode, {small: true})
})

client.on('message', async function (message) {
    client.botInfo.messageCount++
})

client.initialize().then(() => console.log('Inicializado'))

// ------------------------------------------------------- API
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')

const turmaRouter = require('./routes/turma')
const wikiRouter = require('./routes/wiki')
const lembreteRouter = require('./routes/lembrete')

const app = express()
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/turma', turmaRouter)
app.use('/wiki', wikiRouter)
app.use('/lembrete', lembreteRouter)

app.get('/', async function (req, res) {
    res.status(200).send('Online')
})
app.get('/whatsapp-infos', async function (req, res) {
    res.status(200).send(client.botInfo)
})

app.listen(8080, () => console.log('Iniciado na porta 8080'))