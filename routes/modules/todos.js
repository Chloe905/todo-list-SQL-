// 引入express & express路由器
const express = require('express')
const router = express.Router()

// 引用 Todo models
const db = require('../../models')
const Todo = db.Todo

// 定義/todos路由
router.get('/new', (req, res) => {
  res.render('new')
})
router.post('/', (req, res) => {
  const userId = req.user.id
  const { name } = req.body
  return Todo.create({ name, userId })
    .then(() => res.redirect('/'))
    .catch((error) => { console.log(error) })
})
router.get('/:id', (req, res) => {
  const UserId = req.user.id
  const { id } = req.params
  return Todo.findOne({ where: { id, UserId } })
    .then(todo =>
      res.render('detail', { todo: todo.toJSON() })
    )
    .catch(error => console.log(error))
})



// 匯出路由模組
module.exports = router