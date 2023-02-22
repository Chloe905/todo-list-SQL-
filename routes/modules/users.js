const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = [] // 錯誤訊息
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位皆為必填' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不符' })
  }
  if (errors.length) {
    return res.render('register', {
      errors, name, email, password, confirmPassword
    })
  }
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      errors.push({ message: '此 Email 已註冊過!' })
      return res.render('register', { errors, name, email, password, confirmPassword })
    }
    return bcrypt
      .genSalt(10) // 產生鹽，設定複雜係數10
      .then(salt => bcrypt.hash(password, salt)) // 密碼加鹽，產生雜湊
      .then(hash => User.create({ // 尚未註冊:寫入資料庫
        name,
        email,
        password: hash // 雜湊值代替密碼
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err) }
  })
  req.flash('success_msg', '您以成功登出!')
  res.redirect('/users/login')
})

module.exports = router