import React, { useState } from 'react'
import { roomsDummyData } from '../assets/assets'
import {assets, facilityIcons} from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';

const CheckBox = ({label, selected=false, onChange=()=>{}}) => {
  return(
    <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
      <input type="checkbox" checked={selected} onChange={(e)=>onChange(e.target.checked, label)}/>
      <span className='font-light select-none'>{label}</span>
    </label>
  )
}

const RadioButton = ({label, selected=false, onChange=()=>{}}) => {
  return(
    <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
      <input type="radio" name="sortOption" checked={selected} onChange={()=>onChange(label)}/>
      <span className='font-light select-none'>{label}</span>
    </label>
  )
}

const AllRooms = () => {
    const navigate = useNavigate();
    const [openFilters, setOpenFilters] = useState(false);

    const roomTypes = [
      "Single Bed",
      "Double Bed",
      "Luxury Room",
      "Family Suite",
    ]
    
    const priceRanges = [
     '0 to 500',
     '500 to 1000',
      '1000 to 2000',
      '2000 to 3000',
    ]
    
    const sortOptions = [
      'Price Low to High',
      'Price High to Low',
      'Newest First',
    ]
    
    return (
        <div className='flex flex-col lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 gap-8'>
            {/* Main Content - Left Side */}
            <div className='w-full lg:flex-1'>
                {/* Header Section */}
                <div className='flex flex-col items-start text-left mb-8'>
                    <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>Hotels Rooms</h1>
                    <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>
                        Take advantage of our limited offers and special packages to enhance your stay and create unforgettable memories
                    </p>
                </div>
                
                {/* Hotel Cards */}
                {roomsDummyData.map((room, index) => (
                    <div key={index} className='flex flex-col md:flex-row gap-6 mb-8 pb-8 border-b border-gray-200 last:border-b-0'>
                        {/* Image Section */}
                        <div className='md:w-1/3'>
                            <img 
                                onClick={() => {
                                    navigate(`/rooms${room._id}`);
                                    window.scrollTo(0, 0);
                                }}
                                src={room.images[0]} 
                                alt={room.hotel.name} 
                                title="View Rooms Details" 
                                className='w-full h-48 md:h-40 object-cover rounded-xl shadow-lg cursor-pointer hover:opacity-90 transition' 
                            />
                        </div>
                        
                        {/* Content Section */}
                        <div className='md:w-2/3 flex flex-col gap-2'>
                            <p className='text-gray-500 text-sm uppercase tracking-wide'>{room.hotel.city}</p>
                            <p 
                                onClick={() => {
                                    navigate(`/rooms${room._id}`);
                                    window.scrollTo(0, 0);
                                }} 
                                className='text-gray-800 text-2xl md:text-3xl font-playfair cursor-pointer hover:text-gray-600'
                            >
                                {room.hotel.name}
                            </p>
                            
                            <div className='flex items-center'>
                                <StarRating />
                                <p className='ml-2 text-sm text-gray-600'>200+ reviews</p>
                            </div>
                            
                            <div className='flex items-center mt-3 mb-6 gap-4'>
                                <img src={assets.locationIcon} alt="location-icon" className='w-4 h-4' />
                                <span>{room.hotel.address}</span>
                            </div>
                            
                            <div className='flex items-center gap-4 mt-4'>
                                {room.amenities.map((item, index) => (
                                    <div key={index} className='flex items-center gap-2 bg-[#f5f5ff]/70 px-3 py-2 rounded-lg'>
                                        <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                        <p className='text-sm'>{item}</p>
                                    </div>
                                ))}
                            </div>
                            <p className='text-xl font-medium text-gray-700'>${room.pricePerNight}/night</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Section - Right Side */}
            <div className='w-full lg:w-80 bg-white border border-gray-300 text-gray-600 rounded-lg p-4'>
                <div className={`flex items-center justify-between px-5 py-2.5 ${openFilters ? "border-b" : ""} border-gray-300`}>
                    <p className='text-base font-medium text-gray-800'>Filters</p>
                    <div className='text-xs cursor-pointer flex items-center gap-2'>
                      <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>{openFilters ? "Hide" : "Show"} Filters</span>
                      <span className='hidden lg:block'>CLEAR</span>
                    </div>
                </div>
                
                <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
                  <div className='px-5 pt-5'>
                    <p className='font-medium text-gray-800 pb-2'>Popular Filters</p>
                    {roomTypes.map((room, index) => (
                      <CheckBox key={index} label={room}/>
                    ))}
                  </div>
                  
                  <div className='px-5 pt-5'>
                    <p className='font-medium text-gray-800 pb-2'>Price Range</p>
                    {priceRanges.map((range, index) => (
                      <CheckBox key={index} label={`$ ${range}`}/>
                    ))}
                  </div>
                  
                  <div className='px-5 pt-5'>
                    <p className='font-medium text-gray-800 pb-2'>Sort By</p>
                    {sortOptions.map((option, index) => (
                      <RadioButton key={index} label={option}/>   
                    ))}
                  </div>
                </div>
            </div>
        </div>
    )
}

export default AllRooms