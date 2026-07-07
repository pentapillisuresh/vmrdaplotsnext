'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ApiService from '../hooks/ApiService';

const BuyFormModal = ({ isOpen, onClose, property }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    investmentBudget: '',
    city: '',
    location: '',
    propertyType: '',
    message: ""
  });

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
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    getCategory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    
    const payload = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      location: formData.location,
      city: formData.city,
      investmentAmount: formData.investmentBudget,
      propertyType: formData.propertyType,
      message: formData.message,
      leadType: "investorInquiry",
    }
    
    try {
      const response = await ApiService.post("/leads", payload, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response) {
        alert("THANK YOU! For your cooperation we will contact you soon");
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          city: "",
          propertyType: "",
          message: "",
          investmentBudget: "",
          location: "",
        });
        onClose();
      } else {
        setStatus("❌ Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      setStatus("⚠️ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-orange-500 text-white p-6 flex justify-between items-center sticky top-0">
          <div>
            <h2 className="text-2xl font-bold">Buy Property</h2>
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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Status Message */}
            {status && (
              <div className={`p-3 rounded-lg ${
                status.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {status}
              </div>
            )}

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
                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="">Select Property Type</option>
                {categories.map((item, index) => (
                  <option key={item.id || index} value={item.name}>
                    {item.name} - {item.catType}
                  </option>
                ))}
              </select>
            </div>

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
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Investment Budget */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Investment Budget <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                name="investmentBudget"
                value={formData.investmentBudget}
                onChange={handleChange}
                required
                className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g., ₹50,00,000"
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
                className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
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
                className="w-full border text-gray-800 border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Enter preferred location"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Message <span className="text-orange-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="3"
                className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Enter your message or specific requirements"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyFormModal;