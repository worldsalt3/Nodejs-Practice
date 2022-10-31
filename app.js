const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')

// const config = require('config')
const Joi = require('joi')
// const logger = require('./middleware/logger')
// const auth = require('./middleware/auth')
const helmet = require('helmet')
const morgan = require('morgan')
const courses = require('./routes/courses')
const home = require('./routes/home')
const express = require('express')

const app = express()

app.set('view engine', 'pug') //declares path
app.set('views', './views') //path

// configuration
// console.log(`Aplication name: ${config.get('name')}`)
// console.log(`Mail server name: ${config.get('mail.host')}`)
// console.log(`password of mail server: ${config.get('mail.password')}`)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(helmet())
app.use('/api/courses', courses)
app.use('/', home)

if (app.get('env') === 'development') {
  app.use(morgan('tiny'))
  startupDebugger('morgan enabled...')
}

// db work
// dbDebugger('connected to the database...')

// app.use(logger)

// app.use(auth)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}...`))
