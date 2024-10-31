const mongoose = require('mongoose')

const TurmaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    horarios: {
        segunda: {
            primeiroHorario: String,
            segundoHorario: String,
        },
        terca: {
            primeiroHorario: String,
            segundoHorario: String,
        },
        quarta: {
            primeiroHorario: String,
            segundoHorario: String,
        },
        quinta: {
            primeiroHorario: String,
            segundoHorario: String,
        },
        sexta: {
            primeiroHorario: String,
            segundoHorario: String,
        },
    },
    wikis: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wiki',
    }],
    lembretes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lembrete',
    }],
})

module.exports = mongoose.model('Turma', TurmaSchema)