import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const TrafficChart = ({ data }) => {
  /*
  data example format:
  [
    { name: 'Server 1', success: 400, failure: 50 },
    { name: 'Server 2', success: 300, failure: 100 },
    { name: 'Server 3', success: 200, failure: 80 },
  ]
  */

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="success" stackId="a" fill="#4caf50" name="Success" />
          <Bar dataKey="failure" stackId="a" fill="#f44336" name="Failure" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficChart;

