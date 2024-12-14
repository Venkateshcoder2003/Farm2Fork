// import React, { useState } from 'react';
// import axios from 'axios';

// const IssueReportingForm = () => {
//     const [formData, setFormData] = useState({
//         productName: '',
//         issueType: '',
//         issueDescription: ''
//     });
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         try {
//             // Get username from local storage or context
//             const username = localStorage.getItem('userName') || 'Anonymous';

//             const response = await axios.post('http://localhost:6002/api/issues', {
//                 ...formData,
//                 username
//             });

//             setSuccess('Issue reported successfully!');
//             setFormData({
//                 productName: '',
//                 issueType: '',
//                 issueDescription: ''
//             });
//         } catch (error) {
//             console.error('Error reporting issue:', error);
//             setError(error.response?.data?.message || 'Failed to report issue');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//                 <label className="block text-sm font-medium text-gray-700">Product Name</label>
//                 <input
//                     type="text"
//                     name="productName"
//                     value={formData.productName}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
//                 />
//             </div>

//             <div>
//                 <label className="block text-sm font-medium text-gray-700">Issue Type</label>
//                 <select
//                     name="issueType"
//                     value={formData.issueType}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
//                 >
//                     <option value="">Select Issue Type</option>
//                     <option value="Technical">Technical</option>
//                     <option value="Quality">Quality</option>
//                     <option value="Delivery">Delivery</option>
//                     <option value="Other">Other</option>
//                 </select>
//             </div>

//             <div>
//                 <label className="block text-sm font-medium text-gray-700">Issue Description</label>
//                 <textarea
//                     name="issueDescription"
//                     value={formData.issueDescription}
//                     onChange={handleChange}
//                     required
//                     rows="4"
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
//                 ></textarea>
//             </div>

//             {error && (
//                 <div className="text-red-500 text-sm mb-4">
//                     {error}
//                 </div>
//             )}

//             {success && (
//                 <div className="text-green-500 text-sm mb-4">
//                     {success}
//                 </div>
//             )}

//             <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
//             >
//                 Report Issue
//             </button>
//         </form>
//     );
// };

// export default IssueReportingForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IssuesList = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await axios.get('http://localhost:6002/api/issues');
                setIssues(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching issues:', error);
                setError('Failed to fetch issues');
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-600">Loading issues...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <h2 className="text-2xl font-bold bg-gray-100 py-4 px-6 border-b">
                Reported Issues
            </h2>
            {issues.length === 0 ? (
                <p className="text-center py-6 text-gray-500">No issues reported yet.</p>
            ) : (
                <ul>
                    {issues.map((issue) => (
                        <li
                            key={issue._id}
                            className="p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {issue.productName}
                                </h3>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${issue.issueType === 'Technical' ? 'bg-blue-100 text-blue-800' :
                                        issue.issueType === 'Quality' ? 'bg-yellow-100 text-yellow-800' :
                                            issue.issueType === 'Delivery' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                    }`}>
                                    {issue.issueType}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-2">
                                {issue.issueDescription}
                            </p>
                            <div className="text-sm text-gray-500 flex justify-between">
                                <span>Reported by: {issue.username}</span>
                                <span>
                                    {new Date(issue.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default IssuesList;