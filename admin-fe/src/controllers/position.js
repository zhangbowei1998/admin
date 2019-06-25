import shopListTpl from '../views/shopListTpl.html'
import shopListAdd from '../views/shopList-add.hbs'
import updataTpl from '../views/shopList-update.hbs'
import isSignin from '../middleware/isSignin'
import randomstring from 'randomstring'
import _ from 'lodash'

export async function render(req, res, next) {
    let result = await isSignin()
    if (result.isSignin) {
        let { page = 0, pagesize = 10, keywords = '' } = req.query || {}
        $.ajax({
            url: '/api/list/find',
            headers: {
                'X-Access-Token': localStorage.getItem('token')
            },
            data:{
                page,
                pagesize,
                keywords
            },
            success(r) {
                let list = template.render(shopListTpl, {
                    data: r.data.result, // 显示数据
                    hasResult: r.data.result.length > 0, // 数据为空显示提示
                    url: location.hash.split('?')[0], // 翻页链接的路径
                    total: r.data.total, // 配合最后一页删除处理
                    page: ~~page, // 当前页
                    pagesize, // 每页数据条数
                    keywords, // 搜索关键字
                    pagecount: _.range(1, Math.ceil(r.data.total / ~~pagesize) + 1) // 页码数组
                    })
                    res.render(list)
            }
        })
        bindListEvent(res,req)

    } else {
        res.go('/')
    }

}

export const add = (req, res, next) => {
    res.render(shopListAdd({}))
    bindPositionAddEvent(res)
}

export const updata = (req,res,next) => {
    $.ajax({
        url:'/api/list/one',
        data:{
            id:req.params.id
        },
        headers:{
            'X-Access-Token':localStorage.getItem('token')
        },
        success(result){
            if(result.ret){
                res.render(updataTpl(result.data))
                bindPositionAddEvent(res)
            }else{
                alert(result.data)
            }
        }
    })
    

}


function bindListEvent(res,req) {
    $('#router-view').on('click', '#addbtn', (e) => {
        res.go('/list_add')
    })
    $('#router-view').off('click','.btn-delete').on('click','.btn-delete',function(){
        let id = $(this).closest('tr').attr('data-id')
        $.ajax({
            url:'/api/list',
            type:'DELETE',
            data:{id},
            headers:{
                'X-Access-Token':localStorage.getItem('token')
            },
            success: (result) => {
                let {
                    page = 0, pagesize = 2, keywords = ''
                } = req.query || {}
                let total = ~~$(this).closest('tr').attr('data-total')

                // 最后一页内容删除完毕以后，需要跳转到上一页
                page = (page * pagesize === total - 1) && (page > 0) ? page - 1 : page

                if (result.ret) {
                    res.go('/list/' + randomstring.generate(7) + `?page=${page}&pagesize=${pagesize}&keywords=${keywords || ''}`)
                } else {
                    alert(result.data)
                }
            }
        })
    })
    $('#router-view').off('click','.updata').on('click','.updata',function(){
        let id = $(this).closest('tr').attr('data-id')
        res.go('/list_updata/'+id)
    })
    $('#router-view').off('click', '#possearch').on('click', '#possearch', function(e){
        res.go('/list/1/' + `?keywords=${$('#keywords').val()}`)
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
                if(result.ret){
                    res.back()
                }else{
                    alert(result.data)
                }
            }
        })
    })
}