import React from "react";
import Chart from "react-apexcharts";
import { PieChart, TrendingUp, Award, Target, Clock, Trophy, BarChart3 } from "lucide-react";

const PerformanceChart = ({ submission }) => {
  const percentage = parseFloat(submission?.percentage) || 0;
  const earnedScore = parseFloat(submission?.earned_score) || 0;
  const totalScore = parseFloat(submission?.total_score) || 0;
  const timeSpent = submission?.time_spent || 0; // This now uses the calculated time
  const correctAnswers = submission?.correct_answers || 0;
  const totalQuestions = submission?.total_questions || 0;

  // Format time display - Updated to handle the calculated time properly
  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return "0m";
    const timeValue = typeof seconds === 'string' ? parseInt(seconds) : seconds;
    
    if (timeValue < 60) return `${timeValue}s`;
    if (timeValue < 3600) {
      const minutes = Math.floor(timeValue / 60);
      const secs = timeValue % 60;
      return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
    }
    
    const hours = Math.floor(timeValue / 3600);
    const minutes = Math.floor((timeValue % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  // Radial chart for main performance - FIXED CENTER VALUES
  const getScoreChartOptions = () => {
    return {
      chart: { 
        type: "radialBar", 
        height: 240,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          hollow: { 
            margin: 20,  // Increased from 15 to 20
            size: "70%", // Increased from 65% to 70%
            background: 'transparent'
          },
          track: {
            background: '#E5E7EB',
            strokeWidth: '100%',
            margin: 5,
          },
          dataLabels: {
            name: { 
              offsetY: -10,  // Changed from -5 to -10
              color: "#6B7280", 
              fontSize: "14px",
              fontWeight: 600
            },
            value: {
              offsetY: 5,
              color: "#111827",
              fontSize: "32px",
              fontWeight: 700,
              formatter: (val) => `${val.toFixed(1)}%`,
            },
            total: {
              show: true,
              label: "Your Score",
              fontSize: "12px",
              fontWeight: 600,
              color: "#6B7280",
              formatter: () => `${earnedScore}/${totalScore}`,
            },
          },
        },
      },
    }}

  // Mini progress charts for breakdown - FIXED CENTER VALUES AND VISIBILITY
  const getMiniChartOptions = (value, max, color) => {
    const calculatedPercentage = max > 0 ? (value / max) * 100 : 0;
    return {
      chart: {
        type: 'radialBar',
        height: 90,
        sparkline: { enabled: true }
      },
      plotOptions: {
        radialBar: {
          hollow: { 
            size: '55%',
            background: 'transparent'
          },
          dataLabels: {
            show: true,
            name: { show: false },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 700,
              color: color,
              offsetY: 3,
              formatter: () => `${Math.round(calculatedPercentage)}`
            }
          },
          track: {
            background: '#E5E7EB',
            strokeWidth: '100%',
            margin: 3
          }
        }
      },
      colors: [color],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [color],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 0.8,
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: 'round',
        width: 6
      },
      states: {
        normal: { filter: { type: 'none' } },
        hover: { filter: { type: 'none' } },
        active: { allowMultipleDataPointsSelection: false, filter: { type: 'none' } }
      }
    };
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { level: "Outstanding", color: "text-green-600", bgColor: "bg-green-50", icon: Award, borderColor: "border-green-200" };
    if (percentage >= 80) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-50", icon: Award, borderColor: "border-green-200" };
    if (percentage >= 70) return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-50", icon: Target, borderColor: "border-blue-200" };
    if (percentage >= 60) return { level: "Average", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: Target, borderColor: "border-yellow-200" };
    if (percentage >= 40) return { level: "Progressing", color: "text-orange-600", bgColor: "bg-orange-50", icon: TrendingUp, borderColor: "border-orange-200" };
    return { level: "Learning", color: "text-purple-600", bgColor: "bg-purple-50", icon: TrendingUp, borderColor: "border-purple-200" };
  };

  const performanceLevel = getPerformanceLevel(percentage);

  return (
    <div
      className="bg-white rounded-3xl h-full flex flex-col"
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="p-4 p-sm-5 flex-1 flex flex-col">
        <div className="flex items-center mb-4">
          <PieChart className="text-purple-600 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">
            Performance Overview
          </h3>
        </div>
        
        {/* Main Radial Chart - Centered horizontally */}
        <div className="flex justify-center mb-4 flex-shrink-0">
          <Chart
            options={getScoreChartOptions()}
            series={[percentage]}
            type="radialBar"
            height={240}
          />
        </div>

        {/* Performance Summary with Fixed Layout */}
        <div className="mb-4 flex-shrink-0">
          <h5 className="font-semibold text-gray-900 mb-4 text-center flex items-center justify-center text-base">
            <BarChart3 className="text-gray-600 mr-2" size={18} />
            Performance Summary
          </h5>
          
          {/* Responsive grid - single column on mobile, two columns on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Accuracy Chart */}
            <div 
              className="text-center p-4 bg-purple-50 rounded-3xl border border-purple-200"
              style={{
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
            >
              <div className="mb-3 flex justify-center">
                <Chart
                  options={getMiniChartOptions(Math.round(percentage), 100, '#8B5CF6')}
                  series={[percentage]}
                  type="radialBar"
                  height={90}
                />
              </div>
              <div className="text-sm font-semibold text-purple-800">Accuracy</div>
              <div className="text-sm text-purple-600 font-bold">{percentage.toFixed(1)}%</div>
            </div>

            {/* Time Info */}
            <div 
              className="text-center p-4 bg-orange-50 rounded-3xl border border-orange-200"
              style={{
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Clock className="text-orange-600 w-5 h-5" />
                </div>
              </div>
              <div className="text-lg font-bold text-orange-700">{formatTime(timeSpent)}</div>
              <div className="text-sm font-semibold text-orange-800">Time Spent</div>
            </div>
          </div>
        </div>

        {/* Additional Performance Metrics in responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Questions Progress */}
          <div 
            className="p-3 bg-blue-50 rounded-2xl border border-blue-200"
            style={{
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-blue-700">{correctAnswers}/{totalQuestions}</div>
              <div className="text-sm font-semibold text-blue-800">Questions</div>
              <div className="text-xs text-blue-600">Correct answers</div>
            </div>
          </div>

          {/* Performance Level */}
          <div 
            className={`p-3 ${performanceLevel.bgColor} rounded-2xl border ${performanceLevel.borderColor}`}
            style={{
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}
          >
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <performanceLevel.icon className={`${performanceLevel.color} w-6 h-6`} />
              </div>
              <div className={`text-sm font-bold ${performanceLevel.color}`}>{performanceLevel.level}</div>
              <div className="text-xs text-gray-600">Performance</div>
            </div>
          </div>
        </div>

        {/* Summary Footer - Moved up and made more compact */}
        <div 
          className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 flex-shrink-0 mt-auto"
          style={{
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
        >
          <div className="text-center w-full">
            <div className="text-sm font-semibold text-gray-900 mb-2">
              Performance Summary
            </div>
            <div className="text-xs text-gray-600 leading-relaxed px-2">
              You scored <span className="font-semibold text-blue-600">{earnedScore} out of {totalScore}</span> points 
              with <span className="font-semibold text-green-600">{percentage.toFixed(1)}%</span> accuracy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;