const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const errorHandler = require('./middlewares/errorHandler')
const authController = require('./controllers/auth.controller')

const authRouter = require('./routes/auth')
const turmaRouter = require('./routes/turma')
const wikiRouter = require('./routes/wiki')
const lembreteRouter = require('./routes/lembrete')
const grupoRouter = require('./routes/grupo')
const statsRouter = require('./routes/stats')
const whatsappClient = require('../whatsapp/client')

class ApiModule {
    constructor() {
        this.app = express()
        this.setupMiddleware()
        this.setupRoutes()
        this.setupErrorHandling()
    }

    setupMiddleware() {
        this.app.use(cors())
        this.app.use(helmet())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended: true}))
    }

    setupRoutes() {
        this.app.use('/auth', authRouter)

        this.app.get('/', (req, res) => {
            res.status(200).send('ClassMate API Online')
        })

        this.app.get('/whatsapp-infos', authController.protect, authController.restrictTo('admin'), (req, res) => {
            res.status(200).json(whatsappClient.getBotInfo())
        })

        this.app.use('/turma', authController.protect, turmaRouter)
        this.app.use('/wiki', authController.protect, wikiRouter)
        this.app.use('/lembrete', authController.protect, lembreteRouter)
        this.app.use('/grupo', authController.protect, grupoRouter)
        this.app.use('/stats', authController.protect, statsRouter)
    }

    setupErrorHandling() {
        this.app.use(errorHandler)
    }

    start(port) {
        this.app.listen(port, () => {
            console.log(`API iniciada na porta ${port}`)
        })
    }
}

module.exports = new ApiModule()