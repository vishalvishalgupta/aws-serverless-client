import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default () => {
  const [message, setMessage] = useState()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')
  const [persons, setPersons] = useState()

  useEffect(() => {
    (async () => {
        const { data: { persons } } = await axios.get(`http://localhost:3030`)
        setPersons(persons)
    })()
  }, [persons])

  function handleChange(e) {
    e.preventDefault()

    switch (e.target.name) {
      case 'firstName':
        setFirstName(e.target.value)
        break
      case 'lastName':
        setLastName(e.target.value)
        break
      case 'age':
        setAge(e.target.value)
        break
      default:
        break
    }
  }

  async function handleSubmit() {
    setMessage('')
    const { data } = await axios.post(`http://localhost:3030/add`, { firstName, lastName, age })
    if (data.status === 'error') return setMessage(data.message)

    if (data.status === 'success') {
      if (data.personKey) {
        let currentPersons = persons
        currentPersons.push({ personKey: data.personKey, firstName, lastName, age })
        setPersons(currentPersons)
      }
      setFirstName('')
      setLastName('')
      setAge('')
    }
  }

  async function handleDelete(e) {
    setMessage('')
    const { personKey } = e
    const { data } = await axios.post('http://localhost:3030/delete', { personKey })
    if (data.status === 'error') return setMessage(data.message)

    if (data.status === 'success') {
      let currentPersons = persons
      const index = currentPersons.indexOf(personKey)
      if (index !== -1) {
        currentPersons.splice(index, 1)
        setPersons(currentPersons)
      }
    }
  }

  return (
    <div className="App" style={{ padding: '15px'}}>
      <form onSubmit={() => handleSubmit()}>
        <div style={{ height: '15px' }}>{message}</div>
        First Name:<br/>
        <input type="text" value={firstName} name="firstName" onChange={handleChange} /><br/><br/>

        Last Name:<br/>
        <input type="text" value={lastName} name="lastName" onChange={handleChange} /><br/><br/>

        Age:<br/>
        <input type="text" value={age} name="age" onChange={handleChange} /><br/><br/>

        <button type="button" onClick={() => handleSubmit()}>Submit</button>
      </form>
      <br/>
      { persons && persons.length === 0 && <div>No people found</div>}
      { persons && persons.map((person) => {
          return <div key={person.personKey}>{`${person.firstName} ${person.lastName} ${person.age}`} <span onClick={() => handleDelete(person)}>x</span></div>
        })
      }
    </div>
  )
}



