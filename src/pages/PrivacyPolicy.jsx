const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Privacy Policy
        </h1>

        <p className="text-gray-600 mb-6 leading-8">
          Welcome to VMRDA Plots. Your privacy is important to us.
          This Privacy Policy explains how we collect, use,
          and protect your information.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              Information We Collect
            </h2>

            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Location Information</li>
              <li>Property Inquiry Details</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              How We Use Information
            </h2>

            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>To provide real estate services</li>
              <li>To contact users regarding inquiries</li>
              <li>To improve app and website performance</li>
              <li>To provide customer support</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              Third Party Services
            </h2>

            <p className="text-gray-700 leading-8">
              We may use Google Maps, Firebase,
              and Analytics services inside the application.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              Data Security
            </h2>

            <p className="text-gray-700 leading-8">
              We take proper security measures to protect user data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              Contact Us
            </h2>

            <p className="text-gray-700">
              Email: support@vmrdaplots.com
            </p>

            <p className="text-gray-700">
              Phone: +91 9876543210
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;