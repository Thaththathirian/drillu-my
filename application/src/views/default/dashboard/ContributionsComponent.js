import React, { useState } from 'react';
import ApexCharts from 'react-apexcharts';
import { Calendar, Clock, TrendingUp, Activity, BarChart3 } from 'lucide-react';

const ContributionsComponent = ({ contributions }) => {
  const [chartType, setChartType] = useState('bar');

  // Safe data extraction with proper number formatting
  const totalDays = Math.round(contributions?.total_days || 0);
  const totalHours = parseFloat((contributions?.total_hours || 0).toFixed(2));
  const averageTime = parseFloat((contributions?.average_time || 0).toFixed(2));
  const monthlyContributions = contributions?.monthly_contributions || [];
  const currentYear = contributions?.year || new Date().getFullYear().toString();

  // Format time from hours to readable format
  const formatHours = (hours) => {
    if (!hours || hours === 0) return '0h';
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  // Format time from seconds to readable format
  const formatSeconds = (seconds) => {
    if (!seconds || seconds === 0) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Generate monthly data for last 6 months
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const lastSixMonths = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthNumber = String(monthIndex + 1).padStart(2, '0');
      const monthKey = `${currentYear}-${monthNumber}`;
      
      const monthData = monthlyContributions.find(contrib => contrib.month === monthKey);
      
      lastSixMonths.push({
        month: months[monthIndex],
        hours: monthData ? parseFloat((parseInt(monthData.total_time_spent) / 3600).toFixed(2)) : 0,
        days: monthData ? parseInt(monthData.days_contributed) : 0
      });
    }
    
    return lastSixMonths;
  };

  const monthlyData = generateMonthlyData();

  // Chart options
  const chartOptions = {
    chart: {
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 },
      fontFamily: 'inherit'
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 3,
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    legend: { show: false },
    tooltip: {
      style: {
        fontSize: '12px',
        fontFamily: 'inherit'
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    colors: ['#3B82F6'],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '60%'
      }
    },
    xaxis: {
      categories: monthlyData.map(item => item.month),
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: '#6B7280'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6B7280'
        },
        formatter: (val) => `${val}h`
      }
    },
    dataLabels: { enabled: false }
  };

  const lineChartOptions = {
    ...chartOptions,
    colors: ['#10B981'],
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    markers: {
      size: 5,
      colors: ['#10B981'],
      strokeColors: '#fff',
      strokeWidth: 2
    },
    xaxis: {
      categories: monthlyData.map(item => item.month),
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: '#6B7280'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6B7280'
        },
        formatter: (val) => `${val}d`
      }
    },
    dataLabels: { enabled: false }
  };

  // Current month data
  const currentMonthData = monthlyContributions.find(contrib => {
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    return contrib.month === `${currentYear}-${currentMonth}`;
  });
  
  const currentMonthTime = currentMonthData ? 
    formatSeconds(parseInt(currentMonthData.total_time_spent)) : '0m';

  return (
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
            className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mr-4 border border-indigo-100"
            style={{
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <Activity className="text-indigo-600 w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Practice Contributions</h3>
            <p className="text-gray-600 text-sm">Your learning activity over time</p>
          </div>
        </div>

        {/* Chart Type Toggle */}
        <div className="flex rounded-xl border border-gray-300 overflow-hidden">
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 text-sm font-medium transition-colors flex items-center ${
              chartType === 'bar' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Hours
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 text-sm font-medium transition-colors flex items-center ${
              chartType === 'line' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Days
          </button>
        </div>
      </div>

      {/* Stats Cards Grid - Matching your existing style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div 
          className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100"
          style={{
            boxShadow: '0 2px 4px 0 rgba(59, 130, 246, 0.1)'
          }}
        >
          <Calendar className="text-blue-600 w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{totalDays}</div>
          <div className="text-xs text-blue-700 font-medium">Active Days</div>
        </div>
        
        <div 
          className="bg-green-50 rounded-xl p-4 text-center border border-green-100"
          style={{
            boxShadow: '0 2px 4px 0 rgba(34, 197, 94, 0.1)'
          }}
        >
          <Clock className="text-green-600 w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{formatHours(totalHours)}</div>
          <div className="text-xs text-green-700 font-medium">Total Time</div>
        </div>
        
        <div 
          className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100"
          style={{
            boxShadow: '0 2px 4px 0 rgba(147, 51, 234, 0.1)'
          }}
        >
          <TrendingUp className="text-purple-600 w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{formatHours(averageTime)}</div>
          <div className="text-xs text-purple-700 font-medium">Average</div>
        </div>
        
        <div 
          className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100"
          style={{
            boxShadow: '0 2px 4px 0 rgba(251, 146, 60, 0.1)'
          }}
        >
          <Activity className="text-orange-600 w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">{currentMonthTime}</div>
          <div className="text-xs text-orange-700 font-medium">This Month</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-64 sm:h-80">
        {chartType === 'bar' ? (
          <ApexCharts
            options={barChartOptions}
            series={[{
              name: 'Practice Hours',
              data: monthlyData.map(item => item.hours)
            }]}
            type="bar"
            height="100%"
          />
        ) : (
          <ApexCharts
            options={lineChartOptions}
            series={[{
              name: 'Active Days',
              data: monthlyData.map(item => item.days)
            }]}
            type="line"
            height="100%"
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
          <div className="mb-2 sm:mb-0">
            <span className="font-medium">Last 6 months activity</span> • 
            <span className="ml-1">Track your daily practice progress</span>
          </div>
          <div className="text-xs text-gray-500">
            {chartType === 'bar' ? 'Hours practiced per month' : 'Days active per month'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionsComponent;