import React from 'react';
import { ModernDonutChart, ModernRadialChart } from './DashboardCharts';

// Combined Solved Questions and Statistics Component with Elevated Design
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
        bg: 'bg-white', //bg-blue-50
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

    const safeStats = {
      questions_attended: typeof stats?.questions_attended === 'number' ? stats.questions_attended : 0,
      solved_correctly: typeof stats?.solved_correctly === 'number' ? stats.solved_correctly : 0,
      score: typeof stats?.score === 'number' ? stats.score : 0,
      accuracy: typeof stats?.accuracy === 'number' && !isNaN(stats.accuracy) ? 
        Math.max(0, Math.min(100, stats.accuracy)) : 0
    };

    return (
      <div 
        className={`h-full p-6 ${config.bg} rounded-2xl ${isActive ? 'opacity-100' : 'opacity-50'} hover:shadow-lg transition-all duration-300`}
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
            className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-3"
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
              className="text-center bg-white rounded-xl p-4"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <div className="text-sm text-gray-600 mb-2 font-medium">Questions</div>
              <div className="text-3xl font-bold text-gray-900">{safeStats.questions_attended}</div>
              <div className="text-xs text-gray-500 mt-1">Attended</div>
            </div>
            <div 
              className="text-center bg-white rounded-xl p-4"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <div className="text-sm text-gray-600 mb-2 font-medium">Correct</div>
              <div className="text-3xl font-bold text-gray-900">{safeStats.solved_correctly}</div>
              <div className="text-xs text-gray-500 mt-1">Solutions</div>
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="text-center bg-white rounded-xl p-4"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <div className="text-sm text-gray-600 mb-2 font-medium">Score</div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                {safeStats.score}
              </div>
              <div className="text-xs text-gray-500 mt-1">Points</div>
            </div>
            <div 
              className="text-center bg-white rounded-xl p-4"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <div className="text-sm text-gray-600 mb-2 font-medium">Accuracy</div>
              <div className="flex items-center justify-center">
                <ModernRadialChart
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Solved Questions Card - Elevated Design */}
      <div 
        className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 h-full"
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
        <div className="flex items-center mb-3">
          <span className="text-3xl mr-4">📊</span>
          <h3 className="text-xl font-bold text-gray-900">Solved Questions</h3>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center h-full">
          {/* Donut Chart */}
          <div className="flex-shrink-0 mb-6 lg:mb-0 lg:mr-6">
            <ModernDonutChart
              data={chartData}
              centerText={`${solved}/${total}`}
              colors={['#3B82F6', '#E5E7EB']}
              height={180}
            />
          </div>
          
          {/* Progress Bars with Elevated Design */}
          <div className="flex-1 w-full space-y-4">
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
                  className="h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-700 ease-out"
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

      {/* Statistics Card - Elevated Design */}
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
    </div>
  );
};

export default CombinedSolvedStatsComponent;