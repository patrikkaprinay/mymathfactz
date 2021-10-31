require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const nodemailer = require('nodemailer')

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
  const userSolutions = req.body.result
  let incorrect = 0
  let correct = 0
  let blank = 0
  const formatTime = (time) => {
    var mins = ~~((time % 3600) / 60)
    var secs = ~~time % 60

    var ret = ''

    ret += '' + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '')
    ret += '' + secs
    return ret
  }
  const formattedTime = formatTime(req.body.time)
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
        time: formattedTime,
        date: req.body.date,
        letter,
      })
    }
  )
})

app.post('/sendEmail', (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'patrik.kaprinay@gmail.com',
      pass: process.env.GMAIL_PASS,
    },
  })

  const data = req.body
  const problemData = req.body.resData

  let mailText = `
  <p><b>Paper ${problemData.letter.toUpperCase()}</b></p>
  <p>Name: <b>${data.name}</b></p>
  <p>Time: ${problemData.time}</p>
  <p>Correct: ${problemData.correct}</p>
  <p>Incorrect: ${problemData.incorrect}</p>
  <p>Blank: ${problemData.blank}</p>
  <br />
  ${problemData.wrongArray.length > 0 ? '<p>Wrong answers:</p>' : ''}
  `
  for (let index = 0; index < problemData.wrongArray.length; index++) {
    const element = problemData.wrongArray[index]

    mailText += `
    <div style="max-width: 35px;">
      <div style="text-align: right;">
        <span>${element.problem.first_num}</span>
      </div>
      <div style="text-align: right;">
        <span style="margin-right: 10px;">×</span>
        <span>${element.problem.second_num}</span>
        <hr style="border-top: 2px solid rgb(140, 139, 139); margin-bottom: 6px;">
      </div>
      <div style="display: flex; justify-content: end; flex-direction: row; text-align: right;">
        <p style="color: red; margin-right: 10px;">${element.userPut}</p>
        <p style="color: green;">${element.problem.solution}</p>
      </div>
    </div>`
  }
  mailText += `
  <p style="margin-bottom: 0;">Date: ${problemData.date}</p>
  `

  var mailOptions = {
    from: 'patrik.kaprinay@gmail.com',
    to: 'kpty.dev@yahoo.com',
    subject: `Paper ${problemData.letter.toUpperCase()} - ${data.name}`,
    html: mailText,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(401).json({ msg: 'Something went wrong' })
    } else {
      res.status(200).json({ msg: `Email sent to ${data.email}` })
    }
  })
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
