import React from 'react'

const ImageProduct = ({link}) => {
  return (
    <div key={link}>
        <img src={link} alt={link} height={300} width={300} />
    </div>
  )
}

export default ImageProduct