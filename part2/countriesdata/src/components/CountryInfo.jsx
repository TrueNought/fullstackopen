const CountryInfo = ({ countryData }) => {
  
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
}

export default CountryInfo