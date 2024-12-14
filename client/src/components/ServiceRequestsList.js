import React, { useState } from 'react';

const ServiceRequestsList = ({ requests }) => {
    const [filter, setFilter] = useState('all');

    const filteredRequests = requests.filter(request => {
        if (filter === 'all') return true;
        return request.type === filter;
    });

    return (
        <div>
            <div className="mb-4">
                <label htmlFor="filter" className="mr-2">Filter by:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    <option value="all">All</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="monitoring">Monitoring</option>
                </select>
            </div>
            <ul className="space-y-4">
                {filteredRequests.map((request) => (
                    <li key={request.id} className="border-b pb-2">
                        <h3 className="font-semibold">{request.title}</h3>
                        <p>Type: {request.type}</p>
                        <p>Status: {request.status}</p>
                        <p>Description: {request.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ServiceRequestsList;

