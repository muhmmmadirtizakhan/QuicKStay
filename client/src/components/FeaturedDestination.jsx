import React from 'react'
import HotelCard from './HotelCard'
import { roomsDummyData } from '../assets/assets' 
import Title from './Title'
import { useNavigate } from 'react-router-dom'  // ✅ Fixed import

const FeaturedDestination = () => {
  const navigate = useNavigate();  // ✅ Hook call

  const handleViewAll = () => {
    navigate('/rooms');  // ✅ Correct way
    window.scrollTo(0, 0);  // ✅ Fixed scroll
  }

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
      <Title 
        title='Featured Destinations' 
        subTitle='Discover our most handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experience'
      />     
      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {roomsDummyData.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
      
      {/* ✅ Fixed button */}
      <button 
        onClick={handleViewAll}
        className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'
      >
        View All Destinations
      </button>
    </div>
  )
}

export default FeaturedDestination