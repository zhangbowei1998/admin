import menuTpl from '../views/menu.html'
import homeTpl from '../views/home.hbs'
import userTpl from '../views/user.html'
import isSignin from '../middleware/isSignin'

function _renderUerTpl({isSignin=false,username=null}) {
    let template = Handlebars.compile(userTpl)
    let renderedUserTpl = template({
        isSignin,
        username
    })
    $('.user-menu').html(renderedUserTpl)
}

async function _user(res) {
    try{
        await _isSiginin()
    }catch(e){
        console.error(e.responseText)
    }
    $('#user').on('click', 'span', function (e) {
        // e.stopPropagation()
        if ($(this).attr('id') === 'user-signin') {
            $('.box-title').html('登录')
            _sign('/api/users/signin')
            
        } else {
            $('.box-title').html('注册')
            _sign('/api/users/signup')
        }
    })
}

function _sign(url) {
    $('#confirm').off('click').on('click', (event) => {
        event.preventDefault()
        let stat = true
        $('#user-form input').each(function(){
            if(!$(this).val()){
                stat = false
                return false
            }
        })
        if(!stat){
            alert('账号密码不能为空')
            return false
        }
        $.ajax({
            url,
            type: 'POST',
            data: $('#user-form').serialize(),
            success:(res,s,jqXHR)=>{
                alert(res.data.message)
                localStorage.setItem('token',jqXHR.getResponseHeader('X-Access-Token'))
                // _renderUerTpl({isSignin:res.isSignin,username:res.username})
                _isSiginin()
            }
        })
    })
}

async function _isSiginin(){
    let res = await isSignin()
    if(res){
        _renderUerTpl({isSignin:res.isSignin,username:res.username})
            if(res.isSignin){
                _signout()
            }
    }else{
        _renderUerTpl({isSignin:false,username:''})
    }
    // return $.ajax({
    //     url:'/api/users/isSignin',
    //     headers:{
    //         'X-Access-Token':localStorage.getItem('token')
    //     },
    //     success:(res)=>{
    //         _renderUerTpl({isSignin:res.isSignin,username:res.username})
    //         if(res.isSignin){
    //             _signout()
    //         }
    //     },
    //     error:(res)=>{
    //         _renderUerTpl({isSignin:false,username:''})
    //     }
    // })
}

function _signout(){
    $('#signout').on('click',()=>{
        localStorage.removeItem('token')
        _isSiginin()
    })
}


export function render (req,res,next) {
    $('.sidebar-menu').html(menuTpl)
    // _renderUerTpl({isSignin: false})
    _user(res)


    res.render(homeTpl({}))
}