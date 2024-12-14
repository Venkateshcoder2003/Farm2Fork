import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    UserCircleIcon,
    QrCodeIcon,
    ExclamationTriangleIcon,
    ChatBubbleLeftIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const ConsumerDashboard = () => {
    const [consumerName, setConsumerName] = useState('');
    const [productId, setProductId] = useState('');
    const [productHistory, setProductHistory] = useState(null);
    const [issueType, setIssueType] = useState('');
    const [productName, setProductName] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchConsumerName = async () => {
            const username = localStorage.getItem('username');
            if (username) {
                try {
                    setLoading(true);
                    setConsumerName(username);
                } catch (error) {
                    console.error('Error fetching consumer name:', error);
                    setError('Failed to fetch consumer name. Please log in again.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchConsumerName();
    }, []);

    const handleProductTrace = async (e) => {
        e.preventDefault();
        setError('');
        setProductHistory(null);
        setLoading(true);

        try {
            const response = await axios.get(`/api/products/${productId}`);
            setProductHistory(response.data);
            setProductName(response.data.name || 'Traced Product');
        } catch (error) {
            console.error('Error fetching product history:', error);
            setError('Product tracing failed. Please verify the Product ID.');
        } finally {
            setLoading(false);
        }
    };

    const handleIssueReport = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:6002/api/issues', {
                username,
                productName,
                issueType,
                issueDescription
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Issue report response:', response.data);
            toast.success('Issue reported successfully!');

            setIssueType('');
            setIssueDescription('');
            setProductName('');
        } catch (error) {
            console.error('Error reporting issue:', error);
            setError(error.response?.data?.message || 'Issue reporting failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('http://localhost:6002/api/feedback', {
                consumerName,
                feedback
            });

            toast.success('Feedback submitted successfully!');
            setFeedback('');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setError('Feedback submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
                {/* Header with Elegant Gradient and User Info */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 p-6 flex items-center space-x-4 shadow-lg">
                    <UserCircleIcon className="h-12 w-12 text-white animate-pulse" />
                    <div>
                        <h1 className="text-3xl font-bold text-white drop-shadow-md">
                            Welcome, {consumerName || 'Consumer'}
                        </h1>
                        {loading && (
                            <p className="text-sm text-blue-100 animate-pulse">
                                Loading your dashboard...
                            </p>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="p-8 space-y-8">
                    {/* Product Traceability Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Side - Product Trace Form */}
                        <section className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <QrCodeIcon className="h-8 w-8 text-blue-500 mr-3 animate-bounce" />
                                <h2 className="text-2xl font-semibold text-gray-800">Product Traceability</h2>
                            </div>
                            <form onSubmit={handleProductTrace} className="space-y-4">
                                <div className="relative">
                                    <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-2">
                                        Product ID
                                    </label>
                                    <input
                                        type="text"
                                        id="productId"
                                        value={productId}
                                        onChange={(e) => setProductId(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 hover:border-blue-400"
                                        placeholder="Enter Product ID or scan QR code"
                                        required
                                    />
                                    <InformationCircleIcon
                                        className="absolute right-3 top-10 h-5 w-5 text-blue-400 hover:text-blue-600 cursor-help"
                                        title="Scan or manually enter your product's unique identifier"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Tracing...' : 'Trace Product'}
                                </button>
                            </form>

                            {productHistory && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md animate-fade-in">
                                    <h3 className="text-lg font-semibold mb-3 text-blue-800">Product History</h3>
                                    <div className="space-y-2">
                                        <p><strong className="text-gray-700">Origin:</strong> {productHistory.origin}</p>
                                        <p><strong className="text-gray-700">Processing Date:</strong> {productHistory.processingDate}</p>
                                        <p><strong className="text-gray-700">Temperature Log:</strong> {productHistory.temperatureLog}</p>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Right Side - Product Trace Image */}
                        <div className="flex items-center justify-center bg-blue-50 rounded-xl">
                            <img
                                src="https://thumbs.dreamstime.com/z/farm-handshake-closeup-partnership-collaboration-success-outdoors-farmer-welcome-shaking-hands-eco-farm-handshake-261579662.jpg"
                                alt="Product Traceability"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Issue Reporting Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Side - Issue Report Image */}
                        <div className="flex items-center justify-center bg-red-50 rounded-xl">
                            <img
                                src="https://th.bing.com/th/id/OIP.wNeIRVKI1pvEP6MnkyhpxwHaFB?rs=1&pid=ImgDetMain"
                                alt="Issue Reporting"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>

                        {/* Right Side - Issue Report Form */}
                        <section className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mr-3 animate-wiggle" />
                                <h2 className="text-2xl font-semibold text-gray-800">Report an Issue</h2>
                            </div>
                            <form onSubmit={handleIssueReport} className="space-y-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Product Name
                                    </label>
                                    <input
                                        type="productName"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none transition duration-300"
                                        placeholder="Enter or auto-populate product name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
                                    <select
                                        id="issueType"
                                        value={issueType}
                                        onChange={(e) => setIssueType(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none transition duration-300"
                                        required
                                    >
                                        <option value="">Select an issue type</option>
                                        <option value="quality">Quality Issue</option>
                                        <option value="expired">Expired Product</option>
                                        <option value="packaging">Packaging Damage</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        id="issueDescription"
                                        value={issueDescription}
                                        onChange={(e) => setIssueDescription(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none transition duration-300"
                                        rows="3"
                                        placeholder="Provide detailed information about the issue"
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Report Issue'}
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* Feedback Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Side - Feedback Form */}
                        <section className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <ChatBubbleLeftIcon className="h-8 w-8 text-green-500 mr-3 animate-float" />
                                <h2 className="text-2xl font-semibold text-gray-800">Provide Feedback</h2>
                            </div>
                            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
                                    <textarea
                                        id="feedback"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-300"
                                        rows="4"
                                        placeholder="Your constructive feedback helps us improve"
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </form>
                        </section>

                        {/* Right Side - Feedback Image */}
                        <div className="flex items-center justify-center bg-green-50 rounded-xl">
                            <img
                                src="https://t3.ftcdn.net/jpg/03/26/96/08/360_F_326960863_H6rldtPxBudJAeYsBvhWEQK3l0OwWOLe.jpg"
                                alt="Feedback"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Error Notification */}
                    {error && (
                        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-2xl animate-bounce">
                            <div className="flex items-center space-x-2">
                                <ExclamationTriangleIcon className="h-6 w-6" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsumerDashboard;