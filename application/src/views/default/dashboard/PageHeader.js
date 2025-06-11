import React from 'react';

const PageHeader = ({ 
  title, 
  subtitle = null, 
  rightContent = null,
  className = ""
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0 ${className}`}>
      <div className="flex items-center">
        {/* Removed square box icon as requested */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {rightContent && (
        <div className="flex-shrink-0">
          {rightContent}
        </div>
      )}
    </div>
  );
};

export default PageHeader;