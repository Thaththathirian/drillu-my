import React from 'react';

// Stat Card Component with consistent styling and gradients
export const StatCard = ({ icon, title, value, gradient }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-sm p-4 border border-white/20 hover:shadow-md transition-all duration-300`}>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 border border-white/30">
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Progress Card Component with consistent styling
export const ProgressCard = ({ title, completed, total, percentage, gradient }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-sm p-4 border border-white/20 hover:shadow-md transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 border border-white/30">
            <span className="text-2xl">✅</span>
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-white">{completed}</p>
            <p className="text-xs text-white/70 mt-1">of {total} total</p>
          </div>
        </div>
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-white/30"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 35}`}
              strokeDashoffset={`${2 * Math.PI * 35 * (1 - percentage / 100)}`}
              className="text-white transition-all duration-700 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white">{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Metric Card for key statistics
export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  color = "blue",
  icon = null,
  size = "normal" 
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    red: "bg-red-50 text-red-600 border-red-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
  };

  const sizeClasses = {
    small: "p-4 text-lg",
    normal: "p-6 text-xl",
    large: "p-8 text-2xl"
  };

  return (
    <div className={`${colorClasses[color]} rounded-2xl border hover:shadow-md transition-all duration-300 ${sizeClasses[size]}`}>
      <div className="text-center">
        {icon && (
          <div className="mb-3">
            <span className="text-3xl">{icon}</span>
          </div>
        )}
        <div className={`font-bold ${colorClasses[color].split(' ')[1]}`}>{value}</div>
        <div className="text-sm text-gray-700 font-medium mt-2">{title}</div>
        {subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}
      </div>
    </div>
  );
};

// Modern Stats Grid for organized data display
export const StatsGrid = ({ title, items, columns = 2 }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className={`grid grid-cols-1 sm:grid-cols-${columns} gap-4`}>
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
          <span className="text-gray-700 font-medium text-sm">{item.label}</span>
          <span className={`font-semibold text-sm ${item.color || 'text-gray-900'}`}>{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

// Modern Badge Component
export const Badge = ({ 
  children, 
  variant = "default", 
  size = "normal" 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    purple: "bg-purple-100 text-purple-800"
  };

  const sizes = {
    small: "px-2 py-1 text-xs",
    normal: "px-3 py-1 text-sm",
    large: "px-4 py-2 text-base"
  };

  return (
    <span className={`inline-flex items-center rounded-xl font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};