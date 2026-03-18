import React, { useEffect } from 'react'
import Navbar from '../../components/hotelOwner/Navbar'  // 2 levels up then components/hotelOwner
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/hotelOwner/Sidebar'
import {useAppContext} from'../../context/AppContext'
const Layout = () => {
const{isOwner,navigate,user,userRoleLoaded,userRoleError}=useAppContext();
useEffect(()=>{
if(userRoleLoaded && !user){
  navigate('/')
  return
}
if(userRoleLoaded && user && !isOwner && !userRoleError){
  navigate('/')
}
},[isOwner,user,userRoleLoaded,userRoleError])


  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className='flex  h-full'>
        <Sidebar/>
        <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Layout
