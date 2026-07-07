
'use client';

import { useState, useEffect } from "react";
import ApiService from "../../hooks/ApiService";
import getAdvantages from "../../hooks/getNearBy";

const LocationDetails = ({ data, updateData, onNext, isEditMode }) => {
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertyName, setPropertyName] = useState(data.propertyName || '');
  const [city, setCity] = useState(data.address?.city || "");
  const [locality, setLocality] = useState(data.address?.locality || "");
  const [subLocality, setSubLocality] = useState(data.address?.subLocality || "");
  const [apartmentDoorNo, setApartmentDoorNo] = useState(data.address?.apartmentDoorNo || "");
  const [roadFacing, setRoadFacing] = useState(data.address?.road_facing || "");
  const [pincode, setPincode] = useState(data.address?.pincode || "");
  const [lat, setLat] = useState(data.address?.lat || "");
  const [lon, setLon] = useState(data.address?.lon || "");
  const [advantages, setAdvantages] = useState(getAdvantages(data));

  // ✅ Form validation states
  const [errors, setErrors] = useState({
    propertyName: "",
    roadFacing: ""
  });

  // ✅ Detect if property is land-like
  const subtype = (data.propertySubtype || "").trim().toLowerCase();
  const isLand =
    subtype.includes("land") ||
    subtype.includes("plot") ||
    subtype === "farmhouse";

  // ✅ Check if project name is required
  const isProjectNameRequired = !((subtype || "").toLowerCase().includes("land") || (data?.marketType || "").toLowerCase() === "rent");

  // ✅ Label for apartment/society input
  const [apartmentLabel, setApartmentLabel] = useState("");

  // ✅ Placeholders for advantages
  const advantagePlaceholders = [
    "e.g., Near Supermarket or Shopping Mall",
    "e.g., Close to School or College",
    "e.g., Near Hospital or Clinic",
    "e.g., Bus Stop or Metro Station",
    "e.g., Park or Recreation Area",
    "e.g., Restaurant or Food Court",
    "e.g., Highway or Main Road",
    "e.g., Other nearby advantage"
  ];

  useEffect(() => {
    switch (data.propertySubtype) {
      case "Flat/Apartment":
        setApartmentLabel("Apartment Name");
        break;
      case "IndependentHouse/Villa":
      case "Independent House / Villa":
        setApartmentLabel("Society / Villa Name");
        break;
      default:
        setApartmentLabel("");
        break;
    }
  }, [data.propertySubtype]);

  // ✅ Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await ApiService.get("/city", {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!isEditMode && !city) {
          const defaultCity = res.find(
            (c) => c.city.toLowerCase() === "visakhapatnam"
          );
  
          if (defaultCity) {
            setCity(defaultCity.city);          // store city name
            setLocalities(defaultCity.locality);
          }
        }
  
        setCities(res);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (city && cities.length > 0) {
      const selectedCity = cities.find(
        (c) => c.city.toLowerCase() === city.toLowerCase()
      );
  
      if (selectedCity) {
        setLocalities(selectedCity.locality);
  
        // ⭐ If locality is empty, DO NOT reset it — just leave it empty.
        // ⭐ Only clear locality if it was previously selected and now invalid.
        if (locality && !selectedCity.locality.includes(locality)) {
          setLocality("");
        }
      }
    }
  }, [city, cities]);
  

  // ✅ Prefill data in edit mode (once cities are loaded)
  useEffect(() => {
    if (isEditMode && data.address && cities.length > 0) {
      setCity(data.address.city || "");
      setLocality(data.address.locality || "");
      setSubLocality(data.address.subLocality || "");
      setApartmentDoorNo(data.address.apartmentDoorNo || "");
      setRoadFacing(data.address.road_facing || "");
      setPincode(data.address.pincode || "");
      setLat(data.address.lat || "");
      setLon(data.address.lon || "");
      setAdvantages(
        data.address.near_by?.length
          ? data.address.near_by
          : [{ info: "", distance: "250 meters" }]
      );

      const selectedCity = cities.find(
        (c) => c.city.toLowerCase() === (data.address.city || "").toLowerCase()
      );
      setLocalities(selectedCity ? selectedCity.locality : []);
    }
  }, [isEditMode, data, cities]);

  // ✅ Update parent when city/locality changes
  useEffect(() => {
    if (!city && !locality) return;
    updateData({
      address: {
        ...data.address,
        city,
        locality,
        subLocality
      },
    });
  }, [city, locality]);

  // ✅ Validate form
  const validateForm = () => {
    const newErrors = {
      propertyName: "",
      roadFacing: ""
    };

    // Validate project name if required
    if (isProjectNameRequired) {
      if (!propertyName.trim()) {
        newErrors.propertyName = "Project name is required";
      } else if (propertyName.trim().length < 10) {
        newErrors.propertyName = "Project name must be at least 10 characters";
      } else if (propertyName.trim().length > 50) {
        newErrors.propertyName = "Project name cannot exceed 50 characters";
      }
    }

    // Validate road facing
    if (!roadFacing) {
      newErrors.roadFacing = "Road facing is required";
    } else if (parseInt(roadFacing) <= 0) {
      newErrors.roadFacing = "Road facing must be greater than 0";
    }

    setErrors(newErrors);
    return !newErrors.propertyName && !newErrors.roadFacing;
  };

  // ✅ Handlers
  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }

    updateData({
      address: {
        city,
        locality,
        subLocality: subLocality,
        apartmentDoorNo: isLand ? "" : apartmentDoorNo,
        road_facing: roadFacing,
        pincode,
        lat,
        lon,
        near_by: advantages,
      },
      propertyName: propertyName,
    });
    onNext();
  };

  const handleAdvantageChange = (index, key, value) => {
    const updated = [...advantages];
    updated[index][key] = value;
    setAdvantages(updated);
  };

  const handleAddMore = () => {
    if (advantages.length < 8) {
      setAdvantages([...advantages, { info: "", distance: "250 m" }]);
    }
  };

  const handleRemove = (index) => {
    const updated = advantages.filter((_, i) => i !== index);
    setAdvantages(updated);
  };

  // ✅ Handle property name change with 50 character limit
  const handlePropertyNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setPropertyName(value);
      // Clear error when user starts typing
      if (errors.propertyName) {
        setErrors(prev => ({ ...prev, propertyName: "" }));
      }
    }
  };

  // ✅ Handle road facing change
  const handleRoadFacingChange = (e) => {
    const value = e.target.value;
    setRoadFacing(value);
    // Clear error when user starts typing
    if (errors.roadFacing) {
      setErrors(prev => ({ ...prev, roadFacing: "" }));
    }
  };

  // ✅ Check if can add more advantages
  const canAddMore = advantages.length < 8;

  // ✅ Check if continue button should be enabled
  const isContinueEnabled = city && locality && 
    (!isProjectNameRequired || (propertyName.trim().length >= 10 && propertyName.trim().length <= 50)) && 
    roadFacing && parseInt(roadFacing) > 0;

  // ✅ Render
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-bold text-blue-900 mb-2">
          {isEditMode ? "Edit Property Location" : "Where is your property located?"}
        </h2>
        <p className="font-roboto text-gray-600">
          Accurate location details help you reach the right buyers.
        </p>
      </div>

      {isProjectNameRequired && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-roboto text-sm font-medium text-gray-700">
              Project Name <span className="text-red-500">*</span>
            </label>
            <span className={`text-xs ${propertyName.length >= 50 ? 'text-red-500' : propertyName.length >= 10 ? 'text-green-500' : 'text-gray-500'}`}>
              {propertyName.length}/50 {propertyName.length >= 10 && '(Minimum 10)'}
            </span>
          </div>
          <input
            type="text"
            value={propertyName}
            onChange={handlePropertyNameChange}
            placeholder="e.g., D-201, property name"
            className={`w-full px-4 text-gray-600  text-gray-600 py-3 border rounded-lg
                 focus:ring-2 focus:ring-orange-500 focus:border-transparent
                 outline-none font-roboto ${
                   errors.propertyName ? 'border-red-500' : 'border-gray-300'
                 }`}
            maxLength={50}
          />
          {errors.propertyName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.propertyName}
            </p>
          )}
          {!errors.propertyName && propertyName.length > 0 && propertyName.length < 10 && (
            <p className="text-yellow-500 text-xs mt-1">
              Minimum 10 characters required ({10 - propertyName.length} more needed)
            </p>
          )}
          {!errors.propertyName && propertyName.length >= 10 && (
            <p className="text-green-500 text-xs mt-1">
              ✓ Project name meets requirements
            </p>
          )}
        </div>
      )}

      {/* 🏙️ City Dropdown */}
      <div>
        <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
          City <span className="text-red-500">*</span>
        </label>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading cities...</p>
        ) : (
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 text-gray-600 py-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-orange-500 focus:border-transparent
                     outline-none font-roboto bg-white"
          >
            <option value="">Select a City</option>
            {cities?.map((c) => (
              <option key={c.id} value={c.city}>
                {c.city}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 📍 Locality */}
      <div>
        <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
          Locality <span className="text-red-500">*</span>
        </label>
        <select
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          disabled={!city}
          className={`w-full px-4 text-gray-600 py-3 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-orange-500 focus:border-transparent
                   outline-none font-roboto bg-white ${!city ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          <option value="">
            {city ? "Select a Locality" : "Select a City first"}
          </option>
          {localities?.map((loc, index) => (
            <option key={index} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* 🏘️ Sub Locality */}
      <div>
        <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
          {isLand ? "Village" : "Sub Locality"}
        </label>
        <input
          type="text"
          value={subLocality}
          onChange={(e) => setSubLocality(e.target.value)}
          placeholder="e.g., Sector 5"
          className="w-full px-4 text-gray-600 py-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-orange-500 focus:border-transparent
                     outline-none font-roboto"
        />
      </div>

      {/* 🏢 Apartment / Society */}
      {!isLand && apartmentLabel && (
        <div>
          <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
            {apartmentLabel}
          </label>
          <input
            type="text"
            value={apartmentDoorNo}
            onChange={(e) => setApartmentDoorNo(e.target.value)}
            placeholder="e.g., D-201, apartment/society name"
            className="w-full px-4 text-gray-600 py-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-orange-500 focus:border-transparent
                       outline-none font-roboto"
          />
        </div>
      )}

      {/* 🚗 Road Facing */}
      <div>
        <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
          Road Facing <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={roadFacing}
          onChange={handleRoadFacingChange}
          placeholder="100 ft"
          className={`w-full px-4 text-gray-600 py-3 border rounded-lg
               focus:ring-2 focus:ring-orange-500 focus:border-transparent
               outline-none font-roboto ${
                 errors.roadFacing ? 'border-red-500' : 'border-gray-300'
               }`}
          min="1"
        />
        {errors.roadFacing && (
          <p className="text-red-500 text-xs mt-1">
            {errors.roadFacing}
          </p>
        )}
        {!errors.roadFacing && roadFacing && (
          <p className="text-green-500 text-xs mt-1">
            ✓ Road facing entered
          </p>
        )}
      </div>

      {/* 🌍 Coordinates */}
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        <div className="flex-1">
          <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
            Latitude (Location)
          </label>
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="e.g., 17.6868"
            className="w-full px-4 text-gray-600 py-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-orange-500 focus:border-transparent
                       outline-none font-roboto"
          />
        </div>
        <div className="flex-1">
          <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
            Longitude (Location)
          </label>
          <input
            type="text"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            placeholder="e.g., 83.2185"
            className="w-full px-4 text-gray-600 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-roboto"
          />
        </div>
      </div>

      {/* 🏫 Location Advantages */}
      <div className="pt-10 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-serif text-2xl font-bold text-blue-900">
            Location Advantages
          </h2>
          <span className={`text-sm ${advantages.length >= 8 ? 'text-red-500' : 'text-gray-500'}`}>
            {advantages.length}/8 advantages
          </span>
        </div>
        <p className="font-roboto text-gray-600 mb-6">
          Add nearby landmarks and distances (Maximum 8 advantages)
        </p>

        {Array.isArray(advantages) && advantages.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-4"
          >
            <input
              type="text"
              value={item.info}
              onChange={(e) => handleAdvantageChange(index, "info", e.target.value)}
              placeholder={advantagePlaceholders[index] || "e.g., Nearby location advantage"}
              className="flex-1 px-4 text-gray-600 py-3 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-2 sm:mb-0
                         outline-none font-roboto"
            />
            <select
              value={item.distance}
              onChange={(e) => handleAdvantageChange(index, "distance", e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg text-gray-600 
                         focus:ring-2 focus:ring-orange-500 focus:border-transparent
                         outline-none font-roboto"
            >
              <option value="250 m">250 meters</option>
              <option value="500 m">500 meters</option>
              <option value="1 km">1 km</option>
              <option value="2 km">2 km</option>
              <option value="2 km">3 km</option>
              <option value="2 km">4 km</option>
              <option value="5 km">5 km</option>
            </select>
            {advantages.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="bg-red-600 hover:bg-red-500 text-white font-medium px-4 py-3 rounded-lg 
                           ml-0 sm:ml-2 mt-2 sm:mt-0 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {canAddMore ? (
          <button
            type="button"
            onClick={handleAddMore}
            className="text-blue-900 font-medium mt-4 border border-blue-900 px-6 py-2 rounded-lg 
                       hover:bg-blue-900 hover:text-white transition-colors"
          >
            + Add More Advantage
          </button>
        ) : (
          <p className="text-red-500 text-sm mt-4">
            Maximum 8 advantages reached. You cannot add more.
          </p>
        )}
      </div>

      {/* Continue Button */}
      <div className="pt-8">
        <button
          onClick={handleContinue}
          disabled={!isContinueEnabled}
          className="bg-blue-900 hover:bg-blue-800 text-white font-roboto font-medium
                     px-10 py-3 rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEditMode ? "Save & Continue" : "Continue"}
        </button>
      </div>
    </div>
  );
};
 
export default LocationDetails;