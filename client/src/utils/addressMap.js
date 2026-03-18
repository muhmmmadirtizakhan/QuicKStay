export const getProfessionalAddress = (city, fallback) => {
  const addressByCity = {
    "New York": "5th Avenue, Midtown, New York, NY",
    "Dubai": "Sheikh Zayed Rd, Downtown Dubai",
    "London": "Marylebone Rd, London, UK",
    "Singapore": "Orchard Rd, Singapore",
  };

  if (city && addressByCity[city]) return addressByCity[city];
  if (city) return `Downtown ${city}`;
  return fallback || "City Center";
};
