const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')

const usePassport = require('./config/passport')
const routes = require('./routes')
const app = express()
const PORT = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 必須要在路由前
usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  // res.locals.success_msg = req.flash('success_msg')
  // res.locals.warning_msg = req.flash('warning_msg')
  // res.locals.error = req.flash('error')
  next()
})
app.use(routes)
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})