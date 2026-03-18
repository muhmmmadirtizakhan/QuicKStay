import Hotel from "../models/Hotel.js"
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js"

export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await Hotel.findOne({ owner: req.user._id });
        
        if (!hotel) return res.json({ success: false, message: "no hotel found" });
        if (!req.files || req.files.length === 0) {
            return res.json({ success: false, message: "please upload at least one image" });
        }
        
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        });
        
        const images = await Promise.all(uploadImages);
        
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: amenities ? JSON.parse(amenities) : [],
            images,
        });
        
        res.json({ success: true, message: "room created successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message || "room creation failed" });
    }
}

export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 });  // Fixed: createAt -> createdAt

        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.user._id });
        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate('hotel');  // Fixed: Added populate
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;  // Fixed: re.body -> req.body
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;  // Fixed: toggle correctly
        await roomData.save();
        res.json({ success: true, message: "ROOM AVAILABILITY UPDATED" });  // Fixed: spelling
    } catch (error) {
        res.json({ success: false, message: error.message });  // Fixed: duplicate message property
    }
}
