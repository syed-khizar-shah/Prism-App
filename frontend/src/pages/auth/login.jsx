// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../../context/AuthContext";
// import FormError from "../../components/auth/form-error";
// import FormSuccess from "../../components/auth/form-success";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [success, setSuccess] = useState("");
//   const [localError, setLocalError] = useState("");
//   const { login, error: authError } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLocalError("");
//     setSuccess("");

//     try {
//       const result = await login(email, password);
//       if (result) {
//         setSuccess("Login successful!");
//         navigate("/", { replace: true });
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setLocalError(error?.response?.data?.error || "Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="bg-gray-100 shadow-md rounded-lg p-8 w-full max-w-md">
//         <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>

//         {localError && <FormError message={localError} />}
//         {success && <FormSuccess message={success} />}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
//               placeholder="you@example.com"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
//           >
//             Login
//           </button>
//         </form>

//         {/* <p className="text-sm text-gray-500 mt-4 text-center">
//           Don't have an account? <a href="/register" className="text-black font-medium hover:underline">Sign up</a>
//         </p> */}
//       </div>
//     </div>
//   );
// };

// export default Login;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import FormError from "../../components/auth/form-error";
import FormSuccess from "../../components/auth/form-success";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [localError, setLocalError] = useState("");
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccess("");

    try {
      const result = await login(email, password);
      if (result) {
        setSuccess("Login successful!");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      setLocalError(error?.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-50 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>

        {localError && <FormError message={localError} />}
        {success && <FormSuccess message={success} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
          >
            Login
          </button>
        </form>

        {/* <p className="text-sm text-gray-500 mt-4 text-center">
          Don't have an account? <a href="/register" className="text-black font-medium hover:underline">Sign up</a>
        </p> */}
      </div>
    </div>
  );
};

export default Login;