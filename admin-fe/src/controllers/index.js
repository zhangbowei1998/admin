import menuTpl from '../views/menu.html'
import homeTpl from '../views/home.hbs'
import userTpl from '../views/user.html'

function _renderUerTpl({isSignin=false}) {
    let template = Handlebars.compile(userTpl)
    let renderedUserTpl = template({
        isSignin
    })
    $('.user-menu').html(renderedUserTpl)
}

function _user(res) {
    _renderUerTpl({})
    $('#user').on('click', 'span', function (e) {
        // e.stopPropagation()
        if ($(this).attr('id') === 'user-signin') {
            $('.box-title').html('登录')
        } else {
            $('.box-title').html('注册')
        }
    })
}

function _signup() {
    $('#confirm').on('click', () => {
        $.ajax({
            url: '/api/users/signup',
            type: 'POST',
            data: $('#user-form').serialize()
        })
    })
}

export function render (req,res,next) {
    $('.sidebar-menu').html(menuTpl)
    _renderUerTpl({isSignin: false})
    _user(res)

    _signup()

    res.render(homeTpl({}))
}