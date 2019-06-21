const db = require('../utils/db')

const listModels = db.model('lists', {
    companyLogo: String,
    companyName: String,
    positionName: String,
    city: String,
    salary: String,
    createTime: String
});

class List{
    constructor(){}
    save(data){
        let list = new listModels({
            ...data,
            createTime:Date.now().toString()
        })
        return list.save()
    }
    findAll(){
        return listModels.find({})
    }
}

module.exports = new List()
