const mongoose = require('mongoose')

const GrupoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    nome: {
        type: String,
        required: true,
    },
    termoPesquisaLaboratorio: {
        type: String,
        required: false,
    },
    anotacoes: {
        type: String,
        required: false,
    },
    turma: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turma',
        required: false,
    }
})

module.exports = mongoose.model('Grupo', GrupoSchema)