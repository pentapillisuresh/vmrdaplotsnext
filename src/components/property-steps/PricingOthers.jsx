'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../hooks/ApiService';
import Swal from 'sweetalert2';
import Confetti from 'react-confetti';

function PricingOthersContent({ data, updateData, isEditMode }) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [approvedBy, setApprovedBy] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const router = useRouter();
  const { user } = useAuth();

  // Add refs to track initial data loading and prevent loops
  const isInitialMount = useRef(true);
  const previousDataRef = useRef(data);
  const updateTimeoutRef = useRef(null);
  const isUpdating = useRef(false);

  const approvedOptions = ['VMRDA', 'VUDA', 'DTCP', 'LRS', 'GVMC', 'RERA', 'Bank Loan'];
  const amenitiesOptions = ['Security','Maintenance Staff','Clubhouse','Park / Garden','Gym / Rooms','children play area','gated community','Swimming Pool','24/7 water service','power service','Wi-Fi','borewall','compound wall','Lift','Power Backup'];

  // Filter amenities based on category
const filteredAmenities = amenitiesOptions.filter((amenity) => {
  // Hide Lift, Wi-Fi, Power Backup for Plot/Land
  if (
    (data.propertySubtype === "Plot") &&
    ["Lift", "Wi-Fi",'Swimming Pool','Gym / Rooms', "Power Backup"].includes(amenity)
  ) {
    return false;
  }
  if (
    (data.propertySubtype === "Land") &&
    ['Security','Maintenance Staff','Clubhouse','Park / Garden','Gym / Rooms','children play area','gated community','Swimming Pool','24/7 water service','power service','Wi-Fi','Lift','Power Backup'].includes(amenity)
  ) {
    return false;
  }

  // Show borewall & compound wall only for Land
  if (
    ["borewall", "compound wall"].includes(amenity) &&
    data.propertySubtype !== "Land"
  ) {
    return false;   
  }

  // Show 24/7 water service & power service only for Flat
  if (
    ["24/7 water service", "power service"].includes(amenity) &&
    data.propertySubtype !== "Flat/Apartment"
  ) {
    return false;
  }

  // Show children's play area & gated community only for Flat and Plot
  if (
    ["children play area", "gated community"].includes(amenity) &&
    !["Flat/Apartment", "Plot"].includes(data.propertySubtype)
  ) {
    return false;
  }

  return true;
});

  // Handle window resize for confetti
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Populate state from data - this runs only when data actually changes
  useEffect(() => {
    // Skip the first mount to avoid unnecessary updates
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Initialize from data on mount
      if (data) {
        setProjectName(data.projectName || '');
        setDescription(data.description || '');
        setPrivateNotes(data.privateNotes || '');

        // Handle approvedBy
        if (data.approvedBy) {
          if (typeof data.approvedBy === 'string') {
            setApprovedBy(data.approvedBy.split(',').map(item => item.trim()).filter(item => item !== '' && item !== 'null'));
          } else if (Array.isArray(data.approvedBy)) {
            setApprovedBy(data.approvedBy);
          }
        }

        // Handle amenities
        if (data.amenities) {
          if (Array.isArray(data.amenities)) {
            setAmenities(data.amenities);
          } else if (typeof data.amenities === 'string') {
            setAmenities(data.amenities.split(',').map(item => item.trim()).filter(item => item !== ''));
          }
        }
      }
      previousDataRef.current = data;
      return;
    }

    // Check if data has actually changed from parent and prevent infinite loops
    const dataChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);

    if (dataChanged && !isUpdating.current) {
      previousDataRef.current = data;

      // Update local state from parent data (for edit mode)
      if (data) {
        setProjectName(data.projectName || '');
        setDescription(data.description || '');
        setPrivateNotes(data.privateNotes || '');

        if (data.approvedBy) {
          if (typeof data.approvedBy === 'string') {
            setApprovedBy(data.approvedBy.split(',').map(item => item.trim()).filter(item => item !== '' && item !== 'null'));
          } else if (Array.isArray(data.approvedBy)) {
            setApprovedBy(data.approvedBy);
          }
        }

        if (data.amenities) {
          if (Array.isArray(data.amenities)) {
            setAmenities(data.amenities);
          } else if (typeof data.amenities === 'string') {
            setAmenities(data.amenities.split(',').map(item => item.trim()).filter(item => item !== ''));
          }
        }
      }
    }
  }, [data]);

  // Update parent data when local state changes - with proper debouncing and loop prevention
  useEffect(() => {
    // Skip update during initial mount
    if (isInitialMount.current) return;

    // Clear previous timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Debounce the update to prevent rapid updates
    updateTimeoutRef.current = setTimeout(() => {
      // Prevent recursive updates
      isUpdating.current = true;

      const updatedData = {
        ...data,
        projectName: projectName || null,
        description: description || null,
        privateNotes: privateNotes || null,
        approvedBy: approvedBy.length ? approvedBy.join(',') : null,
        amenities: amenities.length ? amenities : null,
      };

      // Only update if there are actual changes
      if (JSON.stringify(updatedData) !== JSON.stringify(data)) {
        updateData(updatedData);
      }

      // Reset the updating flag after a short delay
      setTimeout(() => {
        isUpdating.current = false;
      }, 100);
    }, 500);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [projectName, description, privateNotes, JSON.stringify(approvedBy), JSON.stringify(amenities)]);

  const handleApprovedChange = (value) => {
    setApprovedBy(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleAmenitiesChange = (value) => {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    if (validationErrors.description) {
      setValidationErrors(prev => ({ ...prev, description: '' }));
    }
  };

  const handlePrivateNotesChange = (e) => {
    const value = e.target.value;
    setPrivateNotes(value);
  };

  const validateForm = () => {
    const errors = {};

    if (!description || description.trim() === '') {
      errors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enhanced calculateScore function
  const calculateScore = () => {
    let score = 0;
    if (data.catType) score += 10;
    if (data.marketType) score += 10;
    if (data.address && (data.address.city || data.city)) score += 10;
    if (data.amenities && data.amenities.length > 0) score += 10;
    if (data.propertyProfile && Object.keys(data.propertyProfile).length > 0) score += 20;
    if (data.price) score += 10;
    if (data.propertySubtype) score += 20;
    if (description && description.trim().length >= 10) score += 10;
    if (approvedBy && approvedBy.length > 0) score += 5;
    if (privateNotes && privateNotes.trim().length > 0) score += 3;
    if (projectName && projectName.trim().length > 0) score += 2;
    return Math.min(score, 100);
  };

  // Enhanced success popup with confetti
  const showSuccessPopup = () => {
    setShowConfetti(true);

    Swal.fire({
      title: '🎉 Success!',
      html: `
        <div class="text-center">
          <div class="text-4xl mb-4">🎊</div>
          <h3 class="text-xl font-bold text-green-600 mb-2">${isEditMode ? 'Property Updated!' : 'Property Published!'}</h3>
          <p class="text-gray-600 mb-4">Your property has been ${isEditMode ? 'updated' : 'published'} successfully!</p>
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p class="text-sm text-gray-700"><span class="font-semibold">Property Score:</span> ${calculateScore()}%</p>
            <p class="text-sm text-gray-700"><span class="font-semibold">Type:</span> ${data.propertySubtype || 'N/A'}</p>
            <p class="text-sm text-gray-700"><span class="font-semibold">Location:</span> ${data.address?.city || data.city || 'N/A'}</p>
          </div>
        </div>
      `,
      icon: 'success',
      confirmButtonColor: '#1e3a8a',
      confirmButtonText: 'Go to Dashboard',
      showCancelButton: true,
      cancelButtonText: 'Add Another Property',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      setShowConfetti(false);
      if (result.isConfirmed) {
        router.push('/vendor/dashboard');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }
    });

    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  // Enhanced error popup
  const showErrorPopup = (errorMessage) => {
    Swal.fire({
      title: '❌ Error!',
      html: `
        <div class="text-center">
          <div class="text-4xl mb-4">😞</div>
          <div class="text-left bg-red-50 p-4 rounded-lg border border-red-200">
            <p class="text-red-700 font-medium">${errorMessage}</p>
          </div>
        </div>
      `,
      icon: 'error',
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Try Again',
    });
  };

  // Enhanced validation error popup
  const showValidationErrorPopup = () => {
    Swal.fire({
      title: '⚠️ Validation Error',
      text: 'Please fix the validation errors before publishing',
      icon: 'warning',
      confirmButtonColor: '#f59e0b',
      confirmButtonText: 'OK',
    });
  };

  const handleSubmit = async (status) => {
    // if (status === 'published' && !validateForm()) {
    //   showValidationErrorPopup();
    //   return;
    // }

    setLoading(true);
    setError('');
    console.log("isEdit:::", isEditMode)
    try {
      const propertyDataToSave = {
        ...data,
        projectName: projectName || null,
        description: description || null,
        privateNotes: privateNotes || null,
        approvedBy: approvedBy.length ? approvedBy.join(',') : null,
        amenities,
      };

      updateData(propertyDataToSave);

      const clientToken = localStorage.getItem('token');
      let response;
      console.log("propertyDataToSave:::", data.id)
      if (isEditMode && data?.id) {
        response = await ApiService.put(`/properties/${data.id}`, propertyDataToSave, {
          headers: {
            Authorization: `Bearer ${clientToken}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        response = await ApiService.post('/properties', propertyDataToSave, {
          headers: {
            Authorization: `Bearer ${clientToken}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (response) {
        setSuccess(true);
        showSuccessPopup();
      } else {
        const errorMsg = response?.message || 'Something went wrong while saving the property';
        setError(errorMsg);
        showErrorPopup(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || 'Network error occurred. Please try again.';
      setError(errorMsg);
      showErrorPopup(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const isPublishDisabled = loading || !description || description.trim().length < 10;

  return (
    <div className="space-y-8 relative min-h-screen">
      {/* Confetti Animation */}
      {showConfetti && typeof window !== 'undefined' && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#1e3a8a', '#3b82f6', '#f59e0b', '#dc2626', '#8b5cf6']}
          recycle={false}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        />
      )}

      {/* Header */}
      <div className="text-center">
        <h2 className="font-serif text-3xl font-bold text-blue-900 mb-2">
          Amenities and Other Details
        </h2>
        <p className="font-roboto text-gray-600">
          Set your amenities and add additional details
        </p>

        {/* Progress Score */}
        <div className="mt-6 inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full border border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">{calculateScore()}%</span>
            </div>
            <span className="text-blue-800 font-medium">Property Completion Score</span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-roboto text-sm">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Description */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-roboto text-sm font-medium text-gray-700">
              Property Description <span className="text-red-500">*</span>
            </label>
            <span className={`text-xs ${description.length > 0 && description.length < 10 ? 'text-red-500' :
                description.length >= 10 ? 'text-green-500' : 'text-gray-500'
              }`}>
              {description.length}/10+ characters
            </span>
          </div>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Describe your property (minimum 10 characters)..."
            rows="5"
            className={`w-full px-4 text-gray-600 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-roboto resize-none ${validationErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {validationErrors.description && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>
          )}
          {description.length > 0 && description.length < 10 && (
            <p className="text-orange-500 text-xs mt-1">
              Minimum 10 characters required ({10 - description.length} more needed)
            </p>
          )}
          {description.length >= 10 && (
            <p className="text-green-500 text-xs mt-1">
              ✓ Description meets requirements
            </p>
          )}
        </div>

        {/* Private Notes */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-roboto text-sm font-medium text-gray-700">
              Private Notes
            </label>
            <span className="text-xs text-gray-500">
              {privateNotes.length}/100 characters
            </span>
          </div>
          <textarea
            value={privateNotes}
            onChange={handlePrivateNotesChange}
            placeholder="Enter private notes (visible only to owner) - Optional"
            rows="3"
            className="w-full px-4 text-gray-600 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-roboto resize-none"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            Private notes are only visible to owner. They won't appear on the frontend. This field is optional.
          </p>
        </div>
      </div>

      {/* Conditional: Approved By & Amenities */}
      {((data.propertySubtype === 'Flat/Apartment' ||
        data.propertySubtype === 'Plot' ||
        data.propertySubtype === 'Land' ||
        data.propertySubtype === 'Independent House / Villa') &&
        data.marketType?.toLowerCase() === "sale")
        && (
          <div className="space-y-6 mt-8">
            {/* Approved By */}
            <div>
              <h3 className="font-serif text-xl font-semibold text-blue-900 mb-3">Approved By</h3>
              <div className="flex flex-wrap gap-3">
                {approvedOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleApprovedChange(opt)}
                    className={`px-4 py-2.5 rounded-full border-2 transition-all ${approvedBy.includes(opt)
                        ? 'bg-blue-900 border-blue-900 text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300'
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-serif text-xl font-semibold text-blue-900 mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {filteredAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={amenities.includes(amenity)}
                      onChange={() => handleAmenitiesChange(amenity)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="hover:text-blue-700">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

      {/* Property Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-10">
        <h3 className="font-serif text-lg font-bold text-blue-900 mb-4">Property Summary</h3>
        <div className="grid grid-cols-2 gap-4 font-roboto text-sm">
          <div>
            <span className="text-gray-600">Type:</span>
            <span className="ml-2 font-medium text-gray-900">{data.propertySubtype || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-600">Location:</span>
            <span className="ml-2 font-medium text-gray-900">{data.address?.city || data.city || 'N/A'}</span>
          </div>

          {(data.propertySubtype === 'Plot' || data.propertySubtype === 'Flat/Apartment') && (
            <>
              <div>
                <span className="text-gray-600">Approved By:</span>
                <span className="ml-2 font-medium text-gray-900">{approvedBy.join(', ') || 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Amenities:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {amenities.join(', ') || 'N/A'}
                </span>
              </div>
            </>
          )}

          <div>
            <span className="text-gray-600">Property Score:</span>
            <span className="ml-2 font-medium text-orange-500">{calculateScore()}%</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => handleSubmit('published')}
          disabled={isPublishDisabled}
          className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-roboto font-medium px-8 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publishing...
            </span>
          ) : (
            isEditMode ? 'Update Property' : 'Publish Property'
          )}
        </button>
      </div>

      {/* Mandatory fields note */}
      <div className="text-xs text-gray-500 text-center mt-4">
        <span className="text-red-500">*</span> indicates mandatory fields
      </div>
    </div>
  );
}

// Wrap with Suspense for App Router
export default function PricingOthers(props) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    }>
      <PricingOthersContent {...props} />
    </Suspense>
  );
}