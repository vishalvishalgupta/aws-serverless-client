import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default () => {
  const [message, setMessage] = useState()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')
  const [persons, setPersons] = useState()

  useEffect(() => {
    (async () => {
        const { data: { persons } } = await axios.get(`${process.env.REACT_APP_API}`)
        setPersons(persons)
    })()
  }, [])

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
    const { data } = await axios.post(`${process.env.REACT_APP_API}add`, { firstName, lastName, age })
    if (data.status === 'error') return setMessage(data.message)

    if (data.status === 'success') {
      setFirstName('')
      setLastName('')
      setAge('')
      
      if (data.personKey) {
        let currentPersons = persons
        currentPersons.push({ personKey: data.personKey, firstName, lastName, age })
        setPersons([])
        setPersons(currentPersons)
      }
    }
  }

  async function handleDelete(e) {
    setMessage('')

    // this is a fire-and-forget, unless we recieve an error back
    let currentPersons = persons
    currentPersons.map((person, i) => {
      if (person.personKey === e.personKey) {
        currentPersons.splice(i, 1)
      }
    })
    setPersons(currentPersons)

    const { data } = await axios.post(`${process.env.REACT_APP_API}delete`, { personKey: e.personKey })
    // upon error, re-hydrate record
    if (data.status === 'error') {
      currentPersons = persons

      currentPersons.push({
        personKey: e.personKey.personKey,
        firstName: e.firstName,
        lastName: e.lastName,
        age: e.age
      })
      return setMessage(data.message)
    }
  }

  async function upload(e) {
    const file = e.target.files[0]

    e.preventDefault()
    const { data: { signedUrl } } = await axios.post(`${process.env.REACT_APP_API}get-upload-filename`, { fileName: file.name })
    const returnedData = await axios.put(`${signedUrl}`, file, { headers: { 'Content-Type': 'image/*' } })
    console.log(returnedData)
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
          return <div key={person.personKey}><Link to={`/person/${person.personKey}`}>{`${person.firstName} ${person.lastName} ${person.age}`}</Link> <span onClick={() => handleDelete(person)}>x</span></div>
        })
      }
      <input type="file" onChange={(e) => upload(e)} />
    </div>
  )
}



