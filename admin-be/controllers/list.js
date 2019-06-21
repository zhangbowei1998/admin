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
    async save(req,res,next){
        res.set('Content-Type', 'application/json; charset=utf-8')
        let result = await list.save({
            ...req.body,
            companyLogo: req.filename
        })
        if(result){
            res.render('message',{
                data:JSON.stringify({
                    message:'保存成功'
                })
            })
        }else{
            res.render('fail',{
                data:JSON.stringify({
                    message:'保存失败'
                })
            })
        }
    }
}

const listController = new ListController()

module.exports = listController