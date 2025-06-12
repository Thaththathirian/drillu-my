import React from 'react';
import { ModernDonutChart, ModernRadialChart } from './DashboardCharts';

// Combined Solved Questions and Statistics Component with Both Coding and MCQ Stats
const CombinedSolvedStatsComponent = ({ 
  solvedQuestions, 
  difficultyLevels, 
  codingStats, 
  mcqStats, 
  hasCodingStats, 
  hasMcqStats 
}) => {
  // Safe data extraction for solved questions
  const total = solvedQuestions?.total?.total || 0;
  const solved = solvedQuestions?.total?.solved || 0;
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

  const chartData = total > 0 ? [
    { value: solved, label: 'Solved' },
    { value: Math.max(0, total - solved), label: 'Remaining' }
  ] : [
    { value: 0, label: 'Solved' },
    { value: 1, label: 'Remaining' }
  ];

  // Enhanced Statistics Card Component with Elevated Design
  const StatsCard = ({ title, stats, color = "blue", isActive = true }) => {
    const colorConfig = {
      blue: {
        gradient: 'from-blue-500 to-blue-600',
        bg: 'bg-white',
        text: 'text-blue-600',
        icon: '💻',
        chartColor: '#3B82F6'
      },
      green: {
        gradient: 'from-green-500 to-green-600',
        bg: 'bg-white',
        text: 'text-green-600',
        icon: '🎯',
        chartColor: '#10B981'
      },
      purple: {
        gradient: 'from-purple-500 to-purple-600',
        bg: 'bg-white',
        text: 'text-purple-600',
        icon: '📋',
        chartColor: '#8B5CF6'
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
      <div 
        className={`h-full p-6 ${config.bg} rounded-2xl ${isActive ? 'opacity-100' : 'opacity-50'} hover:shadow-lg transition-all duration-300 border border-gray-100`}
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transform: 'translateY(0)',
        }}
        onMouseEnter={(e) => {
          if (isActive) {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }
        }}
        onMouseLeave={(e) => {
          if (isActive) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div 
            className={`w-16 h-16 ${color === 'blue' ? 'bg-blue-50' : color === 'green' ? 'bg-green-50' : 'bg-purple-50'} rounded-2xl flex items-center justify-center mb-3`}
            style={{
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <span className="text-3xl">{config.icon}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">{title}</h3>
        </div>
        
        {/* Stats Grid */}
        <div className="space-y-6">
          {/* Top Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`text-center ${color === 'blue' ? 'bg-blue-50' : color === 'green' ? 'bg-green-50' : 'bg-purple-50'} rounded-xl p-4`}
              style={{
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="text-xs text-gray-600 mb-2 font-medium">Questions Attended</div>
              <div className="text-2xl font-bold text-gray-900">{safeStats.questions_attended}</div>
            </div>
            <div 
              className={`text-center ${color === 'blue' ? 'bg-blue-50' : color === 'green' ? 'bg-green-50' : 'bg-purple-50'} rounded-xl p-4`}
              style={{
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="text-xs text-gray-600 mb-2 font-medium">Solved Correctly</div>
              <div className="text-2xl font-bold text-gray-900">{safeStats.solved_correctly}</div>
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`text-center ${color === 'blue' ? 'bg-blue-50' : color === 'green' ? 'bg-green-50' : 'bg-purple-50'} rounded-xl p-4 grid items-start`}
              style={{
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="text-xs text-gray-600  font-medium">Your Score</div>
              <div className={`text-2xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent self-center`}>
                {safeStats.score}
              </div>
            </div>
            <div 
              className={`text-center ${color === 'blue' ? 'bg-blue-50' : color === 'green' ? 'bg-green-50' : 'bg-purple-50'} rounded-xl p-4 flex flex-col items-center justify-center`}
              style={{
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="text-xs text-gray-600 mb-2 font-medium">Accuracy</div>
              <ModernRadialChart
                percentage={safeStats.accuracy}
                color={config.chartColor}
                size={60}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Solved Questions Chart - Full Width Row */}
      <div 
        className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transform: 'translateY(0)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="flex items-center">
            <div 
              className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mr-4"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Solved Questions Overview</h3>
          </div>

          {/* Progress Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              className="text-center bg-indigo-50 rounded-xl p-4"
              style={{
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="text-lg font-bold text-indigo-600">{solved}</div>
              <div className="text-xs text-gray-600">Solved</div>
            </div>
            <div 
              className="text-center bg-gray-50 rounded-xl p-4"
              style={{
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="text-lg font-bold text-gray-600">{total - solved}</div>
              <div className="text-xs text-gray-600">Remaining</div>
            </div>
            <div 
              className="text-center bg-green-50 rounded-xl p-4 col-span-2 lg:col-span-1"
              style={{
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="text-lg font-bold text-green-600">{percentage}%</div>
              <div className="text-xs text-gray-600">Complete</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut Chart */}
          <div className="flex flex-col items-center justify-center">
            <ModernDonutChart 
              data={chartData}
              centerText={`${percentage}%`}
              colors={['#10B981', '#E5E7EB']}
              size={200}
            />
          </div>

          {/* Difficulty Levels */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 text-center lg:text-left">Difficulty Breakdown</h4>
            
            {/* Easy */}
            <div 
              className="bg-gray-50 rounded-xl p-4"
              style={{
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Easy</span>
                <span className="text-sm font-bold text-gray-900">
                  {difficultyLevels?.easy?.solved || 0}/{difficultyLevels?.easy?.total || 0}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${difficultyLevels?.easy?.total > 0 ? (difficultyLevels.easy.solved / difficultyLevels.easy.total) * 100 : 0}%`,
                    boxShadow: '0 2px 4px 0 rgba(34, 197, 94, 0.3)'
                  }}
                ></div>
              </div>
            </div>
            
            {/* Medium */}
            <div 
              className="bg-gray-50 rounded-xl p-4"
              style={{
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Medium</span>
                <span className="text-sm font-bold text-gray-900">
                  {difficultyLevels?.medium?.solved || 0}/{difficultyLevels?.medium?.total || 0}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${difficultyLevels?.medium?.total > 0 ? (difficultyLevels.medium.solved / difficultyLevels.medium.total) * 100 : 0}%`,
                    boxShadow: '0 2px 4px 0 rgba(251, 146, 60, 0.3)'
                  }}
                ></div>
              </div>
            </div>
            
            {/* Hard */}
            <div 
              className="bg-gray-50 rounded-xl p-4"
              style={{
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Hard</span>
                <span className="text-sm font-bold text-gray-900">
                  {difficultyLevels?.hard?.solved || 0}/{difficultyLevels?.hard?.total || 0}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${difficultyLevels?.hard?.total > 0 ? (difficultyLevels.hard.solved / difficultyLevels.hard.total) * 100 : 0}%`,
                    boxShadow: '0 2px 4px 0 rgba(239, 68, 68, 0.3)'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards Row - Coding and MCQ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coding Statistics */}
        <StatsCard 
          title="Coding Statistics" 
          stats={codingStats || {}} 
          color="blue"
          isActive={hasCodingStats}
        />
        
        {/* MCQ Statistics */}
        <StatsCard 
          title="MCQ Statistics" 
          stats={mcqStats || {}} 
          color="green"
          isActive={hasMcqStats}
        />
      </div>
    </div>
  );
};

export default CombinedSolvedStatsComponent;