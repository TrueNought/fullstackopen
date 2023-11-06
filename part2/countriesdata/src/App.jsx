import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [showCountries, setShowCountries] = useState([])

  // for fetching the list of countries that we can filter from
  useEffect(() => {
    // console.log('fetching initial list of countries')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        const names = response.data.map(obj => obj.name.common)
        setCountries(names)
      })
  }, [])

  useEffect(() => {
    if (!query) {
      setShowCountries([])
      return
    }
    // console.log('filtering based on query')
    const matches = countries.filter(c => c.toLowerCase().includes(query.toLowerCase()))
    setShowCountries(matches)
    // eslint-disable-next-line
  }, [query])

  const handleSearchChange = (event) => {
    setQuery(event.target.value)
  }

  return (
    <div>
      Find a country: <input value={query} onChange={handleSearchChange}></input>
      <Countries show={showCountries}></Countries>
    </div>
  )
}

export default App
