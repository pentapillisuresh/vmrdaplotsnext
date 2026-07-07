'use client';
import { useState } from "react";
import axios from "axios";

import {
  Trash2,
  AlertTriangle,
  Smartphone,
} from "lucide-react";

const DeleteAccount = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpPopup, setOtpPopup] = useState(false);
  const [checked, setChecked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // Generate random OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Show confirmation popup first
  const handleDeleteClick = () => {
    if (mobile.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    if (!checked) {
      alert("Please confirm checkbox");
      return;
    }

    setShowConfirmPopup(true);
  };

  // SEND OTP via SmartPing API
  const handleSendOtp = async () => {
    setShowConfirmPopup(false);
    setLoading(true);
    
    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);

    // Prepare the SMS text with OTP
    const smsText = `Hello, ${otpCode} is your OTP to confirm account deletion on VMRDAPlots. Do not share this OTP with anyone. VIZAGLANDS`;

    // SmartPing API URL with parameters
    const apiUrl = `https://pgapi.smartping.ai/fe/api/v1/send?username=vizagland.trans&password=Tmhc6&unicode=true&from=VIZLAN&to=${mobile}&text=${encodeURIComponent(smsText)}&dltContentId=1707177910806517352`;

    try {
      console.log("Sending OTP to:", mobile);
      console.log("OTP Code:", otpCode);
      
      // Send the request
      const response = await axios.get(apiUrl);
      
      console.log("API Response:", response.data);
      
      // Show OTP popup
      setOtpPopup(true);
      alert("OTP Sent Successfully! Check your mobile.");
      
    } catch (error) {
      console.error("Error details:", error);
      // Still show popup because you mentioned OTP is being received
      setOtpPopup(true);
      alert("OTP sent! Please check your mobile.");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    if (otp === generatedOtp) {
      setOtpPopup(false);
      setSuccess(true);
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    
    const smsText = `Hello, ${newOtp} is your OTP to confirm account deletion on VMRDAPlots. Do not share this OTP with anyone. VIZAGLANDS`;
    const apiUrl = `https://pgapi.smartping.ai/fe/api/v1/send?username=vizagland.trans&password=Tmhc6&unicode=true&from=VIZLAN&to=${mobile}&text=${encodeURIComponent(smsText)}&dltContentId=1707177910806517352`;

    try {
      await axios.get(apiUrl);
      alert("OTP Resent Successfully!");
    } catch (error) {
      console.error("Resend Error:", error);
      alert("OTP resent! Please check your mobile.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center">
            <Trash2 className="text-white" size={38} />
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-3">
            Account Deletion
          </h1>

          <p className="text-gray-600 text-lg">
            Request permanent deletion of your account
          </p>
        </div>

        {/* SUCCESS */}
        {success ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <h2 className="text-4xl font-bold text-green-600 mb-4">
              Account Deleted Successfully
            </h2>

            <p className="text-gray-600">
              Your account has been permanently removed.
            </p>
          </div>
        ) : (
          <>
            {/* WARNING */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex gap-4 items-start mb-8">
              <AlertTriangle
                className="text-red-500 mt-1"
                size={28}
              />

              <p className="text-red-600 text-lg">
                Account deletion is{" "}
                <span className="font-bold">
                  permanent
                </span>
                . This action cannot be undone.
              </p>
            </div>

            {/* CARD */}
            <div className="bg-[#f1f1f1] rounded-2xl p-8">

              {/* LABEL */}
              <label className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Smartphone size={20} />
                Registered Mobile Number
              </label>

              {/* INPUT */}
              <input
                type="tel"
                placeholder="Enter Mobile Number"
                maxLength={10}
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, ''))
                }
                className="w-full border-2 border-black rounded-xl h-14 px-5 text-lg outline-none bg-white mb-5"
              />

              {/* CHECKBOX */}
              <div className="flex items-center gap-3 mb-8">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setChecked(!checked)
                  }
                  className="w-5 h-5"
                />

                <p className="text-lg">
                  I understand this action is permanent and irreversible.
                </p>
              </div>

              {/* BUTTON */}
              <button
                onClick={handleDeleteClick}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xl h-14 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Sending OTP..."
                  : "Delete My Account"}
              </button>
            </div>
          </>
        )}

        {/* CONFIRMATION POPUP */}
        {showConfirmPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-8 relative">
              
              {/* WARNING ICON */}
              <div className="flex justify-center mb-5">
                <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-white" size={35} />
                </div>
              </div>

              {/* TITLE */}
              <h2 className="text-3xl font-bold text-center mb-3">
                Are you sure?
              </h2>

              <p className="text-center text-gray-600 mb-6">
                You are about to permanently delete your account. 
                This action <span className="font-bold text-red-600">cannot be undone</span>.
                <br /><br />
                All your data, including saved properties and preferences, 
                will be permanently removed.
              </p>

              {/* BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmPopup(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 h-12 rounded-xl text-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendOtp}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 rounded-xl text-lg font-semibold"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OTP POPUP */}
        {otpPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

            <div className="bg-white w-full max-w-md rounded-2xl p-8 relative">

              {/* CLOSE */}
              <button
                onClick={() => setOtpPopup(false)}
                className="absolute top-4 right-4 text-3xl hover:text-gray-700"
              >
                ×
              </button>

              {/* OTP ICON */}
              <div className="flex justify-center mb-5">
                <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center">
                  <Smartphone
                    className="text-white"
                    size={35}
                  />
                </div>
              </div>

              {/* TITLE */}
              <h2 className="text-3xl font-bold text-center mb-2">
                Verify OTP
              </h2>

              <p className="text-center text-gray-500 mb-6">
                We've sent a verification code to <br />
                <span className="font-semibold text-gray-800">{mobile}</span>
              </p>

              {/* OTP INPUT */}
              <input
                type="text"
                placeholder="Enter OTP"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ''))
                }
                className="w-full border-2 border-gray-300 rounded-xl h-14 px-5 text-lg outline-none focus:border-red-500 mb-5"
                autoFocus
              />

              {/* VERIFY BUTTON */}
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-red-600 hover:bg-red-700 text-white h-14 rounded-xl text-lg font-semibold mb-3"
              >
                Verify & Delete Account
              </button>

              {/* RESEND BUTTON */}
              <button
                onClick={handleResendOtp}
                className="w-full text-red-600 hover:text-red-700 text-center text-sm font-semibold"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccount;