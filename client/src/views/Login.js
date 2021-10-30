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
      setError('Password is not correct!')
    }
  }

  return (
    <div
      className="flex justify-start items-center h-screen flex-col text-white"
      style={{ backgroundColor: 'rgb(30,30,46)' }}
    >
      <img
        src="/images/factz.png"
        alt=""
        style={{ width: '800px' }}
        className=" my-28"
      />
      <input
        type="password"
        className=" py-2 px-3 outline-none text-gray-700 text-xl text-center"
        style={{ background: 'none', color: 'white' }}
        placeholder="Enter Your Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
        }}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            logMein()
          }
          setError('')
        }}
      />
      <p className="text-red-400">{error}</p>
      <button
        onClick={logMein}
        className="rounded-md bg-purple-500 px-3 py-2 hover:bg-purple-700 duration-150 mt-6"
      >
        Login
      </button>
    </div>
  )
}

export default withRouter(Login)
