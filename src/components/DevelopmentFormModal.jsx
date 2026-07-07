'use client';

import { useState,useEffect } from 'react';
import { X, Image as ImageIcon, Trash2 } from 'lucide-react';
import ApiService from '../hooks/ApiService';

const DevelopmentFormModal = ({ isOpen, onClose, property }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    city: '',
    location: '',
    propertyType: '',
    message: ''
  });

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getCategory = async () => {
    try {
      const clientToken = localStorage.getItem('token');

      const response = await ApiService.get('/categories', {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response?.categories) {
        setCategories(response.categories);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    getCategory();
  }, [])

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  // Remove a selected image
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      location: formData.location,
      city: formData.city,
      propertyType: formData.propertyType,
      message: formData.message,
      leadType: "developmentInquiry", // or "inquiry" / "callback" etc.
    }
    try {
      const response = await ApiService.post("/leads", payload, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response) {
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          city: "",
          propertyType: "",
          message: "",
          location: "",
        });

       onClose();
      } else {
        console.log("❌ Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="bg-orange-500 text-white p-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold">Development Inquiry</h2>
            {property && (
              <p className="text-orange-100 text-sm mt-1">{property.title}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-orange-600 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Name <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email <span className="text-orange-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Phone Number <span className="text-orange-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Enter your phone number"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              City <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Enter city"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Location <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Enter location/area"
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Property Type <span className="text-orange-500">*</span>
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            >
              <option value="">Select property type</option>
              <option value="Land">Lands</option>
              <option value="plot">Plots</option>
              {/* {categories.map((item => {
                return(
                  <option value={item.name}>{item.name} - {item.catType}</option>
               ) }))} */}

              {/* <option value="Land">Land</option> */}
            </select>
          </div>

          <div>
              <label className="block text-gray-700 font-medium mb-2">
              Message <span className="text-orange-500">*</span>
              </label>
              <textarea
                type="text"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full text-gray-800  border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Enter preferred location"
              />
            </div>

          {/* Submit Button */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Submit Development Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DevelopmentFormModal;
