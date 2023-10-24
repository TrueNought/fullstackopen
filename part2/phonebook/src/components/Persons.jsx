const Person = ({ person }) => <div>{person.name} {person.number}</div>

const ShowPersons = ({ persons }) => <>{persons.map(person => <Person key={person.id} person={person} />)}</>

export default ShowPersons