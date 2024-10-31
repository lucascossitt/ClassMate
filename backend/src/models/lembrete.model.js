const mongoose = require('mongoose')

const LembreteSchema = new mongoose.Schema({
    mensagem: {
        type: String,
        required: true,
    },
    dataHora: {
        type: Date,
        required: true,
    },
    turma: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turma',
        required: true,
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Lembrete', LembreteSchema)