import React, { useState } from 'react';
import axios from 'axios';

const ReportSubmissionForm = () => {
    const [serviceId, setServiceId] = useState('');
    const [description, setDescription] = useState('');
    const [completionDate, setCompletionDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await axios.post('/api/submit-report', {
                serviceId,
                description,
                completionDate
            });
            setSuccess('Report submitted successfully!');
            setServiceId('');
            setDescription('');
            setCompletionDate('');
        } catch (error) {
            console.error('Error submitting report:', error);
            setError('Failed to submit report. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">Service ID</label>
                <input
                    type="text"
                    id="serviceId"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    rows="3"
                    required
                ></textarea>
            </div>
            <div>
                <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700">Completion Date</label>
                <input
                    type="date"
                    id="completionDate"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                />
            </div>
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Submit Report
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
        </form>
    );
};

export default ReportSubmissionForm;

