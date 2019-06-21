const jwt = require('jsonwebtoken')


module.exports = function(req,res,next){
    res.set('Content-Type', 'application/json; charset=utf-8')
    jwt.verify(req.header('X-Access-Token'),'aaa',(err,decoded)=>{
        if(err){
            res.render('succ',{
                isSignin:false,
                username:'',
                data:JSON.stringify({
                    message:'未登录'
                })
            })
        }else{
            next()
        }
    })
}