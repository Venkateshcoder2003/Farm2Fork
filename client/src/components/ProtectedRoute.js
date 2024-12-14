// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children, allowedRoles }) => {
//     // Get user's role from local storage
//     const userRole = localStorage.getItem('userRole');
//     const isAuthenticated = !!localStorage.getItem('authToken');

//     // Check if the user is authenticated and has an allowed role
//     const hasPermission = isAuthenticated && allowedRoles.includes(userRole);

//     if (!isAuthenticated) {
//         // Redirect to login if not authenticated
//         return <Navigate to="/login" replace />;
//     }

//     if (!hasPermission) {
//         // Redirect to unauthorized page if role is not allowed
//         return <Navigate to="/unauthorized" replace />;
//     }

//     // Render the children components if authenticated and role is allowed
//     return children;
// };

// export default ProtectedRoute;


import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    // Get user's role from local storage
    const userRole = localStorage.getItem('userRole');
    const isAuthenticated = !!localStorage.getItem('authToken');

    // Check if the user is authenticated and has an allowed role
    const hasPermission = isAuthenticated && (!allowedRoles || allowedRoles.includes(userRole));

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (!hasPermission) {
        // Redirect to unauthorized page if role is not allowed
        return <Navigate to="/unauthorized" replace />;
    }

    // Render the children components if authenticated and role is allowed
    return children;
};

export default ProtectedRoute;