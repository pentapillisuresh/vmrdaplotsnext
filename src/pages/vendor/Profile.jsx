'use client';

import { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Loader, Building, Save, Camera, Lock, Bell, IdCard, FileText, Edit, X, Eye, EyeOff, MapPin, Briefcase, Award, Shield, CheckCircle } from 'lucide-react';
import ApiService from '../../hooks/ApiService';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    address: '',
    bio: '',
    profilePic: '',
    area: '',
    kycProofName: 'ADHAR',
    kycProofNumber: '',
    kycUploadFile: '',
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  const [originalData, setOriginalData] = useState({ ...profileData });
  const [passwordErrors, setPasswordErrors] = useState({});

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    const clientToken = localStorage.getItem('token');
    const clientDetails = localStorage.getItem('clientDetails');
    
    if (!clientDetails) {
      setLoading(false);
      return;
    }
    
    const clientData = JSON.parse(clientDetails);

    const fetchClientData = async () => {
      try {
        const res = await ApiService.get(`/clients/getClient/${clientData.id}`, {
          headers: {
            Authorization: `Bearer ${clientToken}`,
            "Content-Type": "application/json"
          }
        });
        setProfileData(res.client || {});
        setOriginalData(res.client || {});
      } catch (error) {
        console.error("Error fetching client:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  // 🟣 Handle File Upload to Image API
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const clientToken = localStorage.getItem('token');

    try {
      const res = await ApiService.post("/images/upload", formData, {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
      return res.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed");
      return null;
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value || '' }));
  };

  const handleFileUpload = async (field, file) => {
    if (file) {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        setProfileData((prev) => ({
          ...prev,
          [field]: uploadedUrl || prev[field],
        }));
      }
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setProfileData({ ...originalData });
    } else {
      setOriginalData({ ...profileData });
    }
    setIsEditing(!isEditing);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const clientDetails = localStorage.getItem('clientDetails');
    const clientData = JSON.parse(clientDetails);
    const clientToken = localStorage.getItem('token');

    try {
      const res = await ApiService.put(`/clients/${clientData.id}`,
        profileData, {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          "Content-Type": "application/json"
        }
      });
      setSaveSuccess(true);
      setProfileData(res.client);
      setOriginalData(res.client);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // 🔐 Validate Password
  const validatePassword = () => {
    const errors = {};
    if (passwords.newPass.length < 8) {
      errors.newPass = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(passwords.newPass)) {
      errors.newPass = "Must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(passwords.newPass)) {
      errors.newPass = "Must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(passwords.newPass)) {
      errors.newPass = "Must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwords.newPass)) {
      errors.newPass = "Must contain at least one special character";
    }
    
    if (passwords.newPass !== passwords.confirm) {
      errors.confirm = "Passwords do not match";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async () => {
    if (!validatePassword()) {
      return;
    }
    
    const clientToken = localStorage.getItem('token');
    const clientDetails = localStorage.getItem('clientDetails');
    const clientData = JSON.parse(clientDetails);
    
    try {
      await ApiService.put(`/clients/${clientData.id}/update-password`,
        passwords, {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Password updated successfully!");
      setPasswords({ current: "", newPass: "", confirm: "" });
      setPasswordErrors({});
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Password update failed");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraInput = () => {
    cameraInputRef.current?.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload('profilePic', file);
    }
  };

  const handleCameraCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload('profilePic', file);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1 font-roboto">
              Manage your account settings and preferences
            </p>
          </div>
          {activeTab === 'profile' && (
            <button
              onClick={handleEditToggle}
              className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                isEditing
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-200'
              }`}
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          )}
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">Profile updated successfully!</span>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Tabs - Premium Design */}
          <div className="border-b border-gray-200 bg-gray-50/50">
            <div className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-300 relative ${
                  activeTab === 'profile'
                    ? 'text-orange-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5 inline-block mr-2" />
                Profile Info
                {activeTab === 'profile' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-300"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-300 relative ${
                  activeTab === 'security'
                    ? 'text-orange-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Lock className="w-5 h-5 inline-block mr-2" />
                Security
                {activeTab === 'security' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-300"></div>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Profile Picture - Premium */}
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-gray-200">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-200 shadow-xl">
                      <img
                        src={profileData.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <div className="absolute -bottom-2 -right-2 flex gap-1">
                        <button
                          onClick={triggerFileInput}
                          className="bg-orange-500 text-white p-2.5 rounded-full hover:bg-orange-600 transition-all shadow-lg hover:scale-110"
                          title="Upload from device"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={triggerCameraInput}
                          className="bg-green-500 text-white p-2.5 rounded-full hover:bg-green-600 transition-all shadow-lg hover:scale-110"
                          title="Take photo"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 capitalize">
                      {profileData.fullName || 'User Name'}
                    </h3>
                    <p className="text-gray-600 font-roboto">{profileData.companyName || 'No company'}</p>
                    {isEditing && (
                      <p className="text-sm text-orange-500 mt-2 flex items-center justify-center sm:justify-start gap-2">
                        <Camera className="w-4 h-4" />
                        Click icons to upload or take a photo
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={cameraInputRef}
                    onChange={handleCameraCapture}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                  />
                </div>

                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder='Full Name'
                        value={profileData.fullName || ''}
                        disabled={true}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        placeholder='Email'
                        value={profileData.email || ''}
                        disabled={true}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        placeholder='Phone Number'
                        value={profileData.phoneNumber || ''}
                        disabled={true}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder='Company Name'
                        value={profileData.companyName || ''}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                          !isEditing 
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                            : 'border-gray-300 bg-white hover:border-orange-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline-block mr-1 text-orange-500" />
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder='Enter your address'
                    value={profileData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                      !isEditing 
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                        : 'border-gray-300 bg-white hover:border-orange-300'
                    }`}
                  />
                </div>

                {/* KYC Verification */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-serif font-bold text-gray-900">KYC Verification</h3>
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      Verified
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <IdCard className="w-4 h-4 inline-block mr-1" />
                        Aadhaar Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={12}
                          disabled={true}
                          value={profileData.kycProofNumber || ''}
                          placeholder="Enter your Aadhaar number"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aadhaar Proof
                      </label>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileUpload('kycUploadFile', e.target.files[0])}
                        disabled={!isEditing}
                        className={`block w-full text-sm text-gray-700 border rounded-xl cursor-pointer focus:ring-2 focus:ring-orange-500 focus:border-transparent p-2 ${
                          !isEditing ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'border-gray-300 bg-white'
                        }`}
                      />
                      {profileData.kycUploadFile && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-1">Current Document:</p>
                          {profileData.kycUploadFile.match(/\.(jpeg|jpg|gif|png)$/) ? (
                            <img
                              src={profileData.kycUploadFile}
                              alt="Aadhaar Proof"
                              className="w-32 h-20 object-cover border rounded-lg shadow-md"
                            />
                          ) : (
                            <a
                              href={profileData.kycUploadFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 underline text-sm font-medium"
                            >
                              View Uploaded Document
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Deal With Areas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4 inline-block mr-1 text-orange-500" />
                    Deal With Areas
                  </label>
                  <input
                    value={profileData.area || ''}
                    placeholder='Enter areas you deal with (comma separated)'
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                      !isEditing 
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                        : 'border-gray-300 bg-white hover:border-orange-300'
                    }`}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Award className="w-4 h-4 inline-block mr-1 text-orange-500" />
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio || ''}
                    placeholder='Tell about yourself'
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none transition-all ${
                      !isEditing 
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                        : 'border-gray-300 bg-white hover:border-orange-300'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Security Tab - Premium */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Lock className="w-6 h-6 text-orange-500" />
                    <h3 className="text-2xl font-serif font-bold text-gray-900">
                      Change Password
                    </h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwords.current}
                        onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all hover:border-orange-300"
                        placeholder="Enter current password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwords.newPass}
                        onChange={(e) => {
                          setPasswords((p) => ({ ...p, newPass: e.target.value }));
                          setPasswordErrors({});
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all hover:border-orange-300 ${
                          passwordErrors.newPass ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter new password"
                      />
                      {passwordErrors.newPass && (
                        <p className="text-red-500 text-sm mt-1">{passwordErrors.newPass}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={passwords.confirm}
                          onChange={(e) => {
                            setPasswords((prev) => ({ ...prev, confirm: e.target.value }));
                            setPasswordErrors({});
                          }}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none pr-12 transition-all hover:border-orange-300 ${
                            passwordErrors.confirm ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Re-enter your new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showConfirm ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                        </button>
                      </div>
                      {passwordErrors.confirm && (
                        <p className="text-red-500 text-sm mt-1">{passwordErrors.confirm}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <h4 className="font-serif font-bold text-gray-900">
                      Password Requirements:
                    </h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-2 font-roboto">
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${passwords.newPass.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      At least 8 characters long
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(passwords.newPass) && /[a-z]/.test(passwords.newPass) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      Contains uppercase and lowercase letters
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(passwords.newPass) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      Includes at least one number
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(passwords.newPass) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      Contains at least one special character
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              {activeTab === 'profile' && isEditing && (
                <button 
                  onClick={handleEditToggle}
                  className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
              )}
              {activeTab === 'profile' && !isEditing && (
                <div></div>
              )}
              {activeTab === 'security' && (
                <div></div>
              )}
              
              <button
                onClick={activeTab === 'security' ? handlePasswordChange : handleSave}
                disabled={
                  isSaving ||
                  (activeTab === 'profile' && !isEditing)
                }
                className={`w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:shadow-xl transform hover:scale-105 ${
                  isSaving || (activeTab === 'profile' && !isEditing) ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : activeTab === 'security' ? (
                  <>
                    <Lock className="w-5 h-5" />
                    Update Password
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;