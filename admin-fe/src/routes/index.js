import SMERouter from 'sme-router'
import activeMiddleware from './active'
import * as indexController from '../controllers/index'
import * as positionController from '../controllers/position'



const router = new SMERouter('router-view')
router.route('/',indexController.render)
router.route('/list',positionController.render)
router.route('/list_add',positionController.add)

router.route('*', (req, res, next) => {
    res.redirect('/') // 实际上协助跳转到 / 路由上
}
)
router.use(activeMiddleware)