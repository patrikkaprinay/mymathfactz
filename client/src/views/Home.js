import { useState } from 'react'
import { useEffect } from 'react'
import { useHistory, withRouter } from 'react-router-dom'

const Home = () => {
  const history = useHistory()
  const [letters, setLetters] = useState([])
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

    const getLetters = async () => {
      const res = await fetch('http://localhost:5000/letters')
      const data = await res.json()
      setLetters(data.letters)
      setLoaded(true)
    }
    getLetters()
  }, [history])

  const logOut = () => {
    localStorage.removeItem('token')
    history.push('/login')
  }
  return (
    loaded &&
    authorized && (
      <div className="min-h-screen" style={{ backgroundColor: '#72cdfa' }}>
        <div className=" d-flex justify-center items-center overflow-hidden text-center">
          <img
            src="/images/factz.png"
            alt=""
            className="mx-auto"
            style={{ width: '900px' }}
          />
          <div
            className="cursor-pointer mx-auto px-3 py-2 mt-4 rounded-md w-max"
            style={{ backgroundColor: '#47aadb' }}
            onClick={logOut}
          >
            Logout
          </div>
          <span className="my-2 md:text-7xl text-3xl flex justify-center text-white">
            Choose your practice
          </span>
        </div>

        <div className="p-8 flex justify-center mt-4 flex-wrap flex-row w-3/4 mx-auto">
          {letters.map((letter) => {
            return (
              <div className="p-2" key={letter.id}>
                <a href={`/test/${letter.letter}`}>
                  <img
                    width="100px"
                    src={`/images/S-${letter.letter.toUpperCase()}.png`}
                    alt=""
                  />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    )
  )
}

export default withRouter(Home)
