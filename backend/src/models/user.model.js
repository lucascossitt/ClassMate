const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email inválido']
    },
    senha: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [8, 'Senha deve ter no mínimo 8 caracteres'],
        select: false
    },
    role: {
        type: String,
        enum: ['sysadmin', 'admin'],
        default: 'admin'
    },
    turmas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turma'
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    criadoEm: {
        type: Date,
        default: Date.now
    },
    ultimoAcesso: {
        type: Date
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('senha')) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        this.senha = await bcrypt.hash(this.senha, salt)
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.senha)
}

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {id: this._id, role: this.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE || '24h'}
    )
}

module.exports = mongoose.model('User', userSchema)