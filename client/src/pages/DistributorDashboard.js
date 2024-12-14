import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TruckIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    ServerStackIcon,
    ClipboardDocumentListIcon,
    DocumentCheckIcon
} from '@heroicons/react/24/outline';

import ShipmentTrackingMap from '../components/ShipmentTrackingMap';
import TemperatureHumidityLogs from '../components/TemperatureHumidityLogs';
import InventoryOverview from '../components/InventoryOverview';
import LowStockAlerts from '../components/LowStockAlerts';
import IssueReportingForm from '../components/IssueReportingForm';

const IssuesTable = ({ issues }) => {
    return (
        <div className="overflow-x-auto">
            {issues.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No issues reported</p>
            ) : (
                <table className="w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {issues.map((issue) => (
                            <tr key={issue._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">{issue.user}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{issue.productName}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${issue.issueType === 'Technical' ? 'bg-blue-100 text-blue-800' :
                                            issue.issueType === 'Quality' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'}`}
                                    >
                                        {issue.issueType}
                                    </span>
                                </td>
                                <td className="px-4 py-3">{issue.issueDescription}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {new Date(issue.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const DistributorDashboard = () => {
    const [distributorName, setDistributorName] = useState('');
    const [shipments, setShipments] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [issues, setIssues] = useState([]);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const fetchDistributorData = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const nameResponse = await axios.get(`/api/users/name/${userId}`);
                    setDistributorName(nameResponse.data.name);

                    const shipmentsResponse = await axios.get('/api/shipments');
                    setShipments(shipmentsResponse.data);

                    const inventoryResponse = await axios.get('/api/inventory');
                    setInventory(inventoryResponse.data);

                    const alertsResponse = await axios.get('/api/low-stock-alerts');
                    setLowStockAlerts(alertsResponse.data);

                    // New: Fetch issues
                    const issuesResponse = await axios.get('/api/issues');
                    setIssues(issuesResponse.data);
                } catch (error) {
                    console.error('Error fetching distributor data:', error);
                    setError('Failed to fetch data. Please try again later.');
                }
            }
        };

        fetchDistributorData();
    }, []);

    const renderDashboardContent = () => {
        return (
            <>
                {/* Top Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipment Tracking */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transform transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center mb-4">
                            <TruckIcon className="h-8 w-8 text-blue-500 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-800">Shipment Tracking</h2>
                        </div>
                        <ShipmentTrackingMap shipments={shipments} />
                    </div>

                    {/* Temperature & Humidity Logs */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transform transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center mb-4">
                            <ClipboardDocumentListIcon className="h-8 w-8 text-green-500 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-800">Temperature & Humidity Logs</h2>
                        </div>
                        <TemperatureHumidityLogs shipments={shipments} />
                    </div>
                </div>

                {/* Bottom Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Inventory Overview */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transform transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center mb-4">
                            <ServerStackIcon className="h-8 w-8 text-purple-500 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-800">Inventory Overview</h2>
                        </div>
                        <InventoryOverview inventory={inventory} />
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transform transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center mb-4">
                            <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-800">Low Stock Alerts</h2>
                        </div>
                        <LowStockAlerts alerts={lowStockAlerts} />
                    </div>
                </div>

                {/* Issue Reporting */}
                <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6 transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center mb-4">
                        <ChartBarIcon className="h-8 w-8 text-indigo-500 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800">Report an Issue</h2>
                    </div>
                    <IssueReportingForm />
                </div>

                {/* Reported Issues */}
                <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6 transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center mb-4">
                        <DocumentCheckIcon className="h-8 w-8 text-green-500 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800">Reported Issues</h2>
                    </div>
                    <IssuesTable issues={issues} />
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Welcome, {distributorName || 'Distributor'}
                        </h1>
                        <p className="text-gray-500 mt-2">Dashboard Overview</p>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-4 py-2 rounded-md transition-all ${activeTab === 'dashboard'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`px-4 py-2 rounded-md transition-all ${activeTab === 'reports'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Reports
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                {activeTab === 'dashboard' && renderDashboardContent()}

                {/* Error Handling */}
                {error && (
                    <div className="mt-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-md text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DistributorDashboard;