import React from 'react';
import Chart from 'react-apexcharts';

// Modern Donut Chart for Overall Performance and Solved Questions
export const ModernDonutChart = ({ 
  data, 
  title, 
  centerText,
  colors = ["#3B82F6", "#E5E7EB"],
  height = 200
}) => {
  // Fix: Ensure data is always valid
  const validData = Array.isArray(data) ? data : [];
  const series = validData.length > 0 ? 
    validData.map(item => typeof item.value === 'number' && !isNaN(item.value) ? item.value : 0) : 
    [0, 1];

  const chartOptions = {
    chart: {
      type: 'donut',
      height: height,
      fontFamily: 'Inter, system-ui, sans-serif',
      toolbar: { show: false }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151',
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 700,
              color: '#111827',
              formatter: function (val) {
                return parseInt(val) || 0;
              }
            },
            total: {
              show: true,
              showAlways: true,
              label: centerText?.includes('/') ? 'Questions' : 'Total',
              fontSize: '12px',
              fontWeight: 600,
              color: '#6B7280',
              formatter: function (w) {
                if (centerText) return centerText;
                return w.globals.seriesTotals?.reduce((a, b) => (a || 0) + (b || 0), 0) || 0;
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: colors,
    legend: {
      show: false
    },
    stroke: {
      width: 2,
      colors: ['#ffffff']
    },
    // FIX: Add states to prevent 'hidden' error
    states: {
      normal: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none'
        }
      }
    },
    tooltip: {
      style: {
        fontSize: '13px',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      y: {
        formatter: function(val) {
          return (val || 0) + (title?.includes('Score') ? ' points' : '');
        }
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: height - 50
        }
      }
    }]
  };

  return (
    <Chart
      options={chartOptions}
      series={series}
      type="donut"
      height={height}
      width={height}
    />
  );
};

// Modern Radial Bar Chart for Performance/Accuracy
export const ModernRadialChart = ({ 
  percentage, 
  title, 
  subtitle,
  color = "#3B82F6",
  size = 120 
}) => {
  // Fix: Ensure percentage is always a valid number
  const validPercentage = typeof percentage === 'number' && !isNaN(percentage) ? 
    Math.max(0, Math.min(100, percentage)) : 0;

  const chartOptions = {
    chart: {
      type: 'radialBar',
      height: size,
      fontFamily: 'Inter, system-ui, sans-serif',
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '60%'
        },
        track: {
          background: '#f1f5f9',
          strokeWidth: '100%',
          margin: 5
        },
        dataLabels: {
          name: { show: false },
          value: {
            show: true,
            fontSize: '14px',
            fontWeight: 600,
            color: color,
            formatter: function(val) {
              return parseInt(val || 0) + '%';
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: [color],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    colors: [color],
    stroke: {
      lineCap: 'round'
    },
    // FIX: Add states to prevent 'hidden' error
    states: {
      normal: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none'
        }
      }
    }
  };

  return (
    <Chart
      options={chartOptions}
      series={[validPercentage]}
      type="radialBar"
      height={size}
    />
  );
};

// Modern Bar Chart for Statistics
export const ModernBarChart = ({ 
  data, 
  title, 
  horizontal = false,
  colors = ["#3B82F6"],
  height = 350
}) => {
  // Fix: Ensure data is always valid
  const validData = Array.isArray(data) ? data : [];
  const series = validData.length > 0 ? 
    validData.map(item => typeof item.value === 'number' && !isNaN(item.value) ? item.value : 0) : 
    [0];

  const chartOptions = {
    chart: {
      type: 'bar',
      height: height,
      fontFamily: 'Inter, system-ui, sans-serif',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: horizontal,
        borderRadius: 8,
        columnWidth: '60%',
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#374151']
      },
      offsetY: horizontal ? 0 : -20
    },
    xaxis: {
      categories: validData.map(item => item.label || ''),
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: '#6B7280'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: '#6B7280'
        }
      }
    },
    colors: colors,
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    // FIX: Add states to prevent 'hidden' error
    states: {
      normal: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none'
        }
      }
    },
    tooltip: {
      style: {
        fontSize: '13px',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      y: {
        formatter: function(val) {
          return val || 0;
        }
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: height - 50
        },
        plotOptions: {
          bar: {
            columnWidth: '80%'
          }
        }
      }
    }]
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <Chart
        options={chartOptions}
        series={[{
          name: title || 'Data',
          data: series
        }]}
        type="bar"
        height={height}
      />
    </div>
  );
};

// Modern Line Chart for Trends
export const ModernLineChart = ({ 
  data, 
  title,
  color = "#3B82F6",
  height = 300 
}) => {
  // Fix: Ensure data is always valid
  const validData = Array.isArray(data) ? data : [];
  const series = validData.length > 0 ? 
    validData.map(item => typeof item.value === 'number' && !isNaN(item.value) ? item.value : 0) : 
    [0];

  const chartOptions = {
    chart: {
      type: 'line',
      height: height,
      fontFamily: 'Inter, system-ui, sans-serif',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 6,
      colors: [color],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    xaxis: {
      categories: validData.map(item => item.label || ''),
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: '#6B7280'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: '#6B7280'
        }
      }
    },
    colors: [color],
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: [color],
        inverseColors: false,
        opacityFrom: 0.3,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    // FIX: Add states to prevent 'hidden' error
    states: {
      normal: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none'
        }
      }
    },
    tooltip: {
      style: {
        fontSize: '13px',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      x: {
        show: true
      },
      y: {
        formatter: function(val) {
          return val || 0;
        }
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: height - 50
        }
      }
    }]
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <Chart
        options={chartOptions}
        series={[{
          name: title || 'Progress',
          data: series
        }]}
        type="area"
        height={height}
      />
    </div>
  );
};