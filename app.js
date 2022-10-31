const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')

const config = require('config')
const Joi = require('joi')
const logger = require('./logger')
const auth = require('./auth')
const helmet = require('helmet')
const morgan = require('morgan')
const express = require('express')

const app = express()

// configuration
console.log(`Aplication name: ${config.get('name')}`)
console.log(`Mail server name: ${config.get('mail.host')}`)
console.log(`password of mail server: ${config.get('mail.password')}`)




app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(helmet())

if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    startupDebugger('morgan enabled...')
}

// db work
dbDebugger('connected to the database...')

app.use(logger)

app.use(auth)

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
]

app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/api/courses', (req, res) => {
  res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id))

  if (!course)
    return res.status(404).send('The course with the given ID not found')

  res.send(course)
})

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body)

  if (error) return res.status(400).send(error.details[0].message)

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  }
  courses.push(course)
  res.send(course)
})

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id))
  if (!course)
    return res.status(404).send('The course with the given ID was not found')

  const { error } = validateCourse(req.body)

  if (error) return res.status(400).send(error.details[0].message)

  course.name = req.body.name
  res.send(course)
})

const validateCourse = (course) => {
  const schema = {
    name: Joi.string().min(3).required(),
  }

  return Joi.validate(course, schema)
}

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id))
  if (!course)
    return res.status(404).send('The course with the given ID was not found')

  const index = courses.indexOf(course)
  courses.splice(index, 1)

  res.send(course)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}...`))
