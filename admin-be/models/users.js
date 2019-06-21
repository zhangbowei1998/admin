const db = require('../utils/db')

const userModels = db.model('users', {
    username: String,
    password: String
    });



class admin{
    save(data){
        const users = new userModels(data)
        return users.save()
    }
    findOne(username){
        return userModels.findOne({username})
    }
}

module.exports = new admin