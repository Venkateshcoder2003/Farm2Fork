import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceRequestsList from '../components/ServiceRequestsList';
import AvailabilityToggle from '../components/AvailabilityToggle';
import ReportSubmissionForm from '../components/ReportSubmissionForm';

const ServiceDashboard = () => {
    const [providerName, setProviderName] = useState('');
    const [serviceRequests, setServiceRequests] = useState([]);
    const [isAvailable, setIsAvailable] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProviderData = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    setIsLoading(true);
                    const nameResponse = await axios.get(`/api/users/name/${userId}`);
                    setProviderName(nameResponse.data.name);

                    const requestsResponse = await axios.get('/api/service-requests');
                    setServiceRequests(requestsResponse.data);

                    const availabilityResponse = await axios.get(`/api/provider-availability/${userId}`);
                    setIsAvailable(availabilityResponse.data.isAvailable);

                    setIsLoading(false);
                } catch (error) {
                    console.error('Error fetching provider data:', error);
                    setError('Failed to fetch data. Please try again later.');
                    setIsLoading(false);
                }
            }
        };

        fetchProviderData();
    }, []);

    const handleAvailabilityChange = async (newAvailability) => {
        try {
            await axios.post('/api/update-availability', { isAvailable: newAvailability });
            setIsAvailable(newAvailability);
        } catch (error) {
            console.error('Error updating availability:', error);
            setError('Failed to update availability. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Welcome, {providerName || 'Service Provider'}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className={`
                            px-4 py-2 rounded-full text-sm font-medium 
                            ${isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }
                        `}>
                            {isAvailable ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Service Requests */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                            Service Requests
                            <span className="ml-2 text-sm text-gray-500">
                                ({serviceRequests.length})
                            </span>
                        </h2>
                        <ServiceRequestsList requests={serviceRequests} />
                    </div>

                    {/* Availability Management */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                            Availability Management
                        </h2>
                        <div className="flex flex-col items-center space-y-4">
                            <AvailabilityToggle
                                isAvailable={isAvailable}
                                onToggle={handleAvailabilityChange}
                            />
                            <p className="text-sm text-gray-600 text-center">
                                Toggle your availability for incoming service requests
                            </p>
                        </div>
                    </div>
                </div>

                {/* Report Submission */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                        Submit Service Report
                    </h2>
                    <ReportSubmissionForm />
                </div>

                {/* Error Handling */}
                {error && (
                    <div className="fixed bottom-4 right-4 z-50">
                        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceDashboard;