/*********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de ator no Banco de Dados MySQL
 * Data: 22/10/2025
 * Autor: Eduardo Feitosa
 * Versão: 1.0
 **********************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllActor = async function() {
    try {
        let sql = 'select * from tb_ator order by ator_id desc'

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

const getSelectByIdActor = async function(id) {
    try {
        let sql = `select * from tb_ator where ator_id=${id}`

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

const getSelectLastIdActor = async function() {
    try {
        let sql = 'select ator_id from tb_ator order by ator_id desc limit 1'

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

const setInsertActor = async function(ator) {
    try {
        
        //Validando o atributo data_morte, onde se ele ser nulo enviará o script sem as aspas somente nesse atributo
        //Para assim não ter conflito no tamanho da data
        //Se ele não ser nulo enviará o script com as aspas naquele atributo

        let sql = ""
        if(ator.data_morte == null){
            sql = `insert into tb_ator(nome, genero, data_nascimento, data_morte, img_ator)
                    values('${ator.nome}', '${ator.genero}', '${ator.data_nascimento}', ${ator.data_morte}, '${ator.img}')`
        
        }else{
            sql = `insert into tb_ator(nome, genero, data_nascimento, data_morte, img_ator)
                    values('${ator.nome}', '${ator.genero}', '${ator.data_nascimento}', '${ator.data_morte}', '${ator.img}')`
        }

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

const setUpdateActor = async function(ator) {
    try {

        let sql = ''
        if(ator.data_morte == null){
            sql = `update tb_ator set nome = '${ator.nome}', genero = '${ator.genero}', data_nascimento = '${ator.data_nascimento}', data_morte = ${ator.data_morte}, img_ator = '${ator.img}'
                where ator_id = ${ator.id}`
        }else{
            sql = `update tb_ator set nome = '${ator.nome}', genero = '${ator.genero}', data_nascimento = '${ator.data_nascimento}', data_morte = '${ator.data_morte}', img_ator = '${ator.img}'
                where ator_id = ${ator.id}`
        }

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

const setDeleteActor = async function(id) {
    try {
        let sql = `delete from tb_ator where ator_id = ${id}`

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
    getSelectAllActor,
    getSelectByIdActor,
    getSelectLastIdActor,
    setInsertActor,
    setUpdateActor,
    setDeleteActor
}