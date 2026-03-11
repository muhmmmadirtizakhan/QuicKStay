import React from 'react'
import Title from './Title'
import { assets, exclusiveOffers } from '../assets/assets'

const ExclusiveOffer = () => {
  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-32'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row items-center justify-between w-full'>
        <Title 
          align='left' 
          title='Exclusive Offers' 
          subTitle='Take advantage of our limited time offers and special packages to enhance your stay and create unforgettable memories'
        />
        <button className='group flex items-center gap-2 font-medium cursor-pointer max-md:mt-12'>
          View All Offers
          <img 
            src={assets.arrowIcon} 
            alt="arrow-icon" 
            className='group-hover:translate-x-1 transition-all'  // ✅ Fixed typo
          />
        </button>
      </div>

      {/* Offers Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full'>
        {exclusiveOffers?.map((item) => {  // ✅ Optional chaining
          return (  // ✅ Added return statement
            <div 
              key={item._id} 
              className='group relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 pb-6 rounded-xl text-white bg-no-repeat bg-cover bg-center min-h-[300px]' 
              style={{backgroundImage: `url(${item.image})`}}
            >
              {/* Discount Badge */}
              <p className='px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full'>
                {item.priceOff}% OFF
              </p>
              
              {/* Content */}
              <div className='mt-auto w-full'>
                <p className='text-2xl font-medium font-playfair'>{item.title}</p>
                <p className='text-sm'>{item.description}</p>
                <p className='text-xs text-white/70 mt-3'>
                  Expires {item.expiryDate}
                </p>
                
                {/* View Offers Button */}
                <button className='flex items-center gap-2 font-medium cursor-pointer mt-4 mb-2'>
                  View Offers
                  <img 
                    className='invert group-hover:translate-x-1 transition-all' 
                    src={assets.arrowIcon} 
                    alt="arrow-icon" 
                  />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExclusiveOffer