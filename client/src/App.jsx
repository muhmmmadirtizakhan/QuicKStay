import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import AllRooms from './pages/AllRooms'; 
import MyBookings from './pages/MyBookings';
import RoomsDetails from './pages/RoomsDetails';
import HotelReg from './components/HotelReg';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';  // {} hatao
import AddRoom from './pages/hotelOwner/AddRoom';      // {} hatao
import ListRoom from './pages/hotelOwner/ListRoom';    // {} hatao

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner"); 
  
  return (
    <div>
      {!isOwnerPath && <Navbar />}
      {false && <HotelReg />}
      <div className='min-h-[78vh]'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomsDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          
          <Route path='/owner' element={<Layout />}>
            <Route index element={<Dashboard />}/>
            <Route path="add-room" element={<AddRoom />}/>
            <Route path="list-room" element={<ListRoom />}/>

          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;