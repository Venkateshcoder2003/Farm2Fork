// import React from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@tremor/react';
// import { format } from 'date-fns';

// const TemperatureHumidityLogs = ({ shipments }) => {
//     const data = shipments.flatMap(shipment =>
//         shipment.logs.map(log => ({
//             date: format(new Date(log.timestamp), 'MM/dd HH:mm'),
//             temperature: log.temperature,
//             humidity: log.humidity
//         }))
//     );

//     return (
//         <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis yAxisId="left" />
//                 <YAxis yAxisId="right" orientation="right" />
//                 <Tooltip />
//                 <Legend />
//                 <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
//                 <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#82ca9d" />
//             </LineChart>
//         </ResponsiveContainer>
//     );
// };

// export default TemperatureHumidityLogs;

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

const TemperatureHumidityLogs = ({ shipments }) => {
    const data = shipments.flatMap(shipment =>
        shipment.logs.map(log => ({
            date: format(new Date(log.timestamp), 'MM/dd HH:mm'),
            temperature: log.temperature,
            humidity: log.humidity
        }))
    );

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="humidity"
                    stroke="#82ca9d"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default TemperatureHumidityLogs;
