import React, { useState } from 'react'
import Title from './Title'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
const NewsLetter = () => {
  const { axios } = useAppContext();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/newsletter/subscribe', { email });
      if (data.success) {
        toast.success(data.message);
        setEmail('');
      } else {
        toast.error(data.message || 'Failed to subscribe');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-5xl lg:w-full rounded-2xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-30 bg-gray-900 text-white">
   <Title  
        title="Stay Inspired" 
        subTitle="Join our newsletter and be the first to discover new destinations, exclusive offers and travel inspiration"
      />  
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
        <input 
          type="email" 
          className="bg-white/10 px-4 py-2.5 border border-white/20 rounded outline-none max-w-66 w-full text-white" 
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="flex items-center justify-center gap-2 group bg-black px-4 md:px-7 py-2.5 rounded active:scale-95 transition-all hover:bg-gray-800 disabled:opacity-60"
        >
          Subscribe
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <p className="text-gray-500 mt-6 text-xs text-center">
        By subscribing, you agree to our Privacy Policy and consent to receive updates.
      </p>
    </div>
  )
}

export default NewsLetter
