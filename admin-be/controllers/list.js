var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

let mySocket = null
io.on('connection', function (socket) {
    mySocket = socket
})

server.listen(8082, 'localhost')



const list = require('../models/list')

class ListController{
    constructor(){}
    async find(req,res,next){
        res.set('Content-Type', 'application/json; charset=utf-8')
        let result = await list.findAll()
        if(result){
        res.render('message', {data:JSON.stringify(result)})
        }else{
            res.render('fail',{
                data:JSON.stringify({
                    message:'查找失败'
                })
            })
        }
    }
    async findOne(req,res,next){
        res.set('Content-Type', 'application/json; charset=utf-8')
        let result = await list.findOne(req.query.id)
        if(result){
            res.render('message', {data:JSON.stringify(result)})
            }else{
                res.render('fail',{
                    data:JSON.stringify({
                        message:'查找失败'
                    })
                })
            }
    }
    async findMany(req,res,next){
        res.set('Content-Type', 'application/json; charset=utf-8')
        let { page = 0, pagesize = 10, keywords = '' } = req.query
        let result = await list.findMany({
            page: ~~page, 
            pagesize: ~~pagesize,
            keywords
        })
        if(result){
            res.render('message', {data:JSON.stringify({
                result,
                total: (await list.findAll(keywords)).length
            })})
            }else{
                res.render('fail',{
                    data:JSON.stringify({
                        message:'查找失败'
                    })
                })
            }
    }
    async update(req,res,next){
        res.set('Content-Type', 'application/json; charset=utf-8')
        delete req.body.mainPic
        req.body = req.filename ? { ...req.body, mainPic: req.filename } : req.body
        let result = await list.update(req.body.id,req.body)
        if(result){
            res.render('message', {data:JSON.stringify({
                message:'更新成功'
            })})
            }else{
                res.render('fail',{
                    data:JSON.stringify({
                        message:'更新失败'
                    })
                })
            }
    }
    async save(req,res,next){
        res.set('Content-Type', 'application/json; charset=utf-8')
        let result = await list.save({
            ...req.body,
            mainPic: req.filename
        })
        if(result){
            res.render('message',{
                data:JSON.stringify({
                    message:'保存成功'
                })
            })
            mySocket.emit('message', 'send')
        }else{
            res.render('fail',{
                data:JSON.stringify({
                    message:'保存失败'
                })
            })
        }
    }
    async delete(req,res,next){
        res.set('Content-Type', 'application/json; charset=utf-8')
        let result = await list.delete(req.body.id)
        if(result){
            res.render('message',{
                data:JSON.stringify({
                    message:'删除成功'
                }
            )})
        }else{
            res.render('fail',{data:JSON.stringify({
                message:'删除失败'
            })})
        }
    }
}

const listController = new ListController()

module.exports = listController