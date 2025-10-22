/*********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de classificacao no Banco de Dados MySQL
 * Data: 22/10/2025
 * Autor: Eduardo Feitosa
 * Versão: 1.0
 **********************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllRating = async function() {
    try {
        let sql = 'select * from tb_classificacao order by classificacao_id desc'

        let result = await prisma.$queryRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectByIdRating = async function(id) {
    try {
        let sql = `select * from tb_classificacao where classificacao_id=${id}`

        let result = await prisma.$queryRawUnsafe(sql)
        
        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectLastIdRating = async function() {
    try {
        let sql = 'select classificacao_id from tb_classificacao order by classificacao_id desc limit 1'
    
        let result = await prisma.$queryRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const setInsertRating = async function(classificacao) {
    try {
        let sql = `insert into tb_classificacao(nome, idade_minima) 
                    values('${classificacao.nome}', ${classificacao.idade_minima})`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const setUpdateRating = async function(classificacao) {
    try {
        let sql = `update tb_classificacao set nome='${classificacao.nome}', 
        idade_minima=${classificacao.idade_minima} where classificacao_id=${classificacao.id}`

        let result = await prisma.$executeRawUnsafe(sql)
        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const setDeleteRating = async function(id) {
    try {
        let sql = `delete from tb_classificacao where classificacao_id=${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllRating,
    getSelectByIdRating,
    getSelectLastIdRating,
    setInsertRating,
    setUpdateRating,
    setDeleteRating
}