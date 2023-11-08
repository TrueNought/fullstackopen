import { useState, useEffect }  from 'react'
import axios from 'axios'
import CountryInfo from './CountryInfo'

const Countries = ({ show }) => {
  const [countryData, setCountryData] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(null)
  
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
    } else if (!show.length || show.length > 1 && show.length <= 10) {
      setCountryData(null)
    }
  }, [show])

  const fetchCountryData = (country) => {
    setFetching(true)
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
      .then(response => {
        setCountryData(response.data)
        setFetching(false)
        setSelectedCountry(country)
      })
  }

  const renderCountryInfo = () => {
    if (selectedCountry && countryData) {
      return <CountryInfo countryData={countryData} />
    }
  }
  
  if (fetching && countryData && show[0] != countryData.name.common) {
    console.log('null')
    return null 
  } else if (show.length > 10){
    return <div>Too many matches, please be more specific.</div>
  } else if (show.length == 1 && countryData){
    return <CountryInfo countryData={countryData} />
  } else if (show.length > 1){
    return (
      <div>
        {show.map((country, index) => 
          <div key={index}>
            {country}
            <button type="button" onClick={() => fetchCountryData(country)}>Show</button>
          </div>
        )}
        {renderCountryInfo()}
      </div>
    )
  } 
}

export default Countries