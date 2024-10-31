const mongoose = require('mongoose')

const WikiSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    conteudo: {
        type: String,
        required: true,
    },
    dataCriacao: {
        type: Date,
        default: Date.now,
    },
    turma: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turma',
        required: true,
    },
})

module.exports = mongoose.model('Wiki', WikiSchema)