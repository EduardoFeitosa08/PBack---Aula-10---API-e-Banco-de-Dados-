/*********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de filme_ator no Banco de Dados MySQL
 * Data: 05/11/2025
 * Autor: Eduardo Feitosa
 * Versão: 2.0
 **********************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllFilmsActors = async function() {
    try {
        let sql = 'select * from tb_filme_ator order by filme_ator_id desc'

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectByIdFilmActors = async function(id) {
    try {
        let sql = `select * from tb_filme_ator where filme_ator_id=${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Retorna os generos filtrando pelo ID do filme do banco de dados
const getSelectActorsByFilmeId = async function(filmeId) {
    try {
        let sql = `select tb_ator.ator_id, tb_ator.nome 
                        from tb_filme 
                            inner join tb_filme_ator 
                                on tb_filme.id = tb_filme_ator.filme_id 
                            inner join tb_ator
                                on tb_ator.ator_id = tb_filme_ator.ator_id 
                        where tb_filme.id=${filmeId}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Retorna os filmes filtrando pelo ID do genero do banco de dados
const getSelectFilmsByActorId = async function(atorId) {
    try {
        let sql = `select tb_filme.id, tb_filme.nome 
                        from tb_filme 
                            inner join tb_filme_ator 
                                on tb_filme.id = tb_filme_ator.filme_id 
                            inner join tb_ator 
                                on tb_ator.ator_id = tb_filme_ator.ator_id 
                        where tb_ator.ator_id=${atorId}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectLastIdFilmActor = async function() {
    try {
        let sql = 'select filme_ator_id from tb_filme_ator order by filme_ator_id desc limit 1'

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const setInsertFilmsActors = async function(filmeAtor) {
    try {
        let sql = `insert into tb_filme_ator(filme_id, ator_id) values (${filmeAtor.filme_id}, ${filmeAtor.ator_id})`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const setUpdateFilmsActors = async function(filmeAtor) {
    try {
        let sql = `update tb_filme_ator set filme_id = ${filmeAtor.filme_id}, ator_id = ${filmeAtor.genero_id} where filme_ator_id = ${filmeAtor.id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const setDeleteFilmsActorsByFilmeId = async function(filmeId) {
    try {
        let sql = `delete from tb_filme_ator where filme_id=${filmeId}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const setDeleteFilmsActors = async function(id) {
    try {
        let sql = `delete from tb_filme_ator where filme_ator_id=${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllFilmsActors,
    getSelectActorsByFilmeId,
    getSelectByIdFilmActors,
    getSelectFilmsByActorId,
    getSelectLastIdFilmActor,
    setInsertFilmsActors,
    setUpdateFilmsActors,
    setDeleteFilmsActorsByFilmeId,
    setDeleteFilmsActors
}