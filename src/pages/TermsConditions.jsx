const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Terms & Conditions
        </h1>

        <p className="text-gray-600 mb-6 leading-8">
          By using VMRDA Plots website and mobile app,
          you agree to these terms and conditions.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              Use of Services
            </h2>

            <p className="text-gray-700 leading-8">
              Users may browse properties and submit inquiries
              through our platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              User Responsibilities
            </h2>

            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate information</li>
              <li>Do not misuse the platform</li>
              <li>Follow applicable laws</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              Property Information
            </h2>

            <p className="text-gray-700 leading-8">
              We try to provide accurate property information,
              but we do not guarantee completeness.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              Account Suspension
            </h2>

            <p className="text-gray-700 leading-8">
              We reserve the right to suspend accounts
              violating our policies.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              Contact
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

export default TermsConditions;