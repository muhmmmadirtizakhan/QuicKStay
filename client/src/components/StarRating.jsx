import React from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'

const StarRating = ({ rating = 4 }) => {
  return (
    <div className="flex">
      {Array(5).fill('').map((_, index) => (
        <span key={index}>
          {rating > index ? 
            <FaStar className="w-4.5 h-4.5 text-yellow-400" /> : 
            <FaRegStar className="w-4.5 h-4.5 text-yellow-400" />
          }
        </span>
      ))}
    </div>
  )
}

export default StarRating