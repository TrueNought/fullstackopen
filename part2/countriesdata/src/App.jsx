import { useState, useEffect } from 'react'
import axios from 'axios'

const Info = ({ show }) => {
  const [countryData, setCountryData] = useState(null)
  const [fetching, setFetching] = useState(false)
  
  useEffect(() => {
    if (show.length === 1) {
      setFetching(true)
      // console.log('fetching a particular country')
      axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${show[0]}`)
      .then(response => {
        setCountryData(response.data)
        setFetching(false)
      })
    }
  }, [show])
  
  if (fetching && countryData && show[0] != countryData.name.common) {
    return null 
  } else if (show.length > 10){
    return <div>Too many matches, please be more specific.</div>
  } else if (show.length == 1 && countryData){
    return (
      <div>
        <h2>{countryData.name.common}</h2>
        <div>Capital: {countryData.capital.join(', ')}</div>
        <div>Area: {countryData.area} km²</div>
        <h3>Languages</h3>
        <ul>
          {Object.values(countryData.languages).map((lang, index) => 
          <li key={index}>{lang}</li>
        )}
        </ul>
        <img src={countryData.flags.svg} alt={countryData.flags.alt} />
      </div>
    )
  } else if (show.length > 1){
    return (
      <div>
        {show.map((country, index) => 
          <div key={index}>{country}</div>
        )}
      </div>
    )
  } else {
    return null
  }
}

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
      <Info show={showCountries}></Info>
    </div>
  )
}

export default App
