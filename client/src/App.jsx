import React, { useEffect } from 'react';
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
import ListRoom from './pages/hotelOwner/ListRoom'; 
import {Toaster} from 'react-hot-toast'   // {} hatao
import { useAppContext } from './context/AppContext';
import { toast } from 'react-hot-toast';
import { Loader } from 'lucide-react';
const App = () => {
  const location = useLocation();
  const isOwnerPath = location.pathname.includes("owner"); 
  const { showHotelReg, axios } = useAppContext();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('newsletter_verify');
    if (!token) return;

    const verify = async () => {
      try {
        const { data } = await axios.get(`/api/newsletter/verify?token=${token}`);
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message || 'Verification failed');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    };

    verify();
  }, [location.search, axios]);
  return (
    <div>
      <Toaster/>
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className='min-h-[78vh]'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomsDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
           <Route path='/loader/:nextUrl' element={<Loader/>} />
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
