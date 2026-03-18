import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'  // ✅ Missing import
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext'  // ✅ Missing import
import { assets, facilityIcons } from '../assets/assets'
import { getRotatingImage } from '../utils/imageShuffle'
import { getProfessionalAddress } from '../utils/addressMap'
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
  const [searchParams, setSearchParams] = useSearchParams()  // ✅ Fixed
  const { rooms, navigate, currency } = useAppContext();  // ✅ Fixed
  const [openFilters, setOpenFilters] = useState(false);
  
  // ✅ Fixed: Capital letters se small letters
  const [selectedFilters, setSelectedFilters] = useState({
    roomTypes: [],
    priceRanges: [],
  });
  
  const [selectedSort, setSelectedSort] = useState('');  // ✅ Fixed
  
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
  
  // ✅ FIXED: handleFilterChange function
  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (checked) {
        // ✅ Fixed: type ke according update karo
        if (type === 'roomTypes') {
          updatedFilters.roomTypes = [...updatedFilters.roomTypes, value];
        } else if (type === 'priceRanges') {
          updatedFilters.priceRanges = [...updatedFilters.priceRanges, value];
        }
      } else {
        if (type === 'roomTypes') {
          updatedFilters.roomTypes = updatedFilters.roomTypes.filter(item => item !== value);
        } else if (type === 'priceRanges') {
          updatedFilters.priceRanges = updatedFilters.priceRanges.filter(item => item !== value);
        }
      }
      return updatedFilters;
    });
  }
  
  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption)
  }
  
  // ✅ FIXED: matchRoomsType function
  const matchRoomsType = (room) => {
    return selectedFilters.roomTypes.length === 0 || selectedFilters.roomTypes.includes(room.roomType)
  }
  
  // ✅ FIXED: matchPriceRange function
  const matchPriceRange = (room) => {
    return selectedFilters.priceRanges.length === 0 || selectedFilters.priceRanges.some(range => {
      const [min, max] = range.split(' to ').map(Number);
      return room.pricePerNight >= min && room.pricePerNight <= max;
    })
  }
  
  // ✅ FIXED: sortRooms function
  const sortRooms = (a, b) => {
    if (selectedSort === 'Price Low to High') {
      return a.pricePerNight - b.pricePerNight;
    }
    if (selectedSort === 'Price High to Low') {
      return b.pricePerNight - a.pricePerNight;
    }
    if (selectedSort === 'Newest First') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  }
  
  // ✅ FIXED: filterDestination function
  const filterDestination = (room) => {
    const destination = searchParams.get('destination');
    if (!destination) return true;
    return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
  }
  
  // ✅ FIXED: filteredRooms useMemo
  const filteredRooms = useMemo(() => {
    if (!rooms) return [];
    
    return rooms
      .filter(room => matchRoomsType(room) && matchPriceRange(room) && filterDestination(room))
      .sort(sortRooms);
  }, [rooms, selectedFilters, selectedSort, searchParams])
  
  // ✅ FIXED: clearFilters function
  const clearFilters = () => {
    setSelectedFilters({
      roomTypes: [],
      priceRanges: [],
    })
    setSelectedSort('')
    setSearchParams({});
  }

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
        {filteredRooms.length === 0 ? (
          <p className='text-center text-gray-500 mt-10'>No rooms found matching your criteria</p>
        ) : (
          filteredRooms.map((room, index) => (
            <div key={room._id || index} className='flex flex-col md:flex-row gap-6 mb-8 pb-8 border-b border-gray-200 last:border-b-0'>
              {/* Image Section */}
              <div className='md:w-1/3'>
                  {(() => {
                    const assetImages = [
                      assets.roomImg1,
                      assets.roomImg2,
                      assets.roomImg3,
                      assets.roomImg4,
                    ].filter(Boolean);

                    const displayImage =
                      getRotatingImage(
                        assetImages,
                        index,
                        `rooms-${room?.hotel?.city || room?._id || index}`
                      ) || assets.placeholder;

                    return (
                      <img 
                  onClick={() => {
                    navigate(`/rooms/${room._id}`);  // ✅ Fixed: slash add kiya
                    window.scrollTo(0, 0);
                  }}
                  src={displayImage} 
                  alt={room.hotel?.name} 
                  title="View Rooms Details" 
                  className='w-full h-48 md:h-40 object-cover rounded-xl shadow-lg cursor-pointer hover:opacity-90 transition' 
                      />
                    );
                  })()}
              </div>
              
              {/* Content Section */}
              <div className='md:w-2/3 flex flex-col gap-2'>
                <p className='text-gray-500 text-sm uppercase tracking-wide'>{room.hotel?.city}</p>
                <p 
                  onClick={() => {
                    navigate(`/rooms/${room._id}`);  // ✅ Fixed: slash add kiya
                    window.scrollTo(0, 0);
                  }} 
                  className='text-gray-800 text-2xl md:text-3xl font-playfair cursor-pointer hover:text-gray-600'
                >
                  {room.hotel?.name}
                </p>
                
                <div className='flex items-center'>
                  <StarRating rating={room.rating || 4.5} />
                  <p className='ml-2 text-sm text-gray-600'>{room.reviews || 200}+ reviews</p>
                </div>
                
                <div className='flex items-center mt-3 mb-6 gap-4'>
                  <img src={assets.locationIcon} alt="location-icon" className='w-4 h-4' />
                  <span>{getProfessionalAddress(room.hotel?.city, room.hotel?.address)}</span>
                </div>
                
                <div className='flex items-center gap-4 mt-4 flex-wrap'>
                  {room.amenities?.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 bg-[#f5f5ff]/70 px-3 py-2 rounded-lg'>
                      <img src={facilityIcons?.[item]} alt={item} className='w-5 h-5' />
                      <p className='text-sm'>{item}</p>
                    </div>
                  ))}
                </div>
                <p className='text-xl font-medium text-gray-700'>{currency || '$'}{room.pricePerNight}/night</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filters Section - Right Side */}
      <div className='w-full lg:w-80 bg-white border border-gray-300 text-gray-600 rounded-lg p-4'>
        <div className={`flex items-center justify-between px-5 py-2.5 ${openFilters ? "border-b" : ""} border-gray-300`}>
          <p className='text-base font-medium text-gray-800'>Filters</p>
          <div className='text-xs cursor-pointer flex items-center gap-2'>
            <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>
              {openFilters ? "Hide" : "Show"} Filters
            </span>
            <span 
              onClick={clearFilters}  // ✅ Fixed: clearFilters connected
              className='hidden lg:block cursor-pointer hover:text-gray-900'
            >
              CLEAR
            </span>
          </div>
        </div>
        
        <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Popular Filters</p>
            {roomTypes.map((room, index) => (
              <CheckBox 
                key={index} 
                label={room} 
                selected={selectedFilters.roomTypes.includes(room)} 
                onChange={(checked) => handleFilterChange(checked, room, 'roomTypes')}  // ✅ Fixed: 'roomtype' → 'roomTypes'
              />
            ))}
          </div>
          
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Price Range</p>
            {priceRanges.map((range, index) => (
              <CheckBox 
                key={index} 
                label={`$ ${range}`} 
                selected={selectedFilters.priceRanges.includes(range)} 
                onChange={(checked) => handleFilterChange(checked, range, 'priceRanges')}  // ✅ Fixed: variable name
              />
            ))}
          </div>
          
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton 
                key={index} 
                label={option} 
                selected={selectedSort === option}  // ✅ Fixed: options → option
                onChange={() => handleSortChange(option)}
              />   
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllRooms
