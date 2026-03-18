import { Link } from 'react-router-dom'
import React from 'react'
import { assets } from '../assets/assets'
import { seededShuffle } from '../utils/imageShuffle'

const HotelCard = ({room, index, imageSeed = "", useAssetRotation = false, overrideImage, overrideAddress, currency = '$'}) => {
  const fallbackImages = [
    assets.roomImg1,
    assets.roomImg2,
    assets.roomImg3,
    assets.roomImg4,
  ].filter(Boolean);

  const roomImages = Array.isArray(room?.images)
    ? room.images.filter(Boolean)
    : [];

  const hasMultipleRoomImages = roomImages.length > 1;
  const galleryImages = hasMultipleRoomImages
    ? roomImages
    : [...roomImages, ...fallbackImages];
  const uniqueImages = Array.from(new Set(galleryImages));

  const shuffledImages = seededShuffle(
    useAssetRotation ? fallbackImages : uniqueImages,
    useAssetRotation ? imageSeed : `${imageSeed}-${room?._id || index}`
  );

  const displayImage =
    overrideImage ||
    shuffledImages[index % shuffledImages.length] ||
    uniqueImages[index % uniqueImages.length] ||
    assets.placeholder;

  return (
    <Link to={'/rooms/' + room._id} onClick={() => window.scrollTo(0,0)} key={room._id} className="block relative">
      <div className="relative">
        <img 
          src={displayImage} 
          alt={room.hotel?.name || "Hotel room"} 
          className='w-full max-w-70 rounded-xl object-cover aspect-[4/3] shadow-[0px_4px_4px_rgba(0,0,0,0.05)]'
        />
        {index % 2 === 0 && (
          <p className='absolute top-3 left-3 px-3 py-1 text-xs bg-white text-gray-800 font-medium rounded-full shadow-sm'>
            Best Seller
          </p>
        )}
      </div>
      
      <div className='p-4 pt-5'>
        <div className='flex items-center justify-between'>
          <p className='font-playfair text-xl font-medium text-gray-800'>{room.hotel?.name}</p>
          <div className='flex items-center gap-1'>
            <img src={assets.starIconFilled} alt="star-icon" className="w-4 h-4" />
            <span className="text-sm">4.5</span>
          </div>
        </div>
        
        <div className='flex items-center gap-1 text-sm text-gray-600 mt-1'>
          <img src={assets.locationIcon} alt="location-icon" className="w-4 h-4" />
          <span>{overrideAddress || room.hotel?.address || "Location not available"}</span>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <p>
            <span className="text-xl font-semibold text-gray-900">{currency}{room.pricePerNight}</span>
            <span className="text-sm text-gray-500 ml-1">/ night</span>
          </p>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  )
}

export default HotelCard


