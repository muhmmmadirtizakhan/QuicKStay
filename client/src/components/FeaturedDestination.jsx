import React from 'react'
import HotelCard from './HotelCard' 
import Title from './Title'
import { useNavigate } from 'react-router-dom'  // ✅ Fixed import
import {useAppContext} from '../context/AppContext'
import { assets } from '../assets/assets'
import { getRotatingImage } from '../utils/imageShuffle'
import { getProfessionalAddress } from '../utils/addressMap'
const FeaturedDestination = () => {
 const {rooms,navigate,currency}=useAppContext();

  const assetImages = [assets.roomImg1, assets.roomImg2, assets.roomImg3, assets.roomImg4].filter(Boolean);

  const handleViewAll = () => {
    navigate('/rooms');  // ✅ Correct way
    window.scrollTo(0, 0);  // ✅ Fixed scroll
  }

  return rooms.length>0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
      <Title 
        title='Featured Destinations' 
        subTitle='Discover our most handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experience'
      />     
      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {rooms.slice(0, 4).map((room, index) => {
          const cityKey = room?.hotel?.city || "City Center";
          const image = getRotatingImage(assetImages, index, `featured-${cityKey}`);
          const address = getProfessionalAddress(cityKey, room?.hotel?.address);
          return (
          <HotelCard
            key={room._id}
            room={room}
            index={index}
            imageSeed="featured"
            useAssetRotation
            overrideImage={image}
            overrideAddress={address}
            currency={currency || '$'}
          />
          );
        })}
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
