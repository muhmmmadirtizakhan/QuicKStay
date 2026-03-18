import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const AddRoom = () => {
  const { axios, getToken } = useAppContext();
  const [images, setImages] = useState({1: null, 2: null, 3: null, 4: null})
  const [inputs, setInputs] = useState({
    roomType: '',
    pricePerNight: '',
    amenities: {
      'Free WiFi': false,
      'Free Breakfast': false,
      'Room Service': false,
      'Pool Access': false,
      'Mountain View': false,
    }
  })
  const [loading, setLoading] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const safeMessage = (msg, fallback) =>
    typeof msg === 'string' && msg.trim() ? msg : fallback

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    
    // Validation check
    if (!inputs.roomType || !inputs.pricePerNight || !Object.values(images).some(image => image)) {
      toast.error("Please fill in all the details")
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('roomType', inputs.roomType)
      formData.append('pricePerNight', inputs.pricePerNight)
      
      // Get selected amenities
      const selectedAmenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key])
      formData.append('amenities', JSON.stringify(selectedAmenities))
      
      // Append images
      Object.keys(images).forEach((key) => {
        if (images[key]) {
          formData.append('images', images[key])
        }
      })
      
      // Get token and make API call
      const token = await getToken();
      const { data } = await axios.post('/api/rooms', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Handle response
      if (data.success) {
        toast.success(safeMessage(data.message, "Room added successfully!"))
        
        // Reset form
        setInputs({
          roomType: '',
          pricePerNight: '',
          amenities: {
            'Free WiFi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Pool Access': false,
            'Mountain View': false,
          }
        })
        setImages({1: null, 2: null, 3: null, 4: null})
        setFormKey(prev => prev + 1)
      } else {
        toast.error(safeMessage(data.message, "Failed to add room"))
      }   
    } catch (error) {
      console.error('Error adding room:', error)
      toast.error(
        safeMessage(
          error.response?.data?.message || error.message,
          "Room creation failed. Please try again."
        )
      )   
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <Title 
        align='left' 
        font='outfit' 
        title='Add Room' 
        subTitle='Fill in the details carefully with accurate room details, pricing, and amenities to enhance the user booking experience.'
      />
      
      <form key={formKey} onSubmit={onSubmitHandler} className="space-y-6">
        {/* Image Upload Section */}
        <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
          {Object.keys(images).map((key) => (
            <label htmlFor={`roomImage${key}`} key={key} className="relative">
              <img 
                className='max-h-24 cursor-pointer opacity-80 hover:opacity-100 transition border-2 border-gray-300 rounded-lg p-1' 
                src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} 
                alt={`Room ${key}`} 
              />
              <input 
                type="file" 
                accept='image/*' 
                id={`roomImage${key}`} 
                hidden 
                onChange={e => setImages({...images, [key]: e.target.files[0]})}
              />
              {images[key] && (
                <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-1 rounded">
                  ✓
                </span>
              )}
            </label>
          ))}
        </div>
        
        {/* Room Type and Price Section */}
        <div className='w-full flex max-sm:flex-col sm:gap-4'>
          <div className='flex-1 max-w-48'>
            <p className='text-gray-800 mt-4'>Room Type</p>
            <select 
              value={inputs.roomType} 
              onChange={e => setInputs({...inputs, roomType: e.target.value})} 
              className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary'
            >
              <option value="">Select Room Type</option>
              <option value="Single Bed">Single Bed</option>
              <option value="Double Bed">Double Bed</option>
              <option value="Luxury Bed">Luxury Bed</option>
              <option value="Family Bed">Family Bed</option>
            </select>
          </div>
          
          <div>
            <p className='mt-4 text-gray-800'>Price <span className='text-xs'>/night</span></p>
            <input 
              type="number" 
              placeholder='0' 
              min="0"
              className='border border-gray-300 mt-1 rounded p-2 w-24 focus:outline-none focus:ring-2 focus:ring-primary' 
              value={inputs.pricePerNight} 
              onChange={e => setInputs({...inputs, pricePerNight: e.target.value})}
            />
          </div>
        </div>
        
        {/* Amenities Section */}
        <div>
          <p className='text-gray-800 mt-4'>Amenities</p>
          <div className='grid grid-cols-2 gap-2 mt-1 text-gray-600 max-w-sm'>
            {Object.keys(inputs.amenities).map((amenity, index) => (
              <div key={index} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id={`amenities${index + 1}`} 
                  checked={inputs.amenities[amenity]} 
                  onChange={() => setInputs({
                    ...inputs, 
                    amenities: {
                      ...inputs.amenities, 
                      [amenity]: !inputs.amenities[amenity]
                    }
                  })}
                  className="cursor-pointer"
                />
                <label htmlFor={`amenities${index + 1}`} className="cursor-pointer"> {amenity}</label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit" 
          className='bg-primary text-white px-8 py-3 rounded mt-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition font-semibold'
          disabled={loading}
        >
          {loading ? 'Adding Room...' : 'Add Room'}
        </button>
      </form>
    </div>
  )
}

export default AddRoom
