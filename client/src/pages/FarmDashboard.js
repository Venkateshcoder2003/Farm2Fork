import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FarmerDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [aadharNumber, setAadharNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [farmerName, setFarmerName] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [error, setError] = useState('');

    // ThingSpeak state
    const [sensorData, setSensorData] = useState({
        temperature: null,
        humidity: null,
        gas: null
    });
    const [isLoadingSensorData, setIsLoadingSensorData] = useState(false);

    // ThingSpeak Channel Configuration (Replace with your actual channel details)
    const THINGSPEAK_CHANNEL_ID = '2784696'; // Example channel ID
    const THINGSPEAK_API_KEY = 'VTD70XR0Y21ZZKKP'; // Replace with your read API key

    // Fetch sensor data from ThingSpeak
    const fetchSensorData = async () => {
        setIsLoadingSensorData(true);
        try {
            const response = await axios.get(
                `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds/last.json?api_key=${THINGSPEAK_API_KEY}`
            );

            const data = response.data;
            setSensorData({
                temperature: data.field1, // Adjust field numbers based on your ThingSpeak channel setup
                humidity: data.field2,
                soilMoisture: data.field3
            });
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            setError('Failed to fetch sensor data');
        } finally {
            setIsLoadingSensorData(false);
        }
    };

    useEffect(() => {
        const fetchUserName = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await axios.get(`api/name/${userId}`);
                    setFarmerName(response.data.name);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Error fetching user name:', error);
                    setError('Failed to fetch user name. Please try logging in again.');
                }
            }
        };

        fetchUserName();
    }, []);

    const handleAuthentication = async (e) => {
        e.preventDefault();
        setError('');

        if (aadharNumber.length !== 12) {
            setError('Aadhar number must be 12 digits');
            return;
        }

        if (otp.length !== 6) {
            setError('OTP must be 6 digits');
            return;
        }

        try {
            // Simulating an API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real application, you would verify the Aadhar number and OTP here
            // For this example, we'll just set the authentication to true
            setIsAuthenticated(true);
            setFarmerName('John Doe'); // Replace with actual farmer name from API response
            localStorage.setItem('username', 'John Doe');
        } catch (error) {
            setError('Authentication failed. Please try again.');
        }
    };

    const handleServiceSelection = (service) => {
        setSelectedService(service);

        // Automatically fetch sensor data when Crop Monitoring is selected
        if (service === 'cropMonitoring') {
            fetchSensorData();
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setFarmerName('');
        localStorage.removeItem('username');
        setSelectedService(null);
        // Reset sensor data
        setSensorData({
            temperature: null,
            humidity: null,
            gas: null
        });
    };

    const renderServiceOptions = () => {
        switch (selectedService) {
            case 'cropMonitoring':
                return (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Crop Monitoring Services</h3>
                        <div className="space-y-2">
                            {isLoadingSensorData ? (
                                <p className="text-center text-gray-600">Loading sensor data...</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-green-100 p-4 rounded-lg">
                                        <h4 className="font-semibold">Temperature</h4>
                                        <p className="text-2xl text-green-700">
                                            {sensorData.temperature !== null
                                                ? `${sensorData.temperature}°C`
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-blue-100 p-4 rounded-lg">
                                        <h4 className="font-semibold">Humidity</h4>
                                        <p className="text-2xl text-blue-700">
                                            {sensorData.humidity !== null
                                                ? `${sensorData.humidity}%`
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-yellow-100 p-4 rounded-lg">
                                        <h4 className="font-semibold">GasDetect</h4>
                                        <p className="text-2xl text-yellow-700">
                                            {sensorData.gas !== null
                                                ? `${sensorData.gas}%`
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="mt-4 space-y-2">
                                <button
                                    onClick={fetchSensorData}
                                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                                >
                                    Refresh Sensor Data
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'equipmentMaintenance':
                return (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Equipment Maintenance Services</h3>
                        <div className="space-y-2">
                            <button onClick={() => alert('Irrigation Systems selected')} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">Irrigation Systems</button>
                            <button onClick={() => alert('Harvesting Equipment selected')} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">Harvesting Equipment</button>
                            <button onClick={() => alert('Post-Harvest Equipment selected')} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">Post-Harvest Equipment</button>
                        </div>
                    </div>
                );
            case 'marketInformation':
                return (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Market Information</h3>
                        <div className="space-y-2">
                            <button onClick={() => alert('Current Market Prices selected')} className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300">Current Market Prices</button>
                            <button onClick={() => alert('Government Schemes selected')} className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300">Government Schemes</button>
                            <button onClick={() => alert('Weather Updates selected')} className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300">Weather Updates</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Farmer Authentication</h2>
                <form onSubmit={handleAuthentication} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter 12-digit Aadhar number"
                        value={aadharNumber}
                        onChange={(e) => setAadharNumber(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Authenticate</button>
                </form>
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Welcome, {farmerName || 'Farmer'}</h2>
                <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300">Logout</button>
            </div>
            <div className="service-selection space-y-4">
                <h3 className="text-lg font-semibold mb-2">Select a Service:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => handleServiceSelection('cropMonitoring')} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300">Crop Monitoring Services</button>
                    <button onClick={() => handleServiceSelection('equipmentMaintenance')} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">Equipment Maintenance Services</button>
                    <button onClick={() => handleServiceSelection('marketInformation')} className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300">Market Information</button>
                </div>
            </div>
            {renderServiceOptions()}
        </div>
    );
};

export default FarmerDashboard;