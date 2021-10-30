import { useLocation } from 'react-router-dom'
import Problem from '../components/Problem'

const Results = () => {
  const location = useLocation()
  const results = location.state.data
  return (
    <div>
      {JSON.stringify(results)}
      <div>
        <p>Correct: {results.correct}</p>
        <p>Incorrect: {results.incorrect}</p>
        <p>Left blank: {results.blank}</p>
        <p>Wrong problems: {JSON.stringify(results.wrongArray)}</p>
        <div>
          {results.wrongArray.map((wrong, index) => {
            return (
              <Problem
                key={index}
                userPut={wrong.userPut}
                first={wrong.problem.first_num}
                second={wrong.problem.second_num}
                solution={wrong.problem.solution}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Results
