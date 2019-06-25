const db = require('../utils/db')

const listModels = db.model('lists', {
    mainPic: String,
    goodsName: String,
    discountPrice: String,
    marketPrice: String,
    salePrice: String,
    sku: String
});

class List{
    constructor(){}
    save(data){
        let list = new listModels(data)
        return list.save()
    }
    findAll(keywords){
        let regExp = new RegExp(keywords, "i")
    return listModels.find({}).sort({_id: -1})
        .or([{ goodsName: regExp }, { salePrice: regExp }])
    }
    delete(id){
        return listModels.findByIdAndRemove(id)
    }
    findOne(id){
        return listModels.findById(id)
    }
    update(id,data){
        return listModels.findByIdAndUpdate(id,data)
    }
    findMany({page,pagesize,keywords}){
        let regExp = new RegExp(keywords, "i")
        return listModels.find({}).skip(page * pagesize).limit(pagesize).sort({_id: -1})
                .or([{ goodsName: regExp }, { salePrice: regExp }])
    }
}

module.exports = new List()
