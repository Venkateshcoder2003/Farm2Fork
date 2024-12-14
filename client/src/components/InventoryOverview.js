// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@tremor/react';

// const InventoryOverview = ({ inventory }) => {
//     return (
//         <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={inventory}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="quantity" fill="#8884d8" />
//             </BarChart>
//         </ResponsiveContainer>
//     );
// };

// export default InventoryOverview;

import React from 'react';
import { BarChart } from '@tremor/react';

const InventoryOverview = ({ inventory }) => {
    return (
        <BarChart
            data={inventory}
            index="name"
            categories={['quantity']}
            colors={['blue']}
            yAxisWidth={40}
        />
    );
};

export default InventoryOverview;
