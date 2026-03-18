// components/RecommendedHotels.jsx
import React, { useEffect, useState } from 'react'
import HotelCard from './HotelCard'
import Title from './Title'  // ✅ Title import hai na?
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { getRotatingImage } from '../utils/imageShuffle'
import { getProfessionalAddress } from '../utils/addressMap'

const RecommendedHotels = () => {
  const { rooms, searchedCities, currency } = useAppContext();
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    if (!Array.isArray(rooms) || rooms.length === 0) {
      setRecommended([]);
      return;
    }

    const normalizedCities = Array.isArray(searchedCities)
      ? searchedCities
          .map((city) => city?.toLowerCase()?.trim())
          .filter(Boolean)
      : [];

    const filtered = normalizedCities.length
      ? rooms.filter((room) =>
          normalizedCities.includes(room?.hotel?.city?.toLowerCase()?.trim())
        )
      : [];

    // If user hasn't searched yet (or no matches), show a different set/order than Featured.
    const fallback = rooms.slice().reverse();
    setRecommended(filtered.length > 0 ? filtered : fallback);
  }, [rooms, searchedCities]);

  if (recommended.length === 0) return null;

  const assetImages = [assets.roomImg1, assets.roomImg2, assets.roomImg3, assets.roomImg4].filter(Boolean);

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
      {/* ✅ Title component render ho raha hai? */}
      <Title 
        title='Recommended Hotels' 
        subTitle='Discover our most handpicked selection of exceptional properties around the world'
      />
      
      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {recommended.slice(0, 4).map((room, index) => {
          const cityKey = room?.hotel?.city || "City Center";
          const image = getRotatingImage(assetImages, index, "recommended");
          const address = getProfessionalAddress(cityKey, room?.hotel?.address);
          return (
          <HotelCard
            key={room._id || index}
            room={room}
            index={index}
            imageSeed="recommended"
            useAssetRotation
            overrideImage={image}
            overrideAddress={address}
            currency={currency || '$'}
          />
          );
        })}
      </div>
    </div>
  )
}

export default RecommendedHotels
