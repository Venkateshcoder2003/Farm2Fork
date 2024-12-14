import React from 'react';

const LowStockAlerts = ({ alerts }) => {
    return (
        <div className="space-y-4">
            {alerts.map((alert) => (
                <div key={alert.id} className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                    <p className="font-bold">Low Stock Alert: {alert.productName}</p>
                    <p>Current quantity: {alert.currentQuantity}</p>
                    <p>Threshold: {alert.threshold}</p>
                </div>
            ))}
        </div>
    );
};

export default LowStockAlerts;

