require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DATABASE,
})

connection.connect()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ headers: req.cookies })
})

app.get('/p/:letter', (req, res) => {
  connection.query(
    `SELECT * FROM letters WHERE letter='${req.params.letter}'`,
    (err, rows, fields) => {
      if (err) throw err
      connection.query(
        `SELECT * FROM problems WHERE letter='${req.params.letter}'`,
        (err2, rows2, fields) => {
          if (err2) throw err2
          res.json({ letter: rows[0], problems: rows2 })
        }
      )
    }
  )
})

app.post('/submit', (req, res) => {
  const letter = req.body.letter
  const time = req.body.time
  const userSolutions = req.body.result
  let incorrect = 0
  let correct = 0
  let blank = 0
  const wrongArray = []
  connection.query(
    `SELECT * FROM problems WHERE letter="${letter}" ORDER BY id ASC`,
    (err, rows, fields) => {
      if (err) throw err
      userSolutions.forEach((element, index) => {
        if (element == rows[index].solution && element != '') {
          correct++
        } else if (element === '') {
          blank++
        } else {
          incorrect++
          const wrongSolution = {
            userPut: element,
            problem: rows[index],
          }
          wrongArray.push(wrongSolution)
        }
      })
      res.json({
        correct,
        blank,
        incorrect,
        wrongArray,
        time,
        date: req.body.date,
        letter,
      })
    }
  )
})

app.post('/sendEmail', (req, res) => {
  res.json(req.body)
})

app.get('/letters', (req, res) => {
  connection.query('SELECT * FROM letters', (err, rows, fields) => {
    if (err) throw err
    res.json({ letters: rows })
  })
})

app.post('/login', (req, res) => {
  if (req.body.password == process.env.PASSWORD) {
    const token = jwt.sign(
      {
        password: req.body.password,
      },
      process.env.ACCESS_TOKEN_SECRET
    )
    res.json({ auth: true, token })
  } else {
    res.json({ auth: false })
  }
})

app.get('/isLoggedIn', (req, res) => {
  const gotToken = req.headers.authorization.split(' ')[1]
  jwt.verify(gotToken, process.env.ACCESS_TOKEN_SECRET, (err, pass) => {
    if (err) return res.json({ auth: false })
    res.json({ auth: true })
  })
})

app.listen(process.env.PORT)
