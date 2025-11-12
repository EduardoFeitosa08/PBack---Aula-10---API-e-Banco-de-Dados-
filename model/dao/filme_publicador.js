/*********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de filme_publicador no Banco de Dados MySQL
 * Data: 05/11/2025
 * Autor: Eduardo Feitosa
 * Versão: 2.0
 **********************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllFilmsPublishers = async function() {
    try {
        let sql = 'select * from tb_filme_publicador order by filme_publicador_id desc'

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

const getSelectByIdFilmPublishers = async function(id) {
    try {
        let sql = `select * from tb_filme_publicador where filme_publicador_id=${id}`

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
const getSelectPublishersByFilmeId = async function(filmeId) {
    try {
        let sql = `select tb_publicador.publicador_id, tb_publicador.nome 
                        from tb_filme 
                            inner join tb_filme_publicador 
                                on tb_filme.id = tb_filme_publicador.filme_id 
                            inner join tb_publicador
                                on tb_publicador.publicador_id = tb_filme_publicador.publicador_id 
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
const getSelectFilmsByPublisherId = async function(publicadorId) {
    try {
        let sql = `select tb_filme.id, tb_filme.nome 
                        from tb_filme 
                            inner join tb_filme_publicador
                                on tb_filme.id = tb_filme_publicador.filme_id 
                            inner join tb_publicador 
                                on tb_publicador.publicador_id = tb_filme_publicador.publicador_id 
                        where tb_publicador.publicador_id=${publicadorId}`

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

const getSelectLastIdFilmPublisher = async function() {
    try {
        let sql = 'select filme_publicador_id from tb_filme_publicador order by filme_publicador_id desc limit 1'

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

const setInsertFilmsPublishers = async function(filmePublicador) {
    try {
        let sql = `insert into tb_filme_publicador(filme_id, publicador_id) values (${filmePublicador.filme_id}, ${filmePublicador.publicador_id})`

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

const setUpdateFilmsPublishers = async function(filmePublicador) {
    try {
        let sql = `update tb_filme_publicador set filme_id = ${filmePublicador.filme_id}, publicador_id = ${filmePublicador.genero_id} where filme_publicador_id = ${filmePublicador.id}`

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

const setDeleteFilmsPublishersByFilmeId = async function(filmeId) {
    try {
        let sql = `delete from tb_filme_publicador where filme_id=${filmeId}`

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

const setDeleteFilmsPublishers = async function(id) {
    try {
        let sql = `delete from tb_filme_publicador where filme_publicador_id=${id}`

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