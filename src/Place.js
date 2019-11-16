import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default (props) => {
  const [message, setMessage] = useState('')
  const [city, setCity] = useState('')
  const [stateOrProvince, setStateOrProvince] = useState('')
  const [countryCode, setCountryCode] = useState('')

  useEffect(() => {
    if (typeof props.match.params.id !== 'undefined') {
        (async () => {
            const { data: { place} } = await axios.get(`${process.env.REACT_APP_API}place/${props.match.params.id}`)
            setCity(place.city)
            setStateOrProvince(place.stateOrProvince)
            setCountryCode(place.countryCode)
        })()
    }
  }, [props.match.params.id])

  function handleChange(e) {
    e.preventDefault()

    switch (e.target.name) {
      case 'city':
        setCity(e.target.value)
        break
      case 'stateOrProvince':
        setStateOrProvince(e.target.value)
        break
      case 'countryCode':
        setCountryCode(e.target.value)
        break
      default:
        break
    }
  }

  async function handleSubmit() {
    setMessage('')
    const { data } = await axios.post(`${process.env.REACT_APP_API}update`, { placeKey: props.match.params.id, city, stateOrProvince, countryCode })
    if (data.status === 'error') return setMessage(data.message)
    if (data.status === 'success') return props.history.push('/')
  }

  if (!city) return <div>Loading...</div>

  return (
    <div style={{ padding: '15px'}}>
      <form onSubmit={() => handleSubmit()}>
        <div style={{ height: '15px' }}>{message}</div>
        City:<br/>
        <input type="text" value={city} name="city" onChange={handleChange} /><br/><br/>

        State or Province:<br/>
        <input type="text" value={stateOrProvince} name="stateOrProvince" onChange={handleChange} /><br/><br/>

        Country Code:<br/>
        <input type="text" value={countryCode} name="countryCode" onChange={handleChange} /><br/><br/>

        <button type="button" onClick={() => handleSubmit()}>Submit</button>
      </form>
    </div>
  )
}



