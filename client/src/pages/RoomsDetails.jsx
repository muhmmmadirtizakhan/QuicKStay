import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { assets, facilityIcons, roomCommonData } from '../assets/assets';
import { getProfessionalAddress } from '../utils/addressMap';
import { seededShuffle } from '../utils/imageShuffle';
import StarRating from '../components/StarRating';
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast';

const RoomsDetails = () => {
  const { id } = useParams();
  const { rooms, getToken, axios, navigate } = useAppContext();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (rooms && id) {
      const foundRoom = rooms.find(room => room._id === id);
      if (foundRoom) {
        setRoom(foundRoom);
        const fallbackImages = [
          assets.roomImg1,
          assets.roomImg2,
          assets.roomImg3,
          assets.roomImg4,
        ].filter(Boolean);
        const roomImages = Array.isArray(foundRoom?.images)
          ? foundRoom.images.filter(Boolean)
          : [];
        const galleryImages = roomImages.length > 1
          ? roomImages
          : [...roomImages, ...fallbackImages];
        const uniqueImages = Array.from(new Set(galleryImages));
        const shuffledImages = seededShuffle(uniqueImages, foundRoom?._id || String(id));
        setMainImage(shuffledImages[0] || uniqueImages[0] || assets.placeholder);
      }
    }
  }, [rooms, id]);

  const checkAvailability = async (e) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    
    if (checkInDate >= checkOutDate) {
      toast.error('Check-In Date should be less than Check-Out Date');
      return;
    }
    
    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.post('/api/bookings/check-availability', 
        { 
          room: id,
          checkInDate, 
          checkOutDate 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        if (data.isAvailable) {
          setIsAvailable(true);
          toast.success('Room is available');
        } else {
          setIsAvailable(false);
          toast.error('Room is not available');
        }
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Availability check error:', error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!isAvailable) {
      await checkAvailability(e);
    } else {
      try {
        const token = await getToken();
        const { data } = await axios.post('/api/bookings/book', 
          { 
            room: id, 
            checkInDate, 
            checkOutDate, 
            guests, 
            paymentMethod: "Pay At Hotel" 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (data.success) {
          toast.success(data.message);
          navigate('/my-bookings');
          window.scrollTo(0, 0);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error('Booking error:', error);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  if (!room) {
    return (
      <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 text-center'>
        <p className='text-gray-500'>Loading room details...</p>
      </div>
    );
  }

  const fallbackImages = [
    assets.roomImg1,
    assets.roomImg2,
    assets.roomImg3,
    assets.roomImg4,
  ].filter(Boolean);
  const roomImages = Array.isArray(room?.images) ? room.images.filter(Boolean) : [];
  const galleryImages = roomImages.length > 1
    ? roomImages
    : [...roomImages, ...fallbackImages];
  const uniqueImages = Array.from(new Set(galleryImages));
  const shuffledImages = seededShuffle(uniqueImages, room?._id || String(id));

  return (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      {/* Room Details Header */}
      <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
        <h1 className='text-3xl md:text-4xl font-playfair'>
          {room.hotel?.name} <span className='font-inter text-sm'>{room.roomType}</span>
        </h1>
        <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>
          20% OFF
        </p>
      </div>
      
      {/* Rating and Reviews */}
      <div className='flex items-center gap-1 mt-2'>
        <StarRating rating={room.rating || 4.5} />
        <p className='ml-2'>{room.reviews || 200}+ Reviews</p>
      </div>
      
      {/* Location */}
      <div className='flex items-center gap-1 text-gray-500 mt-2'>
        <img src={assets.locationIcon} alt="location icon" className='w-4 h-4' />
        <span>{getProfessionalAddress(room.hotel?.city, room.hotel?.address)}</span>
      </div>
      
      {/* Images Section */}
      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        <div className='lg:w-1/2 w-full'>
          <img src={mainImage} alt="Room Image" className='w-full rounded-xl shadow-lg object-cover h-96' />
        </div>
        <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
          {shuffledImages.length > 1 && shuffledImages.map((image, index) => (
            <img 
              key={index}
              src={image}
              alt="Room Image"
              className={`w-full rounded-xl shadow-md object-cover h-44 cursor-pointer ${mainImage === image ? 'outline outline-3 outline-orange-500' : ''}`}
              onClick={() => setMainImage(image)}
            />
          ))}
        </div>
      </div>

      {/* Description and Price */}
      <div className='flex flex-col md:flex-row md:justify-between mt-10'>
        <div className='flex flex-col'>
          <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h1>
          <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
            {room.amenities?.map((item, index) => ( 
              <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                <img className='w-5 h-5' src={facilityIcons?.[item]} alt={item} />
                <p className='text-xs'>{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className='text-2xl font-medium'>${room.pricePerNight}/night</p>
      </div>

      {/* Booking Form - FIXED MOBILE GUESTS INPUT */}
      <form onSubmit={onSubmitHandler} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
        <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500 w-full'>
          {/* Check-In Date */}
          <div className='flex flex-col w-full md:w-auto'>
            <label htmlFor="checkInDate" className='font-medium'>Check-In</label>
            <input 
              type="date" 
              id='checkInDate' 
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className='w-full md:w-40 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' 
              required
            />
          </div>
          
          {/* Check-Out Date */}
          <div className='flex flex-col w-full md:w-auto'>
            <label htmlFor="checkOutDate" className='font-medium'>Check-Out</label>
            <input 
              type="date" 
              id='checkOutDate' 
              value={checkOutDate}
              min={checkInDate} 
              disabled={!checkInDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className='w-full md:w-40 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' 
              required
            />
          </div>
          
          {/* ✅ FIXED: Mobile-friendly Guests Input with +/- buttons */}
          <div className='flex flex-col w-full md:w-auto'>
            <label htmlFor="guests" className='font-medium'>Guests</label>
            <div className='flex items-center mt-1.5'>
              <button 
                type="button"
                onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                className='px-4 py-2 bg-gray-100 border border-gray-300 rounded-l-md text-lg font-bold hover:bg-gray-200'
              >
                -
              </button>
              <input 
                type="number" 
                id='guests' 
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                min="1" 
                max="10"
                className='w-16 text-center border-y border-gray-300 px-2 py-2 outline-none'
                required
              />
              <button 
                type="button"
                onClick={() => setGuests(prev => Math.min(10, prev + 1))}
                className='px-4 py-2 bg-gray-100 border border-gray-300 rounded-r-md text-lg font-bold hover:bg-gray-200'
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit"
          disabled={loading}
          className='bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md w-full md:w-auto max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer disabled:opacity-50'
        >
          {loading ? "Processing..." : isAvailable ? "Book Now" : "Check Availability"}
        </button>
      </form>

      {/* Availability Status */}
      {isAvailable && (
        <div className='flex justify-center mt-4'>
          <p className='text-green-600 font-semibold'>✓ Room is available for selected dates!</p>
        </div>
      )}

      {/* Room Common Data Section */}
      <div className='mt-25 space-y-4'>
        {roomCommonData?.map((spec, index) => (
          <div key={index} className='flex items-start gap-2'>
            <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5'/>
            <div>
              <p className='text-base font-medium'>{spec.title}</p>
              <p className='text-gray-500 text-sm'>{spec.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Room Description */}
      <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
        <p className='leading-relaxed'>{room.description || "Guests will be allocated accommodation on the ground floor, subject to availability. You'll enjoy a comfortable two-bedroom apartment that offers a true city living experience. The price quoted is for two guests — please specify the number of guests at the time of booking to receive an exact price for larger groups."}</p>
      </div>
      
      {/* Host Information */}
      <div className='flex flex-col items-start gap-4'>
        <div className='flex gap-4'>
          <img src={room.host?.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9GXb6s2-MaZFimiAszBkTgXVTsAJk0WqkCw&s"} alt='Host' className='w-14 h-14 md:h-18 md:w-18 rounded-full object-cover'/>
          <div>
            <p className='text-lg md:text-xl font-medium'>Hosted by {room.host?.name || room.hotel?.name}</p>
            <div className='flex items-center mt-1'>
              <StarRating rating={room.host?.rating || 4.5} />
              <p className='ml-2 text-gray-600'>{room.host?.reviews || 200}+ reviews</p>
            </div>
          </div>
        </div>
        <button className='px-6 py-2.5 mt-2 rounded-lg text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer font-medium'>
          Contact Host
        </button>
      </div>
    </div>
  )
}

export default RoomsDetails;