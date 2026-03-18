// Get/api/user/
export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchCities = req.user.recentSearchedCities;
        res.json({ success: true, role, recentSearchCities });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//store the user recent searched cities
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        const user = req.user;  // ✅ await nahi lagta
        
        if (user.recentSearchedCities.length < 3) {  // ✅ spelling: recentSearchedCities
            user.recentSearchedCities.push(recentSearchedCity);
        } else {
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity);
        }
        
        await user.save();
        res.json({ success: true, message: "city added" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}