import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default (props) => {
  const [message, setMessage] = useState('')
  const [city, setCity] = useState('')
  const [stateOrProvince, setStateOrProvince] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [picture, setPicture] = useState('')
  const [updateButton, setUpdateButton] = useState('Submit')

  useEffect(() => {
    if (typeof props.match.params.id !== 'undefined') {
      (async () => {
        const { data : { place } } = await axios.get(`${process.env.REACT_APP_API}place/${props.match.params.id}`)
        if (place) {
          setUpdateButton('Update')

          if (place.picture) setPicture(place.picture)
          if (place.city) setCity(place.city)
          if (place.stateOrProvince) setStateOrProvince(place.stateOrProvince)
          if (place.countryCode) setCountryCode(place.countryCode)
        }
      })()
    }
  }, [props.match.params.id])

  async function upload(e) {
    const file = e.target.files[0]

    const { data } = await axios.post(`${process.env.REACT_APP_API}signed-url`, { fileName: file.name })
    const { picture, signedUrl } = data

    await axios.put(`${signedUrl}`, file, { headers: { 'Content-Type': '*/*' } })
    await axios.post(`${process.env.REACT_APP_API}save-picture`, {
      placeKey: props.match.params.id,
      picture
    })
    setPicture(picture)
  }

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

  function deletePicture() {
    axios.post(`${process.env.REACT_APP_API}delete-picture`, { placeKey: props.match.params.id, picture })
    setPicture('')
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
        {(picture && (
          <div>
            <img src={`${process.env.REACT_APP_PICTURE_URL + picture}`} style={{ maxHeight: "300px", maxWidth: "300px" }} /><br/>
            <span onClick={() => deletePicture() } style={{ fontSize: ".85rem" }}>Delete Picture</span>
          </div>
        ))}
        {(!picture && <input type="file" onChange={(e) => upload(e)} />)}

        <div style={{ height: '15px' }}>{message}</div>
        City:<br/>
        <input type="text" value={city} name="city" onChange={handleChange} /><br/><br/>

        State or Province:<br/>
        <input type="text" value={stateOrProvince} name="stateOrProvince" onChange={handleChange} /><br/><br/>

        Country Code:<br/>
        <input type="text" value={countryCode} name="countryCode" onChange={handleChange} /><br/><br/>

        <button type="button" onClick={() => handleSubmit()}>{updateButton}</button>
      </form>
    </div>
  )
}



