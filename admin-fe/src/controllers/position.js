import shopListTpl from '../views/shopListTpl.hbs'
import shopListAdd from '../views/shopList-add.hbs'
import isSignin from '../middleware/isSignin'

export async function render(req, res, next) {
    let result = await isSignin()

    if (result.isSignin) {
        $.ajax({
            url: '/api/list',
            headers: {
                'X-Access-Token': localStorage.getItem('token')
            },
            success(r) {
                res.render(shopListTpl({
                    data: r.data,
                    hasResult: r.data.length > 0
                }))
            }
        })
        bindListEvent(res)

    } else {
        res.go('/')
    }

}

export const add = (req, res, next) => {
    res.render(shopListAdd({}))
    bindPositionAddEvent(res)
}


function bindListEvent(res) {
    $('#router-view').on('click', '#addbtn', (e) => {
        res.go('/list_add')
    })
}

function bindPositionAddEvent(res) {
    $('#posback').on('click', (e) => {
        res.back()
    })

    $('#possubmit').on('click', (e) => {
        $('#possave').ajaxSubmit({
            resetForm: true,
            headers: {
                'X-Access-Token': localStorage.getItem('token')
            },
            success(result) {
                res.back()
            }
        })
    })
}