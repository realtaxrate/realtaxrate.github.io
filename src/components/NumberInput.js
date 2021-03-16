import React, {useState} from 'react'

export default function NumberInput({id, initialValue, placeholder, onChange}) {
  const [currentValue, setCurrentValue] = useState(initialValue)

  const handleChange = (event) => {
    event.preventDefault()

    setCurrentValue(event.target.value);

    if (onChange) {
      onChange(event.target.value)
    }
  }

  return (
    <input type='number' id={id} min='0' className='border-solid w-32 rounded-md border-2 text-right' value={currentValue} placeholder={placeholder} onChange={handleChange} />
  )
}
