import React from "react";

const ThankYouModel = ({ open, onClose, name }) => {
  if (!open) return null; // Don’t render when closed

  return (
    <div className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Thank You!</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-center py-4">
            <h4 className="text-dark mb-3">Hi {name || "there"} 👋</h4>
            <p className="text-muted">
              Thank you for your callback enquiry! <br />
              Our team will contact you very soon.
            </p>
            <div className="mt-4">
              <button className="btn btn-primary px-4" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouModel;
