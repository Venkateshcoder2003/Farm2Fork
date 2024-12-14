
// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import LoginForm from './components/LoginForm';
// import ProtectedRoute from './components/ProtectedRoute';
// import FarmDashboard from './pages/FarmDashboard';
// import LaborDashboard from './pages/LaborDashboard';
// import ServiceDashboard from './pages/ServiceDashboard';
// import AdminDashboard from './pages/ConsumerDashboard';
// import Unauthorized from './pages/Unauthorized';


// function App() {
//   return (

//     <BrowserRouter>

//       <LoginForm />
//       <Routes>
//         <Route path="/login" element={<LoginForm />} />
//         <Route
//           path="/farmer-dashboard"
//           element={
//             <ProtectedRoute allowedRoles={['farmOwner']}>
//               <FarmDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/distributor-dashboard"
//           element={
//             <ProtectedRoute allowedRoles={['laborer']}>
//               <LaborDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/consumer-dashboard"
//           element={
//             <ProtectedRoute allowedRoles={['serviceProvider']}>
//               <ServiceDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/serviceProvider-dashboard"
//           element={
//             <ProtectedRoute allowedRoles={['admin']}>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route path="/unauthorized" element={<Unauthorized />} />
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </BrowserRouter >
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import FarmerDashboard from './pages/FarmDashboard';
import DistributorDashboard from './pages/DistributorDashboard';
import ConsumerDashboard from './pages/ConsumerDashboard';
import ServiceProviderDashboard from './pages/ServiceDashboard';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/farmer-dashboard"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/distributor-dashboard"
          element={
            <ProtectedRoute allowedRoles={['distributor']}>
              <DistributorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consumer-dashboard"
          element={
            <ProtectedRoute allowedRoles={['consumer']}>
              <ConsumerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/service-provider-dashboard"
          element={
            <ProtectedRoute allowedRoles={['serviceProvider']}>
              <ServiceProviderDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;