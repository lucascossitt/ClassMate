const TurmaModel = require('../../models/turma.model')
const WikiModel = require('../../models/wiki.model')
const LembreteModel = require('../../models/lembrete.model')
const GrupoModel = require('../../models/grupo.model')

class CommandHandler {
    static async handleCommand(message, command, args) {
        switch (command) {
            case '!horario':
                return await this.handleHorario(message)
            case '!wiki':
                return await this.handleWiki(message, args)
            case '!lembrete':
                return await this.handleLembrete(message, args)
            case '!ajuda':
                return this.handleAjuda(message)
            default:
                return null
        }
    }

    static async handleHorario(message) {
        try {
            const grupo = await GrupoModel.findOne({id: message.from}).populate('turma')
            if (!grupo || !grupo.turma) {
                return 'Este grupo não está vinculado a nenhuma turma.'
            }

            const turma = grupo.turma
            const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']
            const hoje = diasSemana[new Date().getDay()]

            if (!turma.horarios || !turma.horarios[hoje]) {
                return 'Não há aulas hoje.'
            }

            const horarios = turma.horarios[hoje]
            return `*Horários de Hoje (${hoje})*:\n\n` +
                `1º Horário: ${horarios.primeiroHorario || 'Não definido'}\n` +
                `2º Horário: ${horarios.segundoHorario || 'Não definido'}`
        } catch (error) {
            console.error('Erro ao buscar horário:', error)
            return 'Erro ao buscar horários. Tente novamente.'
        }
    }

    static async handleWiki(message, args) {
        try {
            const grupo = await GrupoModel.findOne({id: message.from}).populate('turma')
            if (!grupo || !grupo.turma) {
                return 'Este grupo não está vinculado a nenhuma turma.'
            }

            if (!args.length) {
                const wikis = await WikiModel.find({turma: grupo.turma._id})
                if (!wikis.length) return 'Não há wikis cadastradas para esta turma.'

                return '*Wikis Disponíveis:*\n\n' +
                    wikis.map((wiki, index) => `${index + 1}. ${wiki.titulo}`).join('\n') +
                    '\n\nUse !wiki <número> para ver o conteúdo.'
            }

            const index = parseInt(args[0]) - 1
            const wikis = await WikiModel.find({turma: grupo.turma._id})
            if (!wikis[index]) return 'Wiki não encontrada.'

            return `*${wikis[index].titulo}*\n\n${wikis[index].conteudo}`
        } catch (error) {
            console.error('Erro ao buscar wiki:', error)
            return 'Erro ao buscar wiki. Tente novamente.'
        }
    }

    static async handleLembrete(message, args) {
        try {
            const grupo = await GrupoModel.findOne({id: message.from}).populate('turma')
            if (!grupo || !grupo.turma) {
                return 'Este grupo não está vinculado a nenhuma turma.'
            }

            const lembretes = await LembreteModel.find({
                turma: grupo.turma._id,
                dataHora: {$gte: new Date()}
            }).sort({dataHora: 1})

            if (!lembretes.length) return 'Não há lembretes próximos.'

            return '*Próximos Lembretes:*\n\n' +
                lembretes.map(lembrete => {
                    const data = new Date(lembrete.dataHora)
                    return `📅 ${data.toLocaleDateString('pt-BR')} ${data.toLocaleTimeString('pt-BR')}\n` +
                        `📝 ${lembrete.mensagem}\n`
                }).join('\n')
        } catch (error) {
            console.error('Erro ao buscar lembretes:', error)
            return 'Erro ao buscar lembretes. Tente novamente.'
        }
    }

    static handleAjuda() {
        return `*Comandos Disponíveis:*\n\n` +
            `!horario - Mostra os horários de aula de hoje\n` +
            `!wiki - Lista todas as wikis disponíveis\n` +
            `!wiki <número> - Mostra o conteúdo de uma wiki específica\n` +
            `!lembrete - Lista os próximos lembretes\n` +
            `!ajuda - Mostra esta mensagem de ajuda`
    }
}

module.exports = CommandHandler