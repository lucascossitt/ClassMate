const User = require('../../models/user.model')
const AppError = require('../../utils/appError')
const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const logger = require('../../services/logger')

class AuthController {
    async register(req, res, next) {
        try {
            const {nome, email, senha, role} = req.body

            const userExists = await User.findOne({email})
            if (userExists) {
                throw new AppError(400, 'Email já está em uso')
            }

            const user = await User.create({
                nome,
                email,
                senha,
                role: role || 'professor'
            })

            user.senha = undefined
            const token = user.generateToken()

            logger.info(`Novo usuário registrado: ${user.email}`)

            res.status(201).json({
                status: 'success',
                token,
                data: {user}
            })
        } catch (error) {
            logger.error(`Erro no registro: ${error.message}`)
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const {email, senha} = req.body

            if (!email || !senha) {
                throw new AppError(400, 'Por favor, forneça email e senha')
            }

            const user = await User.findOne({email}).select('+senha')

            if (!user || !(await user.comparePassword(senha))) {
                throw new AppError(401, 'Email ou senha incorretos')
            }

            user.ultimoAcesso = new Date()
            await user.save({validateBeforeSave: false})

            user.senha = undefined
            const token = user.generateToken()

            logger.info(`Login bem-sucedido: ${user.email}`)

            res.status(200).json({
                status: 'success',
                token,
                data: {user}
            })
        } catch (error) {
            logger.error(`Erro no login: ${error.message}`)
            next(error)
        }
    }

    async protect(req, res, next) {
        try {
            const token = req.headers.authorization?.startsWith('Bearer')
                ? req.headers.authorization.split(' ')[1]
                : null

            if (!token) {
                throw new AppError(401, 'Você não está autenticado')
            }

            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

            const user = await User.findById(decoded.id)
            if (!user) {
                throw new AppError(401, 'Usuário não existe mais')
            }

            req.user = user
            next()
        } catch (error) {
            logger.error(`Erro na autenticação: ${error.message}`)
            next(error)
        }
    }

    restrictTo(...roles) {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                throw new AppError(403, 'Você não tem permissão para esta ação')
            }
            next()
        }
    }

    async updatePassword(req, res, next) {
        try {
            const {senhaAtual, novaSenha, confirmarSenha} = req.body

            if (!senhaAtual || !novaSenha || !confirmarSenha) {
                throw new AppError(400, 'Por favor, forneça todas as senhas necessárias')
            }

            if (novaSenha !== confirmarSenha) {
                throw new AppError(400, 'Nova senha e confirmação não conferem')
            }

            const user = await User.findById(req.user.id).select('+senha')

            if (!(await user.comparePassword(senhaAtual))) {
                throw new AppError(401, 'Senha atual incorreta')
            }

            user.senha = novaSenha
            await user.save()

            const token = user.generateToken()

            logger.info(`Senha atualizada: ${user.email}`)

            res.status(200).json({
                status: 'success',
                token,
                message: 'Senha atualizada com sucesso'
            })
        } catch (error) {
            logger.error(`Erro na atualização de senha: ${error.message}`)
            next(error)
        }
    }
}

module.exports = new AuthController()