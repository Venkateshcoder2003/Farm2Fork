import React from 'react';

const AvailabilityToggle = ({ isAvailable, onToggle }) => {
    return (
        <div className="flex items-center">
            <span className="mr-3">Availability:</span>
            <button
                onClick={() => onToggle(!isAvailable)}
                className={`px-4 py-2 rounded-full ${isAvailable
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                    } text-white font-semibold transition-colors duration-300`}
            >
                {isAvailable ? 'Available' : 'Unavailable'}
            </button>
        </div>
    );
};

export default AvailabilityToggle;

