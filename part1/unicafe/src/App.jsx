import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

const StatisticLine = ({ text, value}) => {
  return (
    <tr>
      <td>{text}:</td>
      <td>{value}</td>
    </tr>
  )
}

const Stats = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  if (total === 0) {
    return <p>No feedback given yet</p>
  }

  const average = (good - bad) / (total) 
  const positive = (good / total) * 100 + ' %' 

  return (
    <table>
      <tbody>
        <StatisticLine text="Good" value={good} />
        <StatisticLine text="Neutral" value={neutral} />
        <StatisticLine text="Bad" value={bad} />
        <StatisticLine text="All" value={total} />
        <StatisticLine text="Average" value={average} />
        <StatisticLine text="Positive" value={positive} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  const setFeedback = (category) => {
    if (category === 'good') {
      return setGood(good + 1)

    }
    else if (category === 'neutral') {
      return setNeutral(neutral + 1)
    }
    else if (category === 'bad') {
      return setBad(bad + 1)
    }
  }

  return (
    <div>
      <h1>Give Feedback</h1>
      <div>
        <Button handleClick={() => setFeedback('good')} text='Good' />
        <Button handleClick={() => setFeedback('neutral')} text='Neutral' />
        <Button handleClick={() => setFeedback('bad')} text='Bad' />
      </div>
  
      <h1>Statistics</h1>
      <Stats good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App