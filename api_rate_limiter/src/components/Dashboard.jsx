import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [userId, setUserId] = useState('');
  const [responseStatus, setResponseStatus] = useState(null);
  const [cooldown, setCooldown] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [config, setConfig] = useState({ maxRequests: 5, duration: 60 });
  const [newConfig, setNewConfig] = useState({ maxRequests: 5, duration: 60 });

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const sendRequest = async () => {
    if (!userId.trim()) {
      alert("Please enter a valid user ID");
      return;
    }
    try {
      const res = await axios.get('http://localhost:7005/api', {
        headers: { user_id: userId },
      });
      setResponseStatus(res.status);
      setRequestCount((prev) => prev + 1);
    } catch (err) {
      if (err.response?.status === 429) {
        setResponseStatus(429);
        setCooldown(config.duration);
      } else {
        alert("Request failed");
      }
    }
  };

  const updateConfig = async () => {
    try {
      await axios.post('http://localhost:7005/config', newConfig);
      setConfig(newConfig);
      alert("Config updated successfully!");
    } catch (err) {
      alert("Failed to update config");
    }
  };

  useEffect(() => {
    if (requestCount === 0) return;

    const newLog = {
      userId,
      timestamp: new Date().toISOString(),
      count: requestCount,
    };
    setLogs((prev) => [...prev, newLog]);
  }, [requestCount, userId]);

  useEffect(() => {
    let interval = null;
    if (cooldown !== null) {
      interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev > 0) return prev - 1;
          setResponseStatus(null);
          return null;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const cardStyle = {
    marginBottom: '30px',
    backgroundColor: 'var(--card-bg)',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 0 10px var(--primary)',
    color: 'var(--text-color)',
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      {/* Dark Mode Toggle */}
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            style={{ marginRight: '8px' }}
          />
          Dark Mode
        </label>
      </div>

      {/* API Simulator */}
      <div style={cardStyle}>
        <h2>API Usage Simulator</h2>
        <input
          type="text"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px' }}
        />
        <button onClick={sendRequest} disabled={cooldown !== null} style={{ padding: '8px 15px' }}>
          Send API Request
        </button>
        {responseStatus && <p>Response Status: {responseStatus}</p>}
        {cooldown !== null && <p style={{ color: 'red' }}>Retry after: {cooldown} sec</p>}
        <p>Requests Made: {requestCount}</p>
      </div>

      {/* Timeline */}
      <div style={cardStyle}>
        <h2>Request Timeline</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={logs.slice(-10)}>
            <XAxis dataKey="timestamp" tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} />
            <YAxis allowDecimals={false} />
            <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
            <Line type="monotone" dataKey="count" stroke="var(--primary)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Admin Panel */}
      <div style={cardStyle}>
        <h2>Admin: Update Rate Limit</h2>
        <input
          type="number"
          placeholder="Max Requests"
          value={newConfig.maxRequests}
          onChange={(e) => setNewConfig({ ...newConfig, maxRequests: +e.target.value })}
          style={{ padding: '8px', width: '150px', marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Duration (seconds)"
          value={newConfig.duration}
          onChange={(e) => setNewConfig({ ...newConfig, duration: +e.target.value })}
          style={{ padding: '8px', width: '150px' }}
        />
        <button onClick={updateConfig} style={{ display: 'block', marginTop: '15px', padding: '8px 15px' }}>
          Update Config
        </button>
      </div>
    </div>
  );
}
