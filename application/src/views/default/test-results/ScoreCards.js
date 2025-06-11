import React from "react";
import { Trophy, BarChart3, CheckCircle, Clock, Target, Percent, Award, Calendar } from "lucide-react";

const formatTimeSpent = (seconds) => {
  if (!seconds || seconds === 0) return "0s";
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
};

const ScoreCard = ({ icon: Icon, title, value, color, subtitle, description }) => (
  <div 
    className="bg-white rounded-3xl p-3 text-center hover:shadow-lg transition-all duration-300 border border-gray-100"
    style={{
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transform: "translateY(0)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
    }}
  >
    <div 
      className={`w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-3xl ${color.bg} border ${color.border || 'border-gray-200'}`}
      style={{
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
    >
      <Icon className={`${color.text} w-6 h-6`} />
    </div>
    <div className={`text-xl sm:text-2xl font-bold ${color.text} mb-1`}>
      {value}
    </div>
    <div className="text-xs sm:text-sm text-gray-600 font-medium">
      {title}
    </div>
    {subtitle && (
      <div className="text-xs text-gray-500 mt-1">
        {subtitle}
      </div>
    )}
    {description && (
      <div className="text-xs text-gray-400 mt-1">
        {description}
      </div>
    )}
  </div>
);

const ScoreCards = ({ submission, questions }) => {
  // Extract data from submission with proper fallbacks
  const percentage = parseFloat(submission?.percentage) || 0;
  const earnedScore = submission?.earned_score || 0;
  const totalScore = submission?.total_score || 0;
  const timeSpent = submission?.time_spent || 0;
  const totalQuestions = questions?.length || 0;
  const correctAnswers = submission?.correct_answers || 0;
  const submissionTime = submission?.submission_time;
  const finished = submission?.finished === "1" || submission?.finished === true;

  // Calculate additional metrics
  const accuracy = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100) : 0;
  const averageTimePerQuestion = totalQuestions > 0 ? Math.round(timeSpent / totalQuestions) : 0;

  const cards = [
    {
      icon: Trophy,
      title: "Score Earned",
      value: earnedScore,
      color: { bg: "bg-yellow-100", text: "text-yellow-600", border: "border-yellow-200" },
      subtitle: `out of ${totalScore}`,
      description: "Points achieved"
    },
    {
      icon: Percent,
      title: "Percentage",
      value: `${percentage.toFixed(1)}%`,
      color: { 
        bg: percentage >= 80 ? "bg-green-100" : percentage >= 60 ? "bg-blue-100" : percentage >= 40 ? "bg-yellow-100" : "bg-red-100",
        text: percentage >= 80 ? "text-green-600" : percentage >= 60 ? "text-blue-600" : percentage >= 40 ? "text-yellow-600" : "text-red-600",
        border: percentage >= 80 ? "border-green-200" : percentage >= 60 ? "border-blue-200" : percentage >= 40 ? "border-yellow-200" : "border-red-200"
      },
      subtitle: "Overall Score",
      description: "Performance level"
    },
    {
      icon: CheckCircle,
      title: "Correct Answers",
      value: correctAnswers,
      color: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
      subtitle: `out of ${totalQuestions}`,
      description: `${accuracy.toFixed(1)}% accuracy`
    },
    {
      icon: BarChart3,
      title: "Total Questions",
      value: totalQuestions,
      color: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-200" },
      subtitle: "Questions attempted",
      description: "All test questions"
    },
    {
      icon: Clock,
      title: "Time Spent",
      value: formatTimeSpent(timeSpent),
      color: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
      subtitle: averageTimePerQuestion > 0 ? `${averageTimePerQuestion}s avg/question` : "Total duration",
      description: "Test completion time"
    },
    {
      icon: Award,
      title: "Status",
      value: finished ? "Completed" : "In Progress",
      color: { 
        bg: finished ? "bg-purple-100" : "bg-gray-100",
        text: finished ? "text-purple-600" : "text-gray-600",
        border: finished ? "border-purple-200" : "border-gray-200"
      },
      subtitle: submissionTime ? new Date(submissionTime).toLocaleDateString('en-GB') : "Test status",
      description: finished ? "Successfully submitted" : "Test ongoing"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-6">
      {cards.map((card, index) => (
        <ScoreCard key={index} {...card} />
      ))}
    </div>
  );
};

export default ScoreCards;