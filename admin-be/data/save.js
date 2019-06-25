const {save} = require('../models/list')
const fs = require('fs')
let str = fs.readFileSync('./message.json')
str = JSON.parse(str)
str.map((item,index)=>{
    save({
        ...item,
        mainPic: ''
    })
})