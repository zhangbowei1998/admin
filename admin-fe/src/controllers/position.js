import positionTpl from '../views/position.hbs'

export function render(req,res,next){
    res.render(positionTpl({}))
}