const Problem = ({ num, first, second, userPut, solution }) => {
  const enterPressed = (e) => {
    if (e.key === 'Enter') {
      const id = parseInt(e.target.dataset.num)
      const next = document.querySelector('input[data-num="' + (id + 1) + '"]')
      if (next) {
        next.focus()
      }
      e.preventDefault()
    } else if (e.key === 'Backspace') {
      const id = parseInt(e.target.dataset.num)
      const previous = document.querySelector(
        'input[data-num="' + (id - 1) + '"]'
      )
      if (previous && e.target.value === '') {
        previous.focus()
        e.preventDefault()
      }
    }
  }
  return (
    <div>
      <div className="p-3">
        <div className="text-right">
          <span className="text-3xl">{first}</span>
        </div>

        <div className="text-right">
          <span className="text-3xl mr-3">&times;</span>
          <span className="text-3xl">{second}</span>
          <hr
            style={{
              borderTop: '2px solid #8c8b8b',
            }}
            className="mb-2"
          />
        </div>
        <div className="flex flex-col space-y-2">
          {userPut != null && (
            <div className="flex justify-end flex-row">
              <p className="text-2xl text-red-600 mr-2">{userPut}</p>
              <p className="text-2xl text-green-700">{solution}</p>
            </div>
          )}
          {userPut == null && (
            <input
              type="number"
              name="result"
              data-num={num}
              onKeyDown={(e) => enterPressed(e)}
              className="px-2 w-20 rounded-lg border border-gray-400 focus:border-green-500 text-gray-800 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Problem
