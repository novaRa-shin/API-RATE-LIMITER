import React, { useState } from 'react';

export default function UsageSimulator({ onSendRequest, responseStatus, cooldown, requestCount, setUserId, userId }) {
  return (
    <div className="usage-simulator p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">API Usage Simulator</h2>
      <input
        type="text"
        placeholder="Enter user ID"
        value={userId}
        onChange={e => setUserId(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={onSendRequest} className="btn btn-primary p-2">Send API Request</button>
      {responseStatus && <p className="mt-2">Response Status: {responseStatus}</p>}
      {cooldown !== null && <p>Retry after: {cooldown} sec</p>}
      <p>Requests Made: {requestCount}</p>
    </div>
  );
}
