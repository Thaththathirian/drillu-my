import React from 'react';

// Simple Radial Progress Component
const SimpleRadialProgress = ({ percentage, size = 80, color = "#3B82F6" }) => {
  const validPercentage = Math.max(0, Math.min(100, percentage || 0));
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-700">{validPercentage.toFixed(0)}%</span>
      </div>
    </div>
  );
};

// Enhanced Statistics Card Component
const StatsCard = ({ title, stats, color = "blue", isActive = true }) => {
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      icon: '💻',
      chartColor: '#3B82F6',
      border: 'border-blue-100'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: '🎯',
      chartColor: '#10B981',
      border: 'border-green-100'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      icon: '📋',
      chartColor: '#8B5CF6',
      border: 'border-purple-100'
    }
  };

  const config = colorConfig[color];

  const safeStats = {
    questions_attended: typeof stats?.questions_attended === 'number' ? stats.questions_attended : 0,
    solved_correctly: typeof stats?.solved_correctly === 'number' ? stats.solved_correctly : 0,
    score: typeof stats?.score === 'number' ? stats.score : 0,
    accuracy: typeof stats?.accuracy === 'number' && !isNaN(stats.accuracy) ? 
      Math.max(0, Math.min(100, stats.accuracy)) : 0
  };

  return (
    <div className={`h-full p-6 ${config.bg} rounded-2xl border ${config.border} ${isActive ? 'opacity-100' : 'opacity-50'} hover:shadow-md transition-all duration-300`}>
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-sm border ${config.border}`}>
          <span className="text-3xl">{config.icon}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center">{title}</h3>
      </div>
      
      {/* Stats Grid */}
      <div className="space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-2 font-medium">Questions</div>
            <div className="text-3xl font-bold text-gray-900">{safeStats.questions_attended}</div>
            <div className="text-xs text-gray-500 mt-1">Attended</div>
          </div>
          <div className="text-center bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-2 font-medium">Correct</div>
            <div className="text-3xl font-bold text-gray-900">{safeStats.solved_correctly}</div>
            <div className="text-xs text-gray-500 mt-1">Solutions</div>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-2 font-medium">Score</div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
              {safeStats.score}
            </div>
            <div className="text-xs text-gray-500 mt-1">Points</div>
          </div>
          <div className="text-center bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-2 font-medium">Accuracy</div>
            <div className="flex items-center justify-center">
              <SimpleRadialProgress
                percentage={safeStats.accuracy}
                color={config.chartColor}
                size={80}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Container component for statistics cards
const StatisticsComponent = ({ codingStats, mcqStats, hasCodingStats, hasMcqStats }) => {
  return (
    <div className="h-full">
      {hasCodingStats && (
        <StatsCard 
          title="Coding Statistics" 
          stats={codingStats || {}} 
          color="blue"
          isActive={true}
        />
      )}
      {!hasCodingStats && hasMcqStats && (
        <StatsCard 
          title="MCQ Statistics" 
          stats={mcqStats || {}} 
          color="green"
          isActive={true}
        />
      )}
      {!hasCodingStats && !hasMcqStats && (
        <StatsCard 
          title="Project Statistics" 
          stats={{ questions_attended: 0, solved_correctly: 0, score: 0, accuracy: 0 }} 
          color="purple"
          isActive={false}
        />
      )}
    </div>
  );
};

export default StatisticsComponent;