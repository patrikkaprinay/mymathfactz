const Problem = ({ num, first, second }) => {
  const enterPressed = (e) => {
    if (e.key === 'Enter') {
      const id = parseInt(e.target.dataset.num)
      const next = document.querySelector('input[data-num="' + (id + 1) + '"]')
      if (next) {
        next.focus()
      }
      e.preventDefault()
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
              backgroundColor: '#fff',
              borderTop: '2px dashed #8c8b8b',
            }}
            className="mb-2"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <input
            type="number"
            name="result"
            data-num={num}
            onKeyDown={(e) => enterPressed(e)}
            className="px-2 w-20 rounded-lg border border-green-500 text-green-600 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>
      </div>
    </div>
  )
}

export default Problem
