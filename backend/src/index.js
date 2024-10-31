const mongoose = require('mongoose')
const whatsappModule = require('./whatsapp')
const apiModule = require('./api')

mongoose.connect('mongodb://127.0.0.1:27017/classmate')
    .then(() => {
        console.log('Conectado ao MongoDB')
        whatsappModule.initialize()
        apiModule.start(8080)
    })
    .catch(error => {
        console.error('Erro ao conectar ao MongoDB:', error)
        process.exit(1)
    })