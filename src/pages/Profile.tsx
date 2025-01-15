import React from 'react';

const Profile = () => {
  return (
    <div className="p-4 pb-24 text-center">
      <div className="mb-8">
        <h2 className="text-sm mb-2">V1.0</h2>
        <div className="w-24 h-24 rounded-full bg-gray-800 mx-auto mb-2" />
        <h1 className="text-xl font-bold">The Profile name</h1>
        <p className="text-gray-400">#1</p>
        <p className="text-xl font-bold mt-2">620P</p>
      </div>
      
      <div className="w-32 h-32 rounded-full bg-gray-800 mx-auto mb-8 relative">
        <img src="/bird.png" alt="Bird" className="absolute inset-0 w-full h-full p-8" />
      </div>
      
      <div className="flex items-center justify-between max-w-xs mx-auto bg-gray-900 rounded-full p-2">
        <div className="flex items-center gap-2 px-3">
          <span className="w-4 h-4 bg-gray-700 rounded-full" />
          <span>69.7691000</span>
        </div>
        <button className="bg-green-500 text-black px-4 py-1 rounded-full font-medium">
          Farm
        </button>
      </div>
    </div>
  );
};

export default Profile;