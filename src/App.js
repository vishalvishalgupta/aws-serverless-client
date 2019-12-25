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
    let currentPlaces = places

    // This is a bit of a hack as we wait for lambda to return the key
    currentPlaces.push({ placeKey: '0', city, stateOrProvince, countryCode })
    setCity('')
    setStateOrProvince('')
    setCountryCode('')
    setPlaces([])
    setPlaces(currentPlaces)

    const { data } = await axios.post(`${process.env.REACT_APP_API}create`, { city, stateOrProvince, countryCode })
    if (data.status === 'error') {
      // Re-hydrate the inputs to the user can attempt again
      setCity(currentPlaces.slice(-1)[0].city)
      setStateOrProvince(currentPlaces.slice(-1)[0].stateOrProvince)
      setCountryCode(currentPlaces.slice(-1)[0].countryCode)
      currentPlaces.pop()

      return setMessage(data.message)
    }

    if (data.status === 'success') {
      // Again, a bit of a hack as we wait for lambda to return the key
      currentPlaces.pop()
      currentPlaces.push({ placeKey: data.placeKey, city, stateOrProvince, countryCode })
      setPlaces([])
      setPlaces(currentPlaces)
    }
  }

  async function handleDelete(e) {
    setMessage('')

    // this is a fire-and-forget, unless we recieve an error back
    let currentPlaces = []
    places.map((place, i) => {
      if (place.placeKey !== e.placeKey) {
        currentPlaces.push(place)
      }
    })
    setPlaces([])
    setPlaces(currentPlaces)
    
    const { data } = await axios.post(`${process.env.REACT_APP_API}delete`, { placeKey: e.placeKey })
    // upon error, re-hydrate record
    if (data.status === 'error') {
      currentPlaces = places

      currentPlaces.push({
        placeKey: e.placeKey,
        picture: e.picture,
        city: e.city,
        stateOrProvince: e.stateOrProvince,
        countryCode: e.countryCode
      })
      setPlaces([])
      setPlaces(currentPlaces)
      
      return setMessage(data.message)
    }
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
          if (place.placeKey === "0") return <div key={Math.random()} style={{ marginBottom: "15px"}}>{`${place.city}, ${place.stateOrProvince} ${place.countryCode}`}</div>
          if (place.picture) return <div key={place.placeKey} style={{ marginBottom: "15px"}}><Link to={`/place/${place.placeKey}`}><img src={`${process.env.REACT_APP_PICTURE_URL + place.picture}`} style={{ maxHeight: "125px", maxWidth: "125px"}} /><br/>{`${place.city}, ${place.stateOrProvince} ${place.countryCode}`}</Link> <span style={{ fontSize: ".8rem" }} onClick={() => handleDelete(place)}>Delete</span></div>

          return <div key={place.placeKey} style={{ marginBottom: "15px"}}><Link to={`/place/${place.placeKey}`}>{`${place.city}, ${place.stateOrProvince} ${place.countryCode}`}</Link> <span onClick={() => handleDelete(place)} style={{ fontSize: ".8rem" }}>Delete</span></div>
        })
      }
    </div>
  )
}



