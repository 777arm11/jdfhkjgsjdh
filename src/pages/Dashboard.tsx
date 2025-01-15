import React from 'react';

const Dashboard = () => {
  const rewards = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    amount: '100P'
  }));

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="space-y-2">
        {rewards.map((reward) => (
          <div key={reward.id} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
            <span>Reward</span>
            <span>{reward.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;