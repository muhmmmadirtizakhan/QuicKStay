import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import { getRotatingImage } from '../utils/imageShuffle'
import { getProfessionalAddress } from '../utils/addressMap'

const MyBookings = () => {
  const { axios, getToken, user } = useAppContext();
  const [bookings, setBookings] = useState([])
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const fetchUserBookings = async () => {
    try {
      const token = await getToken(); // ✅ Token pehle fetch karo
      const { data } = await axios.get('/api/bookings/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (data.success) {
        setBookings(data.bookings)
        toast.success('Bookings loaded successfully!')
      } else {
        toast.error(data.message || 'Failed to fetch bookings')
      }    
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // ✅ Sirf ek handlePayment function rakho (duplicate hataya)
  const handlePayment = async (bookingId) => {
    try {
      const token = await getToken();
      
      // ❌ Issue: {bookingId,{headers...}} - ye syntax galat tha
      // ✅ Fixed: Proper object structure
      const { data } = await axios.post('/api/bookings/stripe-payment', 
        { bookingId },  // ✅ Body alag
        { headers: { Authorization: `Bearer ${token}` } }  // ✅ Headers alag
      )
      
      if (data.success) {
        window.location.href = data.url;  // ✅ Redirect to Stripe
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    const verifyStripePayment = async (sessionId) => {
      try {
        const token = await getToken();
        const { data } = await axios.get(
          `/api/bookings/stripe-success?session_id=${sessionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (data.success) {
          toast.success(data.message || 'Payment successful')
          await fetchUserBookings()
        } else {
          toast.error(data.message || 'Payment verification failed')
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message)
      } finally {
        navigate('/my-bookings', { replace: true })
      }
    }

    if (user) {
      const sessionId = searchParams.get('session_id')
      const canceled = searchParams.get('canceled')

      if (sessionId) {
        verifyStripePayment(sessionId)
      } else {
        fetchUserBookings()
        if (canceled) {
          toast.error('Payment canceled')
          navigate('/my-bookings', { replace: true })
        }
      }
    }
  }, [user, searchParams, navigate])

  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
      <Title 
        title='My Bookings' 
        subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks' 
        align='left'
      />
      
      {bookings.length === 0 ? (
        <p className='text-center text-gray-500 mt-10'>No bookings found</p>
      ) : (
        <div className='max-w-6xl mt-8 w-full text-gray-800'>
          <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
            <div>Hotels</div>
            <div>Date & timings</div>
            <div>Payment</div>
          </div>
          
          {bookings.map((booking, index) => (
            <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
              <div className='flex flex-col md:flex-row'>
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
                      `booking-${booking?._id || index}`
                    ) || assets.placeholder;
                  return (
                    <img 
                      src={displayImage} 
                      alt="hotel-img" 
                      className='min-md:w-44 rounded shadow object-cover h-32 w-32' 
                    />
                  );
                })()}
                <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                  <p className='font-playfair text-2xl'>
                    {booking.hotel?.name || booking.room?.hotel?.name || 'Hotel Name'}
                    <span className='font-inter text-sm'> ({booking.room?.roomType || 'Room'})</span>
                  </p>
                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <img src={assets.locationIcon} alt="location-icon" className='w-4 h-4' />
                    <span>{getProfessionalAddress(booking.hotel?.city || booking.room?.hotel?.city, booking.hotel?.address || booking.room?.hotel?.address)}</span>
                  </div>
                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <img src={assets.guestsIcon} alt="guests-icon" className='w-4 h-4' />
                    <span>Guests : {booking.guests || 1}</span>
                  </div>
                  <p className='text-base'>Total : ${booking.totalPrice || 0}</p>
                </div>
              </div>
              
              <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                <div>
                  <p className='font-medium'>Check-In</p>
                  <p className="text-gray-500 text-sm">
                    {booking.checkInDate ? new Date(booking.checkInDate).toDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className='font-medium'>Check-Out</p>
                  <p className="text-gray-500 text-sm">
                    {booking.checkOutDate ? new Date(booking.checkOutDate).toDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className='flex flex-col items-start justify-center pt-3'>
                <div className='flex items-center gap-2'>
                  <div className={`h-3 w-3 rounded-full ${booking.isPaid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className='text-sm'>{booking.isPaid ? "Paid" : "Unpaid"}</p>
                </div>
                {!booking.isPaid && (
                  <button 
                    onClick={() => handlePayment(booking._id)}
                    className='px-4 py-1 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings
