const AppError = require('../../utils/appError')
const logger = require('../../services/logger')

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    logger.error('Error:', {
        statusCode: err.statusCode,
        message: err.message,
        stack: err.stack
    })

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    } else {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Algo deu errado!'
            })
        }
    }
}

module.exports = errorHandler