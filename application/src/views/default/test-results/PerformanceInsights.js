import React from "react";
import Chart from "react-apexcharts";
import { TrendingUp, Trophy, Target, CheckCircle, Star, Award, BookOpen, Users, X, Clock, BarChart3 } from "lucide-react";

const getPerformanceInsights = (percentage) => {
  if (percentage >= 90)
    return {
      level: "Outstanding",
      color: "success",
      icon: Trophy,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      advice: "Exceptional work! You have mastered this topic completely. Consider helping peers or taking advanced challenges.",
      strengths: ["Perfect understanding", "Excellent problem-solving", "High accuracy", "Consistent performance"],
      improvements: ["Maintain consistency", "Explore advanced topics", "Share knowledge with peers"]
    };
  if (percentage >= 80)
    return {
      level: "Excellent",
      color: "success",
      icon: Star,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      advice: "Great job! You have a strong grasp of the material. Keep up the excellent work and aim for perfection.",
      strengths: ["Strong conceptual understanding", "Good problem-solving skills", "Above average performance"],
      improvements: ["Focus on minor details", "Practice speed", "Review missed topics"]
    };
  if (percentage >= 70)
    return {
      level: "Good",
      color: "info",
      icon: Award,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      advice: "Good performance! You understand most concepts well. Review missed questions to identify areas for improvement.",
      strengths: ["Solid foundation", "Good effort", "Understanding of key concepts"],
      improvements: ["Review weak areas", "Practice more problems", "Strengthen fundamentals"]
    };
  if (percentage >= 60)
    return {
      level: "Average",
      color: "warning",
      icon: Target,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-200",
      advice: "Decent effort shown. Focus on understanding fundamental concepts and practice regularly to improve your score.",
      strengths: ["Basic understanding present", "Room for improvement identified"],
      improvements: ["Strengthen fundamentals", "Increase practice time", "Seek help when needed", "Regular revision"]
    };
  if (percentage >= 40)
    return {
      level: "Progressing",
      color: "warning",
      icon: BookOpen,
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200",
      advice: "You're making progress! Review the material thoroughly and consider additional study resources or tutoring.",
      strengths: ["Some concepts understood", "Learning in progress", "Effort visible"],
      improvements: ["Comprehensive review needed", "More practice required", "Consider study groups", "Regular study schedule"]
    };
  return {
    level: "Learning",
    color: "info",
    icon: Users,
    bgColor: "bg-purple-50",
    textColor: "text-purple-800",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200",
    advice: "This is a learning opportunity! Consider additional study time, review all material, and seek help from instructors.",
    strengths: ["Starting your journey", "Identifying areas to focus", "Opportunity for growth"],
    improvements: ["Complete material review", "Extra practice sessions", "Instructor consultation", "Study plan needed", "Peer support"]
  };
};

const InsightCard = ({ icon: Icon, title, items, color, className = "" }) => (
  <div 
    className={`p-6 ${color.bgColor} rounded-2xl hover:shadow-lg transition-all duration-300 border ${color.borderColor} h-full ${className}`}
    style={{
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transform: "translateY(0)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 20px 25px -5p rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
    }}
  >
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 ${color.bgColor} rounded-xl flex items-center justify-center mr-3 border ${color.borderColor}`}>
          <Icon className={`${color.iconColor} w-6 h-6`} />
        </div>
        <h5 className={`font-semibold ${color.textColor} text-lg flex-1`}>{title}</h5>
      </div>
      <div className="flex-1">
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className={`text-sm ${color.textColor} flex items-start`}>
              <CheckCircle className={`${color.iconColor} mr-3 flex-shrink-0 mt-0.5`} size={16} />
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, title, value, description, color }) => (
  <div 
    className={`text-center p-4 ${color.bgColor} rounded-2xl border ${color.borderColor} hover:shadow-md transition-all duration-300`}
    style={{
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    }}
  >
    <Icon className={`${color.iconColor} w-8 h-8 mx-auto mb-3`} />
    <div className={`text-3xl font-bold ${color.textColor}`}>{value}</div>
    <div className="text-sm text-gray-600 font-medium mt-1">{title}</div>
    {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
  </div>
);

const PerformanceInsights = ({ submission, questions }) => {
  const percentage = parseFloat(submission?.percentage) || 0;
  const insights = getPerformanceInsights(percentage);
  const totalQuestions = questions?.length || 0;
  const correctAnswers = submission?.correct_answers || 0;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const earnedScore = submission?.earned_score || 0;
  const totalScore = submission?.total_score || 0;
  const timeSpent = submission?.time_spent || 0;

  // Format time display
 const formatTime = (seconds) => {
  if (!seconds) return "0s";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(" ");
};

  return (
    <div
      className="bg-white rounded-2xl mb-6"
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="p-3 p-sm-5">
        <div className="flex items-center mb-6">
          <TrendingUp className="text-green-600 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">
            Performance Insights & Analysis
          </h3>
        </div>

        {/* Main Performance Display */}
        <div 
          className={`text-center mb-8 p-6 ${insights.bgColor} rounded-2xl border ${insights.borderColor}`}
          style={{
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
        >
          <div className="flex justify-center mb-4">
            <div className={`w-30 h-30  ${insights.bgColor} rounded-full flex items-center justify-center`}>
              <insights.icon className={`${insights.iconColor} w-10 h-10 min-w-8 min-h-8`} />
            </div>
          </div>
          <h4 className={`text-2xl font-bold ${insights.textColor} mb-2`}>
            {insights.level} Performance
          </h4>
          <div className={`text-3xl font-bold ${insights.textColor} mb-3`}>
            {percentage.toFixed(1)}%
          </div>
          <p className={`${insights.textColor} max-w-2xl mx-auto text-sm leading-relaxed`}>
            {insights.advice}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Performance Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={CheckCircle}
              title="Correct Answers"
              value={correctAnswers}
              description={`out of ${totalQuestions}`}
              color={{
                bgColor: "bg-green-50",
                iconColor: "text-green-600",
                textColor: "text-green-700",
                borderColor: "border-green-200"
              }}
            />
            <StatCard
              icon={X}
              title="Incorrect Answers"
              value={incorrectAnswers}
              description={`out of ${totalQuestions}`}
              color={{
                bgColor: "bg-red-50",
                iconColor: "text-red-600",
                textColor: "text-red-700",
                borderColor: "border-red-200"
              }}
            />
            <StatCard
              icon={Trophy}
              title="Score Earned"
              value={`${earnedScore}/${totalScore}`}
              description="Points achieved"
              color={{
                bgColor: "bg-yellow-50",
                iconColor: "text-yellow-600",
                textColor: "text-yellow-700",
                borderColor: "border-yellow-200"
              }}
            />
            <StatCard
              icon={Clock}
              title="Time Spent"
              value={formatTime(timeSpent)}
              description="Total duration"
              color={{
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600",
                textColor: "text-blue-700",
                borderColor: "border-blue-200"
              }}
            />
          </div>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InsightCard
            icon={Star}
            title="Your Strengths"
            items={insights.strengths}
            color={{
              bgColor: "bg-green-50",
              textColor: "text-green-800",
              iconColor: "text-green-600",
              borderColor: "border-green-200"
            }}
          />
          <InsightCard
            icon={TrendingUp}
            title="Areas for Growth"
            items={insights.improvements}
            color={{
              bgColor: "bg-blue-50",
              textColor: "text-blue-800",
              iconColor: "text-blue-600",
              borderColor: "border-blue-200"
            }}
          />
        </div>

        {/* Performance Benchmark */}
        <div 
          className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200"
          style={{
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
        >
          <h5 className="font-semibold text-purple-900 mb-4 flex items-center">
            <BarChart3 className="text-purple-600 mr-2" size={20} />
            Performance Benchmark Scale
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            <div className="p-3 bg-green-100 rounded-xl border border-green-200">
              <div className="text-sm text-green-700 font-semibold">Outstanding</div>
              <div className="text-xs text-green-600 mt-1">90-100%</div>
            </div>
            <div className="p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="text-sm text-green-600 font-semibold">Excellent</div>
              <div className="text-xs text-green-500 mt-1">80-89%</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-600 font-semibold">Good</div>
              <div className="text-xs text-blue-500 mt-1">70-79%</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="text-sm text-yellow-600 font-semibold">Average</div>
              <div className="text-xs text-yellow-500 mt-1">60-69%</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
              <div className="text-sm text-orange-600 font-semibold">Learning</div>
              <div className="text-xs text-orange-500 mt-1">Below 60%</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-xl font-semibold ${insights.bgColor} ${insights.textColor} border ${insights.borderColor}`}>
              <insights.icon className={`${insights.iconColor} mr-2`} size={16} />
              Your Level: {insights.level}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsights;