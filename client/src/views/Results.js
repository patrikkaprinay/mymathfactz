import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Problem from '../components/Problem'

const Results = () => {
  const location = useLocation()
  const results = location.state.data
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [name, setName] = useState('')

  const formatDate = (date) => {
    const notFormated = new Date(date)
    return notFormated.toLocaleDateString('en-US')
  }

  const formatTime = (time) => {
    var mins = ~~((time % 3600) / 60)
    var secs = ~~time % 60

    var ret = ''

    ret += '' + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '')
    ret += '' + secs
    return ret
  }

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  const sendEmail = async () => {
    if (validateEmail(email)) {
      if (name !== '') {
        const resData = results
        resData.time = formatTime(results.time)
        resData.date = formatDate(results.date)
        const res = await fetch('http://localhost:5000/sendEmail', {
          method: 'POST',
          headers: {
            'Content-type': 'Application/json',
          },
          body: JSON.stringify({ email, resData }),
        })
        const data = await res.json()
        console.log(data)
      } else {
        setError('Please set your name')
      }
    } else {
      setError('Email is not correct')
    }
  }

  return (
    <div
      style={{ backgroundColor: '#72cdfa' }}
      className="min-h-screen"
      id="renderPDF"
    >
      <div className=" d-flex justify-center items-center overflow-hidden text-center mx-auto w-2/6">
        <Link to="/">
          <img
            src="/images/factz.png"
            alt=""
            className="mx-auto border-b-2  pb-3"
            style={{ width: '600px', borderColor: '#6ebde4' }}
          />
        </Link>
      </div>
      <div className="text-center w-2/4 mx-auto">
        <div className="my-4">
          <h2 className="text-4xl mb-2 font-bold">
            Paper {results.letter.toUpperCase()}
          </h2>
          <p className="text-xl">{formatDate(results.date)}</p>
        </div>
        <div className="my-2">
          <input
            type="text"
            placeholder="Your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-2xl bg-transparent rounded-md px-2 py-1 focus:outline-none placeholder-gray-500 text-gray-800 text-center w-full"
          />
        </div>
        <div className="text-2xl">
          <p>Time: {formatTime(results.time)}</p>
          <p>Correct: {results.correct}</p>
          <p>Incorrect: {results.incorrect}</p>
          <p>Left blank: {results.blank}</p>
        </div>
        {results.wrongArray.length > 0 && (
          <div className="w-5xl mx-auto flex items-center flex-col">
            <h2 className="text-2xl mt-4">Wrong answers:</h2>
            <div className="flex flex-wrap justify-center">
              {results.wrongArray.map((wrong, index) => {
                return (
                  <div key={index} style={{ width: '130px' }}>
                    <Problem
                      userPut={wrong.userPut}
                      first={wrong.problem.first_num}
                      second={wrong.problem.second_num}
                      solution={wrong.problem.solution}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
        <div className="mt-10">
          <div>
            <p className="text-red-600 mb-2">{error}</p>
            <input
              type="email"
              className="py-2 px-4 mr-2 rounded-full focus:outline-none "
              placeholder="Enter email here"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <button
              onClick={sendEmail}
              className="bg-blue-500 duration-150 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Send Email
            </button>
          </div>
          <div className="flex flex-row justify-center gap-2 mt-6">
            <Link to="/">
              <button className="bg-blue-500 duration-150 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mx-auto flex flex-row items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 "
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path
                    fillRule="evenodd"
                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                    clipRule="evenodd"
                  />
                </svg>
                Solve another paper
              </button>
            </Link>
            <Link to={`/test/${results.letter}`}>
              <button className="bg-blue-500 duration-150 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mx-auto flex flex-row items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 "
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Go again
              </button>
            </Link>
          </div>
        </div>
        <img
          src="/images/good_work.png"
          style={{ height: '150px', marginInline: 'auto' }}
          alt="Good job"
        />
      </div>
    </div>
  )
}

export default Results
