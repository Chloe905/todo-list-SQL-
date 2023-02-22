// 引入express & express路由器
const express = require('express')
const router = express.Router()

// 引用 Todo models
const db = require('../../models')
const Todo = db.Todo
const User = db.User
// 定義首頁路由

router.get('/', (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error('user not found')

      return Todo.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.user.id }
      })
        .then((todos) => {
          return res.render('index', { todos })
        })
        .catch((error) => { return res.status(422).json(error) })
    })
})

// 匯出首頁路由模組
module.exports = router