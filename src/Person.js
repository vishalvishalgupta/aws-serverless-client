import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default (props) => {
  const [message, setMessage] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')

  useEffect(() => {
    if (typeof props.match.params.id !== 'undefined') {
        (async () => {
            const { data: { person} } = await axios.get(`${process.env.REACT_APP_API}person/${props.match.params.id}`)
            setFirstName(person.firstName)
            setLastName(person.lastName)
            setAge(person.age)
        })()
    }
  }, [props.match.params.id])

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
    const { data } = await axios.post(`http://localhost:3030/update`, { personKey: props.match.params.id, firstName, lastName, age })
    if (data.status === 'error') return setMessage(data.message)

    if (data.status === 'success') {
      return props.history.push('/')
    }
  }

  if (!firstName) return <div>Loading...</div>

  return (
    <div style={{ padding: '15px'}}>
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
    </div>
  )
}



