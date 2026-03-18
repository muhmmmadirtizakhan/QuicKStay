import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import ExclusiveOffer from '../components/ExclusiveOffer'
import Testimonials from '../components/Testimonials'
import NewsLetter from '../components/NewsLetter'
import RecommendedHotels from '../components/RecommendedHotels'  // ✅ Fixed: RecommmendedHotels → RecommendedHotels

const Home = () => {
  return (
    <>
      <Hero />
      <RecommendedHotels/>  {/* ✅ Fixed spelling */}
      <FeaturedDestination />
      <ExclusiveOffer />
      <Testimonials />
      <NewsLetter/>
    </>
  )
}

export default Home