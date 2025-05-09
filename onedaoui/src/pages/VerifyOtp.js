import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { main_url } from "../config/config";

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
   const navigate = useNavigate();


  useEffect(() => {
    const storedEmail = sessionStorage.getItem("signupEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleVerify = async () => {
    if (!otp) {
        setError("Please enter the OTP");
        return;
    }
    //handle verification logic here
      try {
      const res = await fetch(main_url +"api/auth/verify_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,otp }),
      });
      const data = await res.json();
      if (res.ok) {
        // Store email in session storage
        navigate("/login"); // Redirect to login page
      } else {
        setError(data.message || "Signup failed"); // Set error message
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred"); // Set error message
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        {/* Left Side (Background Image) */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-900 to-purple-900 rounded-l-xl hidden md:flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Verify your email</h2>
            <p className="text-lg">
              Enter the OTP from your registered email id
            </p>
          </div>
        </div>

        {/* Right Side (Verify OTP Form) */}
        <div className="md:w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Verify OTP
          </h2>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                EMAIL ID
              </label>
              <input
                id="email"
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
              />
            </div>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP
              </label>
              <div className="flex gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={otp[index] || ""}
                    onChange={(e) => {
                      const newOtp = otp.split("");
                      newOtp[index] = e.target.value;
                      setOtp(newOtp.join(""));
                    }}
                    className="w-10 h-10 text-center text-xl font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                  />
                ))}
              </div>
                {error && (
                    <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                )}
            </div>
            <button
              type="button"
              onClick={handleVerify}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Proceed
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

