import React from 'react';

const ProfileHeaderComponent = ({ student }) => {
  return (
    <div className="relative">
      {/* Header with gradient background */}
      <div 
        className="h-32 sm:h-40 md:h-48"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-3 sm:top-6 left-3 sm:left-6 w-3 sm:w-5 h-3 sm:h-5 bg-yellow-300 rounded-full opacity-70 animate-pulse"></div>
          <div className="absolute top-6 sm:top-12 right-6 sm:right-12 w-2 sm:w-3 h-2 sm:h-3 bg-yellow-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-6 sm:bottom-12 left-1/4 w-2 h-2 bg-yellow-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Navigation */}
        <div className="relative z-10 px-3 sm:px-4 lg:px-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
            <div className="flex items-center space-x-2">
              {/* Removed Dashboard button as requested */}
            </div>
            <div className="text-xs text-white/80 font-medium">
              Last Updated: {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card with border radius */}
      <div className="relative z-10 px-3 sm:px-4 lg:px-6 -mt-16 sm:-mt-20 md:-mt-24 mb-4">
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-4 sm:space-x-3">
            <div className="flex-1 w-full">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">{student?.name || 'Student'}</h1>
                  <p className="text-xs text-gray-600 mt-1">{student?.email || 'No email provided'}</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 space-y-2">
                <p><span className="font-medium">Registration:</span> {student?.registration_number || 'N/A'}</p>
                <p><span className="font-medium">Department:</span> {student?.department || 'N/A'} - Batch {student?.batch || 'N/A'}</p>
                <p><span className="font-medium">College:</span> {student?.college || 'Demo College'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderComponent;