// import React, { useState, useEffect } from 'react';
// import toast, { Toaster } from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:6002/api';

// const LoginForm = () => {
//     const navigate = useNavigate();
//     const [isNewUser, setIsNewUser] = useState(true);
//     const [name, setName] = useState('');
//     const [mobileNumber, setMobileNumber] = useState('');
//     const [pin, setPin] = useState('');
//     const [aadharNumber, setAadharNumber] = useState('');
//     const [role, setRole] = useState('');
//     const [isPinSent, setIsPinSent] = useState(false);
//     const [isForgotPin, setIsForgotPin] = useState(false);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


//     // Check screen size and update responsive state
//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth <= 768);
//         };

//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     // Token management
//     const saveToken = (token) => {
//         localStorage.setItem('authToken', token);
//     };

//     const sendPin = async (forgotPin = false) => {
//         if (!mobileNumber) {
//             toast.error('Please enter a mobile number');
//             return;
//         }

//         const cleanedNumber = mobileNumber.replace(/\D/g, '');

//         if (cleanedNumber.length !== 10) {
//             toast.error('Please enter a valid 10-digit mobile number');
//             return;
//         }

//         try {
//             let endpoint = forgotPin ? `${API_BASE_URL}/forgot-pin` : `${API_BASE_URL}/send-pin`;
//             const response = await fetch(endpoint, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ mobileNumber: cleanedNumber }),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to send PIN');
//             }

//             toast.success('New PIN sent to your mobile number');
//             setIsPinSent(true);
//             if (forgotPin) {
//                 setIsForgotPin(false);
//             }
//         } catch (error) {
//             console.error('Error sending PIN:', error);
//             toast.error(error.message || 'Failed to send PIN. Please try again.');
//         }
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if ((isNewUser || isForgotPin) && !isPinSent) {
//             toast.error('Please request a PIN first');
//             return;
//         }

//         try {
//             const endpoint = isNewUser ? `${API_BASE_URL}/register` : `${API_BASE_URL}/login`;
//             const body = isNewUser
//                 ? { name, mobileNumber, aadharNumber, pin, role }
//                 : { mobileNumber, pin };

//             const response = await fetch(endpoint, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(body),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'An error occurred');
//             }

//             const data = await response.json();

//             // Save token and handle authentication
//             if (data.token) {
//                 saveToken(data.token);

//                 // Decode token to get user information
//                 const decodedToken = jwtDecode(data.token);

//                 // Store user role and ID
//                 localStorage.setItem('userRole', decodedToken.role);
//                 localStorage.setItem('userId', decodedToken.userId);

//                 // Navigate to the dashboard route returned from the backend
//                 const dashboardRoute = data.dashboardRoute || '/unauthorized';
//                 navigate(dashboardRoute);
//             }

//             if (isNewUser) {
//                 toast.success('Registration successful! Please log in.');
//                 setIsNewUser(false); // Switch to login view
//             } else {
//                 toast.success('Login successful!');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             toast.error(error.message || 'An error occurred. Please try again.');
//         }
//     };
//     const toggleNewUser = () => {
//         setIsNewUser(!isNewUser);
//         resetForm();
//     };

//     const resetForm = () => {
//         setName('');
//         setMobileNumber('');
//         setPin('');
//         setAadharNumber('');
//         setRole('');
//         setIsPinSent(false);
//         setIsForgotPin(false);
//     };

//     const handleForgotPin = () => {
//         setIsForgotPin(true);
//         setIsPinSent(false);
//     };

//     // Mobile menu toggle
//     const toggleMobileMenu = () => {
//         setIsMenuOpen(!isMenuOpen);
//     };

//     // Render mobile view
//     const renderMobileView = () => (
//         <div className="flex flex-col min-h-screen bg-gray-100">
//             <Toaster position="top-center" reverseOrder={false} />
//             <div className="flex-grow flex flex-col justify-center p-4">
//                 <div className="bg-white shadow-md rounded-lg p-6">
//                     <div className="text-center mb-6">
//                         <h1 className="text-2xl font-bold text-blue-600">Farm2Fork</h1>
//                         <p className="text-sm text-gray-500">Authentication Portal</p>
//                     </div>
//                     <h2 className="text-xl font-semibold mb-4">
//                         {isNewUser ? 'Sign Up' : (isForgotPin ? 'Forgot PIN' : 'Login')}
//                     </h2>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         {isNewUser && (
//                             <>
//                                 <input
//                                     type="text"
//                                     placeholder="Farmer Name"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <input
//                                     type="text"
//                                     placeholder="Enter your 12 digit Aadhaar no"
//                                     value={aadharNumber}
//                                     onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
//                                     maxLength="12"
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <select
//                                     value={role}
//                                     onChange={(e) => setRole(e.target.value)}
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 >
//                                     <option value="">Select Your Role</option>
//                                     <option value="farmer">Farmer</option>
//                                     <option value="distributor">Distributor</option>
//                                     <option value="consumer">Consumer</option>
//                                     <option value="serviceProvider">Service Provider</option>
//                                 </select>
//                             </>
//                         )}
//                         <input
//                             type="tel"
//                             placeholder="Mobile Number"
//                             value={mobileNumber}
//                             onChange={(e) => setMobileNumber(e.target.value)}
//                             required
//                             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         {(isNewUser || isForgotPin) && (
//                             <button
//                                 type="button"
//                                 onClick={() => sendPin(isForgotPin)}
//                                 className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300"
//                             >
//                                 Send New PIN via SMS
//                             </button>
//                         )}
//                         <input
//                             type="password"
//                             placeholder="Enter 6-digit PIN"
//                             value={pin}
//                             onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                             maxLength="6"
//                             required
//                             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         <button
//                             type="submit"
//                             className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
//                         >
//                             {isNewUser ? 'Register' : 'Login'}
//                         </button>
//                     </form>
//                     <div className="mt-4 text-center">
//                         <p className="text-sm">
//                             {isNewUser ? 'Already have an account?' : 'Need to create an account?'}
//                             <button
//                                 onClick={toggleNewUser}
//                                 className="ml-2 text-blue-500 hover:text-blue-600 transition duration-300"
//                             >
//                                 {isNewUser ? 'Login' : 'Sign Up'}
//                             </button>
//                         </p>
//                         {!isNewUser && !isForgotPin && (
//                             <button
//                                 onClick={handleForgotPin}
//                                 className="mt-2 text-sm text-blue-500 hover:text-blue-600 transition duration-300"
//                             >
//                                 Forgot PIN?
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     // Render desktop view
//     const renderDesktopView = () => (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//             <Toaster position="top-center" reverseOrder={false} />
//             <div className="w-full max-w-4xl flex shadow-lg rounded-lg overflow-hidden">
//                 {/* Left Side - Image/Illustration */}
//                 <div className="w-1/2 bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center">
//                     <div className="text-center text-white p-8">
//                         <h2 className="text-3xl font-bold mb-4">Farm2Fork</h2>
//                         <p className="text-lg">Empowering Farmers, Connecting Communities</p>
//                         <div className="mt-8 w-64 h-64 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-48 h-48 text-white">
//                                 <path fill="currentColor" d="M50 10c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 70c-16.569 0-30-13.431-30-30s13.431-30 30-30 30 13.431 30 30-13.431 30-30 30zm15-30a15 15 0 01-15 15 15 15 0 01-15-15 15 15 0 0115-15 15 15 0 0115 15z" />
//                                 <path fill="currentColor" d="M50 30a10 10 0 00-10 10 10 10 0 0010 10 10 10 0 0010-10 10 10 0 00-10-10zm0 15a5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5 5 5 0 01-5 5z" />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Side - Login Form */}
//                 <div className="w-1/2 bg-white p-8">
//                     <div className="text-center mb-8">
//                         <h1 className="text-2xl font-bold text-blue-600">Farm2Fork</h1>
//                         <p className="text-sm text-gray-500">Authentication Portal</p>
//                     </div>
//                     <h2 className="text-xl font-semibold mb-4">
//                         {isNewUser ? 'Sign Up' : (isForgotPin ? 'Forgot PIN' : 'Login')}
//                     </h2>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         {isNewUser && (
//                             <>
//                                 <input
//                                     type="text"
//                                     placeholder="Farmer Name"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <input
//                                     type="text"
//                                     placeholder="Enter your 12 digit Aadhaar no"
//                                     value={aadharNumber}
//                                     onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
//                                     maxLength="12"
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <select
//                                     value={role}
//                                     onChange={(e) => setRole(e.target.value)}
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 >
//                                     <option value="">Select Your Role</option>
//                                     <option value="farmer">Farmer</option>
//                                     <option value="distributor">Distributor</option>
//                                     <option value="consumer">Consumer</option>
//                                     <option value="serviceProvider">Service Provider</option>
//                                 </select>
//                             </>
//                         )}
//                         <input
//                             type="tel"
//                             placeholder="Mobile Number"
//                             value={mobileNumber}
//                             onChange={(e) => setMobileNumber(e.target.value)}
//                             required
//                             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         {(isNewUser || isForgotPin) && (
//                             <button
//                                 type="button"
//                                 onClick={() => sendPin(isForgotPin)}
//                                 className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300"
//                             >
//                                 Send New PIN via SMS
//                             </button>
//                         )}
//                         <input
//                             type="password"
//                             placeholder="Enter 6-digit PIN"
//                             value={pin}
//                             onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                             maxLength="6"
//                             required
//                             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         <button
//                             type="submit"
//                             className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
//                         >
//                             {isNewUser ? 'Register' : 'Login'}
//                         </button>
//                     </form>
//                     <div className="mt-4 text-center">
//                         <p className="text-sm">
//                             {isNewUser ? 'Already have an account?' : 'Need to create an account?'}
//                             <button
//                                 onClick={toggleNewUser}
//                                 className="ml-2 text-blue-500 hover:text-blue-600 transition duration-300"
//                             >
//                                 {isNewUser ? 'Login' : 'Sign Up'}
//                             </button>
//                         </p>
//                         {!isNewUser && !isForgotPin && (
//                             <button
//                                 onClick={handleForgotPin}
//                                 className="mt-2 text-sm text-blue-500 hover:text-blue-600 transition duration-300"
//                             >
//                                 Forgot PIN?
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <>
//             {isMobile ? renderMobileView() : renderDesktopView()}
//         </>
//     );
// };

// export default LoginForm;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:6002/api';

const LoginForm = () => {
    const navigate = useNavigate();
    const [isNewUser, setIsNewUser] = useState(false);
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [pin, setPin] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [role, setRole] = useState('');
    const [isPinSent, setIsPinSent] = useState(false);
    const [isForgotPin, setIsForgotPin] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const saveToken = (token) => {
        localStorage.setItem('authToken', token);
    };

    const sendPin = async (forgotPin = false) => {
        if (!mobileNumber) {
            toast.error('Please enter a mobile number');
            return;
        }

        const cleanedNumber = mobileNumber.replace(/\D/g, '');

        if (cleanedNumber.length !== 10) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            let endpoint = forgotPin ? `${API_BASE_URL}/forgot-pin` : `${API_BASE_URL}/send-pin`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobileNumber: cleanedNumber }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send PIN');
            }

            toast.success('New PIN sent to your mobile number');
            setIsPinSent(true);
            if (forgotPin) {
                setIsForgotPin(false);
            }
        } catch (error) {
            console.error('Error sending PIN:', error);
            toast.error(error.message || 'Failed to send PIN. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((isNewUser || isForgotPin) && !isPinSent) {
            toast.error('Please request a PIN first');
            return;
        }

        try {
            const endpoint = isNewUser ? `${API_BASE_URL}/register` : `${API_BASE_URL}/login`;
            const body = isNewUser
                ? { name, mobileNumber, aadharNumber, pin, role }
                : { mobileNumber, pin };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            }

            const data = await response.json();

            if (isNewUser) {
                toast.success('Registration successful! Please log in.');
                setIsNewUser(false);
                resetForm();
            } else {
                if (data.token) {
                    saveToken(data.token);
                    localStorage.setItem('userRole', data.role);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('username', data.name);

                    toast.success('Login successful!');

                    // Redirect based on user role
                    switch (data.role) {
                        case 'farmer':
                            navigate('/farmer-dashboard');
                            break;
                        case 'distributor':
                            navigate('/distributor-dashboard');
                            break;
                        case 'consumer':
                            navigate('/consumer-dashboard');
                            break;
                        case 'serviceProvider':
                            navigate('/service-provider-dashboard');
                            break;
                        default:
                            navigate('/unauthorized');
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'An error occurred. Please try again.');
        }
    };

    const toggleNewUser = () => {
        setIsNewUser(!isNewUser);
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setMobileNumber('');
        setPin('');
        setAadharNumber('');
        setRole('');
        setIsPinSent(false);
        setIsForgotPin(false);
    };

    const handleForgotPin = () => {
        setIsForgotPin(true);
        setIsPinSent(false);
    };

    const renderMobileView = () => (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="flex-grow flex flex-col justify-center p-4">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-blue-600">Farm2Fork</h1>
                        <p className="text-sm text-gray-500">Authentication Portal</p>
                    </div>
                    <h2 className="text-xl font-semibold mb-4">
                        {isNewUser ? 'Sign Up' : (isForgotPin ? 'Forgot PIN' : 'Login')}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isNewUser && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Enter your 12 digit Aadhaar no"
                                    value={aadharNumber}
                                    onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                    maxLength="12"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Your Role</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="distributor">Distributor</option>
                                    <option value="consumer">Consumer</option>
                                    <option value="serviceProvider">Service Provider</option>
                                </select>
                            </>
                        )}
                        <input
                            type="tel"
                            placeholder="Mobile Number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {(isNewUser || isForgotPin) && (
                            <button
                                type="button"
                                onClick={() => sendPin(isForgotPin)}
                                className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300"
                            >
                                Send New PIN via SMS
                            </button>
                        )}
                        <input
                            type="password"
                            placeholder="Enter 6-digit PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength="6"
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            {isNewUser ? 'Register' : 'Login'}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-sm">
                            {isNewUser ? 'Already have an account?' : 'Need to create an account?'}
                            <button
                                onClick={toggleNewUser}
                                className="ml-2 text-blue-500 hover:text-blue-600 transition duration-300"
                            >
                                {isNewUser ? 'Login' : 'Sign Up'}
                            </button>
                        </p>
                        {!isNewUser && !isForgotPin && (
                            <button
                                onClick={handleForgotPin}
                                className="mt-2 text-sm text-blue-500 hover:text-blue-600 transition duration-300"
                            >
                                Forgot PIN?
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDesktopView = () => (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-full max-w-4xl flex shadow-lg rounded-lg overflow-hidden">
                <div className="w-1/2 bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                        <h2 className="text-3xl font-bold mb-4">Farm2Fork</h2>
                        <p className="text-lg">Empowering Farmers, Connecting Communities</p>
                        <div className="mt-8 w-64 h-64 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-48 h-48 text-white">
                                <path fill="currentColor" d="M50 10c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 70c-16.569 0-30-13.431-30-30s13.431-30 30-30 30 13.431 30 30-13.431 30-30 30zm15-30a15 15 0 01-15 15 15 15 0 01-15-15 15 15 0 0115-15 15 15 0 0115 15z" />
                                <path fill="currentColor" d="M50 30a10 10 0 00-10 10 10 10 0 0010 10 10 10 0 0010-10 10 10 0 00-10-10zm0 15a5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5 5 5 0 01-5 5z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="w-1/2 bg-white p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-blue-600">Farm2Fork</h1>
                        <p className="text-sm text-gray-500">Authentication Portal</p>
                    </div>
                    <h2 className="text-xl font-semibold mb-4">
                        {isNewUser ? 'Sign Up' : (isForgotPin ? 'Forgot PIN' : 'Login')}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isNewUser && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Enter your 12 digit Aadhaar no"
                                    value={aadharNumber}
                                    onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                    maxLength="12"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Your Role</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="distributor">Distributor</option>
                                    <option value="consumer">Consumer</option>
                                    <option value="serviceProvider">Service Provider</option>
                                </select>
                            </>
                        )}
                        <input
                            type="tel"
                            placeholder="Mobile Number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {(isNewUser || isForgotPin) && (
                            <button
                                type="button"
                                onClick={() => sendPin(isForgotPin)}
                                className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300"
                            >
                                Send New PIN via SMS
                            </button>
                        )}
                        <input
                            type="password"
                            placeholder="Enter 6-digit PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength="6"
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            {isNewUser ? 'Register' : 'Login'}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-sm">
                            {isNewUser ? 'Already have an account?' : 'Need to create an account?'}
                            <button
                                onClick={toggleNewUser}
                                className="ml-2 text-blue-500 hover:text-blue-600 transition duration-300"
                            >
                                {isNewUser ? 'Login' : 'Sign Up'}
                            </button>
                        </p>
                        {!isNewUser && !isForgotPin && (
                            <button
                                onClick={handleForgotPin}
                                className="mt-2 text-sm text-blue-500 hover:text-blue-600 transition duration-300"
                            >
                                Forgot PIN?
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {isMobile ? renderMobileView() : renderDesktopView()}
        </>
    );
};

export default LoginForm;

