import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md w-full">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
                <p className="text-gray-700 mb-6">
                    You do not have permission to access this page.
                    Please contact an administrator if you believe this is an error.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link
                        to="/login"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                        Return to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;