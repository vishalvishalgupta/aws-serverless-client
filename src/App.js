import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default () => {
  const [message, setMessage] = useState()
  const [city, setCity] = useState('')
  const [stateOrProvince, setStateOrProvince] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [places, setPlaces] = useState()

  useEffect(() => {
    (async () => {
        const { data: { places } } = await axios.get(`${process.env.REACT_APP_API}`)
        setPlaces(places)
    })()
  }, [])

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
    const { data } = await axios.post(`${process.env.REACT_APP_API}create`, { city, stateOrProvince, countryCode })
    if (data.status === 'error') return setMessage(data.message)

    if (data.status === 'success') {
      setCity('')
      setStateOrProvince('')
      setCountryCode('')
      
      if (data.placeKey) {
        let currentPlaces = places
        currentPlaces.push({ placeKey: data.placeKey, city, stateOrProvince, countryCode })
        setPlaces([])
        setPlaces(currentPlaces)
      }
    }
  }

  async function handleDelete(e) {
    setMessage('')

    // this is a fire-and-forget, unless we recieve an error back
    let currentPlaces = places
    currentPlaces.map((place, i) => {
      if (place.placeKey === e.placeKey) {
        currentPlaces.splice(i, 1)
      }
    })
    setPlaces(currentPlaces)

    const { data } = await axios.post(`${process.env.REACT_APP_API}delete`, { placeKey: e.placeKey })
    // upon error, re-hydrate record
    if (data.status === 'error') {
      currentPlaces = places

      currentPlaces.push({
        placeKey: e.placeKey.placeKey,
        city: e.city,
        stateOrProvince: e.stateOrProvince,
        countryCode: e.countryCode
      })
      return setMessage(data.message)
    }
  }

  async function upload(e) {
    const file = e.target.files[0]

    const { data: { signedUrl } } = await axios.post(`${process.env.REACT_APP_API}get-upload-location`, { fileName: file.name })
    const returnedData = axios.put(`${signedUrl}`, file, { headers: { 'Content-Type': '*/*' } })
  }

  return (
    <div className="App" style={{ padding: '15px'}}>
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
      <br/>
      { places && places.length === 0 && <div>No places found</div>}
      { places && places.map((place) => {
          return <div key={place.placeKey}><Link to={`/place/${place.placeKey}`}>{`${place.city}, ${place.stateOrProvince} ${place.countryCode}`}</Link> <span onClick={() => handleDelete(place)}>x</span></div>
        })
      }
      <input type="file" onChange={(e) => upload(e)} />
    </div>
  )
}



