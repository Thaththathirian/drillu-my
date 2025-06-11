import React from 'react';
import { ModernRadialChart } from './DashboardCharts';

// Modern Statistics Card with proper alignment
const StatsCard = ({ title, stats, color = "blue" }) => {
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      icon: '💻',
      chartColor: '#3B82F6'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: '🎯',
      chartColor: '#10B981'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      icon: '📋',
      chartColor: '#8B5CF6'
    }
  };

  const config = colorConfig[color];

  // Fix: Ensure stats is always an object with valid data
  const safeStats = {
    questions_attended: typeof stats?.questions_attended === 'number' ? stats.questions_attended : 0,
    solved_correctly: typeof stats?.solved_correctly === 'number' ? stats.solved_correctly : 0,
    score: typeof stats?.score === 'number' ? stats.score : 0,
    accuracy: typeof stats?.accuracy === 'number' && !isNaN(stats.accuracy) ? 
      Math.max(0, Math.min(100, stats.accuracy)) : 0
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-300">
      {/* Header with centered icon and title */}
      <div className="flex flex-col items-center mb-4">
        <div className={`w-22 h-22 ${config.bg} rounded-full flex items-center justify-center p-3 mb-2`}>
          <span className="text-2xl">{config.icon}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 text-center">{title}</h3>
      </div>
      
      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-600 mb-1 font-medium">
            {title === 'Coding' ? 'Questions Attended' : title === 'MCQ' ? 'Questions Attended' : 'Major Attended'}
          </div>
          <div className="text-2xl font-bold text-gray-900">{safeStats.questions_attended}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-600 mb-1 font-medium">
            {title === 'Coding' ? 'Solved Correctly' : title === 'MCQ' ? 'Solved Correctly' : 'Minor Attended'}
          </div>
          <div className="text-2xl font-bold text-gray-900">{safeStats.solved_correctly}</div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-600 mb-1 font-medium">Your Score</div>
          <div className={`text-2xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
            {safeStats.score}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-600 mb-1 font-medium">Accuracy</div>
          <div className="flex items-center justify-center">
            <ModernRadialChart
              percentage={safeStats.accuracy}
              color={config.chartColor}
              size={70}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Container component for statistics cards (unchanged)
const StatsCardsComponent = ({ codingStats, mcqStats, hasCodingStats, hasMcqStats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {hasCodingStats && (
        <StatsCard 
          title="Coding" 
          stats={codingStats || {}} 
          color="blue"
        />
      )}
      {hasMcqStats && (
        <StatsCard 
          title="MCQ" 
          stats={mcqStats || {}} 
          color="green"
        />
      )}
      {/* Always show Projects card as requested */}
      <StatsCard 
        title="Projects" 
        stats={{ questions_attended: 0, solved_correctly: 0, score: 0, accuracy: 0 }} 
        color="purple"
      />
    </div>
  );
};

export default StatsCardsComponent;