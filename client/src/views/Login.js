import { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

const Login = (props) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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
      if (data.auth) {
        props.history.push('/')
      }
    }
    ifLoggedin()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const logMein = async () => {
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-type': 'Application/json',
      },
      body: JSON.stringify({
        password: password,
      }),
    })

    const data = await res.json()
    if (data.auth) {
      localStorage.setItem('token', data.token)
      // const date = new Date()
      // const h = 12
      // date.setTime(date.getTime() + h * 60 * 60 * 1000)

      // document.cookie = 'token=' + data.token + ';Expires=' + date
      props.history.push('/')
    } else {
      setError('Password is not correct')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1>Password:</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
        }}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            logMein()
          }
        }}
        className="bg-gray-200 text-white-200"
      />
      <p>{error}</p>
      <button onClick={logMein}>Login</button>
    </div>
  )
}

export default withRouter(Login)
