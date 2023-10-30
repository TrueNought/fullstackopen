import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import personService from './services/person'

const Notification = ({ message, isSuccess }) => {
  if (message === null) {
    return null
  } else if (isSuccess) {
    return (
      <div className='success'>
        {message}
      </div>
    )
  } else {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [isSuccess, setSuccess] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    for (const p of persons) {
      if (Object.values(p).includes(newName) && p.number !== newNumber) {
        if (confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
          const changedPerson = { ...p, number: newNumber}
          personService
            .update(p.id, changedPerson)
            .then(returnedPerson => {
              setSuccess(true)
              setMessage(`Updated ${returnedPerson.name}`)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
              setPersons(persons.map(per => per.id !== p.id ? per : returnedPerson))
              setNewName('')
              setNewNumber('')
            })
            .catch(() => {
              setMessage(`Information of ${changedPerson.name} has already been removed from the server`)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
              setPersons(persons.filter(per => per.id !== p.id))
            })
          return
        } 
        else {
          return
        }
      } else if (Object.values(p).includes(newName)) {
        alert(`${newName} is already added to the phonebook.`)
        return
      } else {
        continue
      }
    }
    const nameObject = { 
      name: newName, 
      number: newNumber,
    }
    personService
      .create(nameObject)
      .then(returnedPerson => {
        setSuccess(true)
        setMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons([...persons, returnedPerson])
        setNewName('')
        setNewNumber('')
      })
    
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = !filter
    ? persons 
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (confirm(`Delete ${person.name}?`)) {
      personService
      .del(id)
      .then(() => {
        console.log(`Deleted ${person.name} with id ${id}`)
      })
      setPersons(persons.filter(p => p.id !== id))
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} isSuccess={isSuccess} />
      <Filter handleFilterChange={handleFilterChange} />
      <h2>Add New Entry</h2>
      <PersonForm 
        addName={addName} 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      {personsToShow.map(person => 
        <Person 
          key={person.id} 
          person={person} 
          deletePerson={() => deletePerson(person.id)}/>
        )}
    </div>
  )
}

export default App