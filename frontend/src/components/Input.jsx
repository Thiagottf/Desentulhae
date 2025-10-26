import React from "react"

const Input = ({ type, placeholder, value, onChange, required, name, className, ...rest }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full p-3 rounded-lg bg-transparent focus:outline-none ${className}`}
      {...rest}
    />
  )
}

export default Input
