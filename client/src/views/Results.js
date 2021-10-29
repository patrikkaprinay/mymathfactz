import { useLocation } from 'react-router-dom'

const Results = () => {
  const location = useLocation()
  const results = location.state.data
  return (
    <div>
      {JSON.stringify(results)}
      <div>
        <p>Right: {results.right}</p>
        <p>Wrong: {results.wrong}</p>
        <p>Blank: {results.blank}</p>
        <p>Wrong problems: {JSON.stringify(results.wrongArray)}</p>
      </div>
    </div>
  )
}

export default Results
