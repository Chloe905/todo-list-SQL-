// 引入express 和 router
const express = require('express')
const router = express.Router()

// 引入路由模組
const home = require('./modules/home')
const todos = require('./modules/todos')
const users = require('./modules/users')

router.use('/todos', todos)
router.use('/users', users)
router.use('/', home)
// 匯出路由器
module.exports = router