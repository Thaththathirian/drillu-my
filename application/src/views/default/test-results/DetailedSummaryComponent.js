import React from "react";
import Chart from "react-apexcharts";
import { FileText, Clock, Award, Shield, TrendingUp, Users, Target, BarChart3 } from "lucide-react";

const DetailedSummaryComponent = ({ submission, questions, solutions, test }) => {
  // Calculate detailed metrics
  const metrics = React.useMemo(() => {
    if (!questions || !solutions || !submission) return null;

    const totalQuestions = questions.length;
    const totalTime = parseInt(submission.time_spent) || 0;
    const totalScore = parseInt(submission.total_score) || 0;
    const earnedScore = parseInt(submission.earned_score) || 0;
    const percentage = parseFloat(submission.percentage) || 0;
    const tabChanges = parseInt(submission.tab_changes) || 0;
    const testDuration = parseInt(test?.duration) || 30; // in minutes

    // Process solutions to get detailed stats
    const solutionsArray = Array.isArray(solutions) ? solutions : Object.values(solutions);
    const correctAnswers = solutionsArray.filter(s => parseInt(s.score) > 0).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    
    // Time analysis
    const timePerQuestion = solutionsArray.map(s => parseInt(s.time_spent) || 0);
    const avgTimePerQuestion = timePerQuestion.reduce((a, b) => a + b, 0) / timePerQuestion.length;
    const maxTimeOnQuestion = Math.max(...timePerQuestion);
    const minTimeOnQuestion = Math.min(...timePerQuestion);
    
    // Efficiency metrics
    const timeEfficiency = (totalTime / (testDuration * 60)) * 100; // percentage of total time used
    const scoreEfficiency = (earnedScore / totalScore) * 100;
    const answerAccuracy = (correctAnswers / totalQuestions) * 100;
    
    // Security score (based on tab changes)
    const securityScore = Math.max(0, 100 - (tabChanges * 10));

    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      totalTime,
      totalScore,
      earnedScore,
      percentage,
      tabChanges,
      avgTimePerQuestion,
      maxTimeOnQuestion,
      minTimeOnQuestion,
      timeEfficiency,
      scoreEfficiency,
      answerAccuracy,
      securityScore,
      timePerQuestion
    };
  }, [submission, questions, solutions, test]);

  if (!metrics) return null;

  // Efficiency gauge chart
  const getEfficiencyChartOptions = () => {
    return {
      chart: {
        type: 'radialBar',
        height: 200,
        fontFamily: 'Inter, system-ui, sans-serif',
        toolbar: { show: false }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          hollow: {
            margin: 15,
            size: '60%'
          },
          track: {
            background: '#f1f5f9',
            strokeWidth: '100%',
            margin: 5
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: '12px',
              fontWeight: 600,
              color: '#6B7280'
            },
            value: {
              show: true,
              fontSize: '20px',
              fontWeight: 700,
              color: '#111827',
              formatter: function(val) {
                return parseInt(val) + '%';
              }
            }
          }
        }
      },
      labels: ['Score', 'Time', 'Security'],
      colors: ['#10B981', '#3B82F6', '#F59E0B'],
      legend: {
        show: true,
        position: 'bottom',
        fontSize: '12px',
        fontWeight: 600
      },
      states: {
        normal: { filter: { type: 'none' } },
        hover: { filter: { type: 'none' } },
        active: { allowMultipleDataPointsSelection: false, filter: { type: 'none' } }
      }
    };
  };

  // Performance comparison chart
  const getComparisonChartOptions = () => {
    return {
      chart: {
        type: 'radar',
        height: 300,
        fontFamily: 'Inter, system-ui, sans-serif',
        toolbar: { show: false }
      },
      xaxis: {
        categories: ['Accuracy', 'Speed', 'Consistency', 'Security', 'Efficiency']
      },
      yaxis: {
        show: false,
        min: 0,
        max: 100
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: '#e0e7ff',
            connectorColors: '#e0e7ff'
          }
        }
      },
      colors: ['#3B82F6'],
      markers: {
        size: 4,
        colors: ['#3B82F6'],
        strokeColors: '#ffffff',
        strokeWidth: 2
      },
      fill: {
        opacity: 0.2
      },
      states: {
        normal: { filter: { type: 'none' } },
        hover: { filter: { type: 'none' } },
        active: { allowMultipleDataPointsSelection: false, filter: { type: 'none' } }
      }
    };
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div 
      className={`p-4 ${color.bg} rounded-xl hover:shadow-md transition-all duration-300`}
      style={{
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
    >
      <div className="flex items-center mb-3">
        <div className={`w-10 h-10 ${color.iconBg} rounded-xl flex items-center justify-center mr-3`}>
          <Icon className={`${color.icon} w-5 h-5`} />
        </div>
        <div>
          <div className={`text-lg font-bold ${color.text}`}>{value}</div>
          <div className="text-xs text-gray-600 font-medium">{title}</div>
        </div>
      </div>
      {subtitle && (
        <div className="text-xs text-gray-500">{subtitle}</div>
      )}
    </div>
  );

  return (
    <div
      className="bg-white rounded-2xl mb-6"
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="p-3 p-sm-5">
        <div className="flex items-center mb-6">
          <BarChart3 className="text-indigo-600 mr-3" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Detailed Performance Summary
            </h3>
            <p className="text-sm text-gray-600">
              Comprehensive analysis of your test performance
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={Target}
            title="Answer Accuracy"
            value={`${metrics.answerAccuracy.toFixed(1)}%`}
            subtitle={`${metrics.correctAnswers}/${metrics.totalQuestions} correct`}
            color={{
              bg: "bg-green-50",
              iconBg: "bg-green-100",
              icon: "text-green-600",
              text: "text-green-800"
            }}
          />
          <MetricCard
            icon={Clock}
            title="Time Efficiency"
            value={`${metrics.timeEfficiency.toFixed(1)}%`}
            subtitle={`${Math.round(metrics.totalTime / 60)}m of allowed time used`}
            color={{
              bg: "bg-blue-50",
              iconBg: "bg-blue-100",
              icon: "text-blue-600",
              text: "text-blue-800"
            }}
          />
          <MetricCard
            icon={Award}
            title="Score Efficiency"
            value={`${metrics.scoreEfficiency.toFixed(1)}%`}
            subtitle={`${metrics.earnedScore}/${metrics.totalScore} points earned`}
            color={{
              bg: "bg-purple-50",
              iconBg: "bg-purple-100",
              icon: "text-purple-600",
              text: "text-purple-800"
            }}
          />
          <MetricCard
            icon={Shield}
            title="Security Score"
            value={`${metrics.securityScore}%`}
            subtitle={`${metrics.tabChanges} tab changes detected`}
            color={{
              bg: metrics.tabChanges === 0 ? "bg-green-50" : "bg-red-50",
              iconBg: metrics.tabChanges === 0 ? "bg-green-100" : "bg-red-100",
              icon: metrics.tabChanges === 0 ? "text-green-600" : "text-red-600",
              text: metrics.tabChanges === 0 ? "text-green-800" : "text-red-800"
            }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Efficiency Gauges */}
          <div 
            className="bg-gray-50 rounded-xl p-4"
            style={{
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}
          >
            <h5 className="font-semibold text-gray-900 mb-4 text-center">Efficiency Metrics</h5>
            <Chart
              options={getEfficiencyChartOptions()}
              series={[metrics.scoreEfficiency, metrics.timeEfficiency, metrics.securityScore]}
              type="radialBar"
              height={200}
            />
          </div>

          {/* Performance Radar */}
          <div 
            className="bg-gray-50 rounded-xl p-4"
            style={{
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}
          >
            <h5 className="font-semibold text-gray-900 mb-4 text-center">Performance Profile</h5>
            <Chart
              options={getComparisonChartOptions()}
              series={[{
                name: 'Your Performance',
                data: [
                  metrics.answerAccuracy,
                  100 - metrics.timeEfficiency, // Speed (inverse of time used)
                  Math.max(0, 100 - Math.abs(metrics.maxTimeOnQuestion - metrics.minTimeOnQuestion)), // Consistency
                  metrics.securityScore,
                  metrics.scoreEfficiency
                ]
              }]}
              type="radar"
              height={300}
            />
          </div>
        </div>

        {/* Time Analysis Summary */}
        <div 
          className="bg-gray-50 rounded-xl p-6"
          style={{
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
        >
          <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="text-blue-600 mr-2" size={20} />
            Time Management Analysis
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(metrics.avgTimePerQuestion)}s</div>
              <div className="text-sm text-gray-600">Avg per Question</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.minTimeOnQuestion}s</div>
              <div className="text-sm text-gray-600">Fastest Question</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.maxTimeOnQuestion}s</div>
              <div className="text-sm text-gray-600">Slowest Question</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(metrics.totalTime / 60)}m {metrics.totalTime % 60}s
              </div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div 
          className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl"
          style={{
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
        >
          <h5 className="font-semibold text-indigo-900 mb-4 flex items-center">
            <Award className="text-indigo-600 mr-2" size={20} />
            Performance Insights
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <p className="text-indigo-800">
                <span className="font-semibold">Strongest Area:</span> {
                  metrics.answerAccuracy >= 80 ? 'Accuracy' :
                  metrics.timeEfficiency <= 80 ? 'Time Management' :
                  metrics.securityScore >= 90 ? 'Focus & Discipline' : 'Consistency'
                }
              </p>
              <p className="text-indigo-800">
                <span className="font-semibold">Overall Grade:</span> {
                  metrics.percentage >= 90 ? 'A+ (Outstanding)' :
                  metrics.percentage >= 80 ? 'A (Excellent)' :
                  metrics.percentage >= 70 ? 'B (Good)' :
                  metrics.percentage >= 60 ? 'C (Average)' : 'D (Needs Improvement)'
                }
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-indigo-800">
                <span className="font-semibold">Time Management:</span> {
                  metrics.timeEfficiency <= 60 ? 'Excellent - Used time efficiently' :
                  metrics.timeEfficiency <= 90 ? 'Good - Balanced approach' : 'Could improve - Consider pacing'
                }
              </p>
              <p className="text-indigo-800">
                <span className="font-semibold">Session Quality:</span> {
                  metrics.tabChanges === 0 ? 'Perfect - No distractions' :
                  metrics.tabChanges <= 3 ? 'Good - Minor distractions' : 'Poor - Many distractions'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedSummaryComponent;