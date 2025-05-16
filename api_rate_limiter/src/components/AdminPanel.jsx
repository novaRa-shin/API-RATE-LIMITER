import React, { useState } from 'react';

export default function AdminPanel({ currentConfig, onUpdate }) {
  const [config, setConfig] = useState(currentConfig);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(config);
  };

  return (
    <div className="admin-panel p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin: Update Rate Limit</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="maxRequests"
          value={config.maxRequests}
          onChange={handleChange}
          placeholder="Max Requests"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          name="duration"
          value={config.duration}
          onChange={handleChange}
          placeholder="Duration (seconds)"
          className="border p-2 mr-2"
        />
        <button type="submit" className="btn btn-primary p-2">Update Config</button>
      </form>
    </div>
  );
}
