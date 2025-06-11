import React, { useState, useEffect } from 'react';

// Enhanced Contribution Calendar with vertical weekly layout and elevated design
const ContributionCalendar = ({ monthlyContributions, currentYear, onYearChange, contributionType }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Always use current year as base for year selection
  const actualCurrentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => actualCurrentYear - i);
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay(); // 0 = Sunday
  };

  const getContributionData = (year, month) => {
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const contrib = monthlyContributions?.find(c => c.month === monthKey && c.type === contributionType);
    return contrib ? parseInt(contrib.total_time_spent) || 0 : 0;
  };

  const getContributionColor = (timeSpent) => {
    if (timeSpent === 0) return "bg-gray-100";
    else if (timeSpent < 2) return "bg-green-200";
    else if (timeSpent < 5) return "bg-green-400";
    else if (timeSpent < 10) return "bg-green-600";
    else return "bg-green-800";
  };

  const generateWeeklyCalendar = () => {
    return months.map((month, monthIndex) => {
      const daysInMonth = getDaysInMonth(currentYear, monthIndex);
      const firstDayOfWeek = getFirstDayOfMonth(currentYear, monthIndex);
      const monthContribution = getContributionData(currentYear, monthIndex);
      
      const weeks = [];
      let currentWeek = [];
      
      // Add empty cells for days before the first day of month
      for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek.push(null);
      }
      
      // Add actual days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dailyContribution = Math.floor(monthContribution / daysInMonth);
        currentWeek.push({
          day,
          contribution: dailyContribution,
          date: `${month} ${day}, ${currentYear}`
        });
        
        // If week is complete (7 days) or it's the last day of month
        if (currentWeek.length === 7 || day === daysInMonth) {
          // Fill remaining slots if needed
          while (currentWeek.length < 7) {
            currentWeek.push(null);
          }
          weeks.push([...currentWeek]);
          currentWeek = [];
        }
      }
      
      return (
        <div key={monthIndex} className="flex flex-col items-center">
          <div className="text-xs text-gray-600 mb-2 font-semibold">{month}</div>
          
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((day, index) => (
              <div key={index} className="w-3 h-3 flex items-center justify-center">
                <span className="text-xs text-gray-500 font-medium">{day}</span>
              </div>
            ))}
          </div>
          
          {/* Weeks arranged vertically */}
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((dayData, dayIndex) => (
                  <div 
                    key={dayIndex}
                    className={`w-3 h-3 rounded-md transition-all duration-200 hover:scale-110 ${
                      dayData 
                        ? getContributionColor(dayData.contribution) + ' cursor-pointer'
                        : 'bg-transparent'
                    }`}
                    style={{
                      boxShadow: dayData && dayData.contribution > 0 
                        ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' 
                        : 'none'
                    }}
                    title={dayData ? `${dayData.date}: ${dayData.contribution} hours` : ''}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 font-medium">Less</span>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-gray-100 rounded-md"></div>
            <div className="w-3 h-3 bg-green-200 rounded-md"></div>
            <div className="w-3 h-3 bg-green-400 rounded-md"></div>
            <div className="w-3 h-3 bg-green-600 rounded-md"></div>
            <div className="w-3 h-3 bg-green-800 rounded-md"></div>
          </div>
          <span className="text-sm text-gray-600 font-medium">More</span>
        </div>
        <select 
          className="text-sm rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
          style={{
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          value={currentYear}
          onChange={(e) => onYearChange(e.target.value)}
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      <div 
        className="relative overflow-x-auto bg-gray-50 rounded-2xl p-4"
        style={{
          boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="flex justify-between space-x-4 min-w-max">
          {generateWeeklyCalendar()}
        </div>
      </div>
    </div>
  );
};

// Main Contributions Component with elevated card design
const ContributionsComponent = ({ contributions, monthlyContributions }) => {
  const [contributionType, setContributionType] = useState('codings');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [filteredData, setFilteredData] = useState({
    total_days: 0,
    total_hours: 0,
    average_time: 0
  });

  const contributionTypes = [
    { value: 'codings', label: 'Codings' },
    { value: 'mcq', label: 'MCQ' },
    { value: 'projects', label: 'Projects' }
  ];

  useEffect(() => {
    if (monthlyContributions && monthlyContributions.length > 0) {
      const filtered = monthlyContributions.filter(contrib => 
        contrib.type === contributionType && 
        contrib.month.startsWith(selectedYear)
      );
      
      const totalHours = filtered.reduce((sum, contrib) => sum + (parseInt(contrib.total_time_spent) || 0), 0);
      const totalDays = filtered.length;
      const averageTime = totalDays > 0 ? (totalHours / totalDays).toFixed(2) : 0;
      
      setFilteredData({
        total_days: totalDays,
        total_hours: totalHours,
        average_time: averageTime
      });
    } else {
      setFilteredData({
        total_days: contributions?.total_days || 0,
        total_hours: contributions?.total_hours || 0,
        average_time: contributions?.average_time || 0
      });
    }
  }, [contributionType, selectedYear, monthlyContributions, contributions]);

  const handleTypeChange = (newType) => {
    setContributionType(newType);
  };

  const handleYearChange = (newYear) => {
    setSelectedYear(newYear);
  };

  return (
    <div 
      className="bg-white rounded-2xl p-4 hover:shadow-lg transition-all duration-300"
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
        <h3 className="text-xl font-bold text-gray-900">Contributions</h3>
        <select 
          className="text-sm rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
          style={{
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          value={contributionType}
          onChange={(e) => handleTypeChange(e.target.value)}
        >
          {contributionTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      
      {/* Contribution Stats with Elevated Design */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div 
          className="text-center p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors duration-200"
          style={{
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div className="text-2xl font-bold text-blue-600">{filteredData.total_days} days</div>
          <div className="text-sm text-gray-600 font-medium mt-1">Total Contribution</div>
        </div>
        <div 
          className="text-center p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors duration-200"
          style={{
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div className="text-2xl font-bold text-green-600">{filteredData.total_hours} Hours</div>
          <div className="text-sm text-gray-600 font-medium mt-1">Total Hours Spent</div>
        </div>
        <div 
          className="text-center p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors duration-200"
          style={{
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div className="text-2xl font-bold text-purple-600">{filteredData.average_time} Hours per day</div>
          <div className="text-sm text-gray-600 font-medium mt-1">Average Time</div>
        </div>
      </div>

      {/* Contribution Calendar */}
      <ContributionCalendar 
        monthlyContributions={monthlyContributions}
        currentYear={selectedYear}
        onYearChange={handleYearChange}
        contributionType={contributionType}
      />
    </div>
  );
};

export default ContributionsComponent;