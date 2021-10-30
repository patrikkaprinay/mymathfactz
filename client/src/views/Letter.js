import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import Problem from '../components/Problem'

const Letter = () => {
  const { id } = useParams()
  const history = useHistory()
  const [time, setTime] = useState(0)
  const [letter, setLetter] = useState({})
  const [problems, setProblems] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const ifLoggedin = async () => {
      // Check if the user is logged in on website load
      const res = await fetch('http://localhost:5000/isLoggedIn', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      const data = await res.json()
      if (!data.auth) {
        history.push('/login')
      } else {
        setAuthorized(true)
      }
    }
    ifLoggedin()
  }, [history])

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => time + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getFromDatabase = async () => {
      const res = await fetch(`http://localhost:5000/p/${id}`)

      const data = await res.json()
      setLetter(data.letter)
      setProblems(data.problems)
      setLoaded(true)
      document.querySelector(`input[data-num="${data.problems[0].id}"]`).focus()
    }
    getFromDatabase()
  }, [id])

  const submitForm = async (e) => {
    e.preventDefault()
    const asd = document.querySelectorAll('input[name="result"]')
    const results = []
    asd.forEach((res) => {
      results.push(res.value)
    })
    let formattedForm = {}
    const form = document.forms['problemsForm']
    for (var i = 0; i < form.length; i++) {
      formattedForm[form[i]['name']] = form[i]['value']
    }
    formattedForm.result = results
    const res = await fetch('http://localhost:5000/submit', {
      method: 'POST',
      headers: {
        'Content-type': 'Application/json',
      },
      body: JSON.stringify(formattedForm),
    })
    const data = await res.json()
    history.push({
      pathname: '/results',
      state: {
        data,
      },
    })
  }

  return (
    loaded &&
    authorized && (
      <div>
        <div style={{ backgroundColor: `#${letter.color}` }}>
          <div className="flex justify-evenly items-center py-8">
            <div>
              <div className="bg-black text-white flex flex-row p-4 text-4xl rounded-xl">
                <p>{('0' + Math.floor((time / 60) % 60)).slice(-2)}:</p>
                <p>{('0' + Math.floor(time % 60)).slice(-2)}</p>
              </div>
            </div>
            <div className="flex justify-center align-center">
              <Link to="/">
                <img
                  src="/images/factz.png"
                  alt=""
                  style={{ width: '500px' }}
                />
              </Link>
            </div>

            <div>
              <img
                src={`/images/${id.toUpperCase()}.png`}
                alt={id}
                className="h-44"
              />
            </div>
          </div>
        </div>
        <form
          onSubmit={submitForm}
          name="problemsForm"
          className="flex items-center flex-col mb-10"
        >
          <div className="flex justify-center flex-wrap mt-4">
            {problems.map((p) => (
              <Problem
                num={p.id}
                key={p.id}
                first={p.first_num}
                second={p.second_num}
              />
            ))}
          </div>
          <input type="hidden" name="letter" value={id} />
          <input type="hidden" name="time" value={time} />
          <input type="hidden" name="date" value={new Date()} />
          <button
            type="submit"
            className="bg-blue-500 duration-150 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mx-auto mt-6"
          >
            Submit
          </button>
        </form>
      </div>
    )
  )
}

export default Letter
