const userModels = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const isSignin = require('../middleware/isSignin')



class UserController {
    constructor(){
        this.isSignin = isSignin
    }
    // 注册
    async signup(req, res, next){
        res.set('Content-Type', 'application/json; charset=utf-8');
        // 查重
        let username = await userModels.findOne(req.body.username)
        if(username){
            res.render('succ',{
                    isSignin:false,
                    username:req.body.username,
                    data:JSON.stringify({
                    message:'用户名已注册',
                })
            })
            return false
        }
        // 加密
        let password = req.body.password
        let hash = await userController._hashPassword(password)

        let result = await userModels.save({
            ...req.body,
            password: hash
        })
        if (result) {
            res.render('succ', {
                    isSignin:true,
                    username:req.body.username,
                    data: JSON.stringify({
                    message: '注册成功',
                })
            })
        } else {
            res.render('succ', {
                    isSignin:false,
                    username:req.body.username,
                    data: JSON.stringify({
                    message: '注册失败',
                })
            })
        }

    }

    //登录
    async signin(req,res,next){
        res.set('Content-Type', 'application/json; charset=utf-8');
        let result = await userModels.findOne(req.body.username)
        let stat = await userController._compare(req.body.password,result.password)
        if(result&&stat){
            res.header('X-Access-Token',userController._mkToken(result.username))
            res.render('succ', {
                    isSignin:true,
                    username:req.body.username,
                    data: JSON.stringify({
                    message: '登录成功'
                })
            })
        }else{
            res.render('succ', {
                isSignin:false,
                username:req.body.username,
                data: JSON.stringify({
                    message: '登录失败'
                })
            })
        }
    }
    // 验证是否登录
    // async isSignin(req,res,next){
    //     res.set('Content-Type', 'application/json; charset=utf-8');
    //     jwt.verify(req.header('X-Access-Token'),'aaa',(err,decoded)=>{
    //         if(!err){
    //             res.render('succ',{
    //                 isSignin:true,
    //                 username:decoded.username,
    //                 data:JSON.stringify({
    //                     message:'已登录'
    //                 })
    //             })
    //         }else{
    //             res.render('succ',{
    //                 isSignin:false,
    //                 username:'',
    //                 data:JSON.stringify({
    //                     message:'未登录'
    //                 })
    //             })
    //         }
    //     })
    // }
    



    // 加密
    _hashPassword(pwd, cb) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(pwd, 10, (err, hash) => {
                resolve(hash)
            })
        })
    }
    // 比对加密后的密码
    _compare(pwd,hash){
        return new Promise((resolve)=>{
            bcrypt.compare(pwd,hash,(err,res)=>{
                resolve(res)
            })
        })
    }
    // 生成token
    _mkToken(username){
        const key = 'aaa'
        return jwt.sign({username},key)
    }
}
    const userController = new UserController()
    module.exports = userController