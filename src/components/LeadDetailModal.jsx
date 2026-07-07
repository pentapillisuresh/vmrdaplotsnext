import { Mail, Phone, User, MapPin, Check, X } from "lucide-react";
import { useState } from "react";

const LeadDetailModal = ({ lead, onClose, getStatusBadge, getPriorityBadge, onUpdateStatus }) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(lead?.status || "new");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  if (!lead) return null;

  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-700" },
    { value: "site visit", label: "Site Visit", color: "bg-purple-100 text-purple-700" },
    { value: "contacted", label: "Contacted", color: "bg-amber-100 text-amber-700" },
    { value: "closing", label: "Closing", color: "bg-green-100 text-green-700" },
    { value: "notinterest", label: "Not Interested", color: "bg-red-100 text-red-700" }
  ];

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === selectedStatus) {
      setShowStatusDropdown(false);
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      await onUpdateStatus(lead.id, newStatus);
      setSelectedStatus(newStatus);
      setShowStatusDropdown(false);
    } catch (error) {
      setUpdateError(error.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusText = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-700";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Customer Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-semibold text-gray-900">{lead.customerName || lead.name || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">{lead.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-900">{lead.phoneNumber || lead.phone || "N/A"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Message */}
          {(lead.message || lead.customerMessage) && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Customer Message
              </h3>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-gray-700">{lead.message || lead.customerMessage}</p>
              </div>
            </section>
          )}

          {/* Lead Details */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Lead Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  disabled={isUpdating}
                  className="w-full text-left focus:outline-none"
                >
                  <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-2 ${getStatusColor(selectedStatus)}`}>
                    {getStatusText(selectedStatus)}
                    {!isUpdating && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    {isUpdating && (
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent"></div>
                    )}
                  </div>
                </button>
                
                {showStatusDropdown && !isUpdating && (
                  <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusUpdate(option.value)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                          selectedStatus === option.value ? 'bg-gray-50' : ''
                        }`}
                      >
                        <span className={option.color.split(' ')[1]}>
                          {option.label}
                        </span>
                        {selectedStatus === option.value && (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Priority</p>
                {getPriorityBadge(lead.priority)}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Lead Type</p>
                <p className="font-semibold text-gray-900">
                  {lead.leadType || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Property</p>
                <p className="font-semibold text-gray-900">
                  {lead.property?.title || lead.propertyId || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Created At</p>
                <p className="font-semibold text-gray-900">
                  {new Date(lead.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Updated At</p>
                <p className="font-semibold text-gray-900">
                  {new Date(lead.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
            
            {updateError && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600">{updateError}</p>
              </div>
            )}
          </section>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {(lead.phoneNumber || lead.phone) && (
              <a
                href={`tel:${lead.phoneNumber || lead.phone}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                <Phone className="w-5 h-5" />
                Call Customer
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                <Mail className="w-5 h-5" />
                Send Email
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;