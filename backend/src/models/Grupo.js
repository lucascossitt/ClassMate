const mongoose = require('mongoose')

const GrupoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    termoPesquisaLaboratorio: {
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