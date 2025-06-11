import React from "react";
import { Lightbulb, BookOpen, Target, Clock, TrendingUp, Award, Users, Star, CheckCircle, ArrowRight } from "lucide-react";

const RecommendationCard = ({ icon: Icon, title, description, actions, color, priority }) => (
  <div 
    className={`p-6 ${color.bg} rounded-2xl hover:shadow-lg transition-all duration-300 border ${color.border} h-full flex flex-col`}
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-12 h-12 ${color.iconBg} rounded-xl flex items-center justify-center mr-4 border ${color.border}`}>
            <Icon className={`${color.icon} w-6 h-6`} />
          </div>
          <h4 className={`font-semibold ${color.text} flex-1`}>{title}</h4>
        </div>
        {priority && (
          <div className={`px-2 py-1 rounded-lg text-xs font-medium ${color.priorityBg} ${color.text}`}>
            {priority}
          </div>
        )}
      </div>
      
      <p className={`${color.description} mb-4 text-sm leading-relaxed flex-1`}>
        {description}
      </p>
      
      {actions && (
        <div className="space-y-3 mt-auto">
          <div className="text-xs font-semibold text-gray-700 mb-2">Action Steps:</div>
          {actions.slice(0, 3).map((action, index) => (
            <div key={index} className="flex items-start text-sm">
              <CheckCircle className={`${color.icon} mr-3 flex-shrink-0 mt-0.5`} size={14} />
              <span className={`${color.action} flex-1`}>{action}</span>
            </div>
          ))}
          {actions.length > 3 && (
            <div className="text-xs text-gray-500 mt-2 text-center">
              +{actions.length - 3} more suggestions
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

const StudyTipCard = ({ icon: Icon, title, tip, color }) => (
  <div 
    className={`p-4 ${color.bg} rounded-xl border ${color.border} hover:shadow-md transition-all duration-300`}
    style={{
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    }}
  >
    <div className="flex items-start">
      <Icon className={`${color.icon} mr-3 flex-shrink-0 mt-1`} size={16} />
      <div className="flex-1">
        <div className={`font-semibold ${color.text} text-sm mb-1`}>{title}</div>
        <div className={`text-xs ${color.description}`}>{tip}</div>
      </div>
    </div>
  </div>
);

const RecommendationsSection = ({ submission }) => {
  const percentage = parseFloat(submission?.percentage) || 0;
  const correctAnswers = submission?.correct_answers || 0;
  const totalQuestions = submission?.total_questions || 0;
  const timeSpent = submission?.time_spent || 0;

  // Calculate accuracy and time per question
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const avgTimePerQuestion = totalQuestions > 0 ? timeSpent / totalQuestions : 0;

  // Get recommendations based on performance
  const getRecommendations = () => {
    const recommendations = [];

    if (percentage < 70) {
      recommendations.push({
        icon: BookOpen,
        title: "Strengthen Fundamentals",
        description: "Focus on building a strong foundation in core concepts and review key topics.",
        actions: [
          "Review all incorrect answers thoroughly",
          "Create concept maps for difficult topics"
        ],
        color: {
          bg: "bg-blue-50",
          iconBg: "bg-blue-100",
          icon: "text-blue-600",
          text: "text-blue-800",
          description: "text-blue-700",
          action: "text-blue-600",
          border: "border-blue-200"
        }
      });
    }

    if (percentage < 80) {
      recommendations.push({
        icon: Target,
        title: "Increase Practice",
        description: "Regular practice will help improve your confidence and speed in solving problems.",
        actions: [
          "Take daily practice quizzes (15-20 minutes)",
          "Time yourself during practice sessions"
        ],
        color: {
          bg: "bg-green-50",
          iconBg: "bg-green-100",
          icon: "text-green-600",
          text: "text-green-800",
          description: "text-green-700",
          action: "text-green-600",
          border: "border-green-200"
        }
      });
    }

    if (avgTimePerQuestion > 120 || (timeSpent > 0 && percentage < 60)) {
      recommendations.push({
        icon: Clock,
        title: "Time Management",
        description: "Work on solving problems more efficiently and learn quick techniques.",
        actions: [
          "Practice with strict time limits",
          "Learn quick elimination techniques"
        ],
        color: {
          bg: "bg-orange-50",
          iconBg: "bg-orange-100",
          icon: "text-orange-600",
          text: "text-orange-800",
          description: "text-orange-700",
          action: "text-orange-600",
          border: "border-orange-200"
        }
      });
    }

    if (percentage >= 80) {
      recommendations.push({
        icon: Award,
        title: "Maintain Excellence",
        description: "Great performance! Continue with your current study methods and help others.",
        actions: [
          "Explore advanced topics in your subject",
          "Help peers with their studies"
        ],
        color: {
          bg: "bg-yellow-50",
          iconBg: "bg-yellow-100",
          icon: "text-yellow-600",
          text: "text-yellow-800",
          description: "text-yellow-700",
          action: "text-yellow-600",
          border: "border-yellow-200"
        }
      });
    }

    // Ensure we always have 3 recommendations
    if (recommendations.length < 3) {
      recommendations.push({
        icon: Users,
        title: "Collaborative Learning",
        description: "Join study groups and engage in peer learning. Teaching others is one of the best ways to reinforce your own understanding.",
        priority: "Recommended",
        actions: [
          "Join or create study groups",
          "Participate in discussion forums",
          "Teach concepts to fellow students",
          "Share study resources and notes",
          "Engage in group problem-solving sessions"
        ],
        color: {
          bg: "bg-purple-50",
          iconBg: "bg-purple-100",
          icon: "text-purple-600",
          text: "text-purple-800",
          description: "text-purple-700",
          action: "text-purple-600",
          border: "border-purple-200",
          priorityBg: "bg-purple-200"
        }
      });
    }

    return recommendations.slice(0, 3);
  };

  const recommendations = getRecommendations();

  // Study tips based on performance
  const getStudyTips = () => {
    const tips = [
      {
        icon: Star,
        title: "Active Recall",
        tip: "Test yourself regularly instead of just re-reading notes",
        color: {
          bg: "bg-blue-50",
          icon: "text-blue-600",
          text: "text-blue-800",
          description: "text-blue-600",
          border: "border-blue-200"
        }
      },
      {
        icon: Clock,
        title: "Pomodoro Technique",
        tip: "Study in 25-minute focused sessions with 5-minute breaks",
        color: {
          bg: "bg-green-50",
          icon: "text-green-600",
          text: "text-green-800",
          description: "text-green-600",
          border: "border-green-200"
        }
      },
      {
        icon: BookOpen,
        title: "Spaced Repetition",
        tip: "Review material at increasing intervals for better retention",
        color: {
          bg: "bg-purple-50",
          icon: "text-purple-600",
          text: "text-purple-800",
          description: "text-purple-600",
          border: "border-purple-200"
        }
      },
      {
        icon: Target,
        title: "Practice Testing",
        tip: "Take regular practice tests to identify knowledge gaps",
        color: {
          bg: "bg-orange-50",
          icon: "text-orange-600",
          text: "text-orange-800",
          description: "text-orange-600",
          border: "border-orange-200"
        }
      }
    ];

    return tips;
  };

  const studyTips = getStudyTips();

  return (
    <div
      className="bg-white rounded-3xl"
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="p-3 p-sm-5">
        <div className="flex items-center mb-6">
          <Lightbulb className="text-yellow-600 mr-3" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Personalized Recommendations
            </h3>
            <p className="text-sm text-gray-600">
              Tailored suggestions based on your performance
            </p>
          </div>
        </div>

        {/* Main Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={index}
              {...recommendation}
            />
          ))}
        </div>

        {/* Next Steps Summary */}
        <div 
          className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-200"
          style={{
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
        >
          <div className="text-center">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center justify-center text-sm">
              <TrendingUp className="text-blue-600 mr-2" size={18} />
              Your Learning Journey
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-blue-200">
                <div className="text-base font-bold text-blue-900 mb-1">
                  {percentage < 70 ? '70%' : percentage < 80 ? '80%' : '90%'}+
                </div>
                <div className="text-xs text-blue-700">Next Goal</div>
              </div>
              
              <div className="p-3 bg-white rounded-xl border border-blue-200">
                <div className="text-base font-bold text-blue-900 mb-1">
                  {percentage < 60 ? '2-3h' : percentage < 80 ? '1-2h' : '1h'}/day
                </div>
                <div className="text-xs text-blue-700">Study Time</div>
              </div>
              
              <div className="p-3 bg-white rounded-xl border border-blue-200">
                <div className="text-base font-bold text-blue-900 mb-1">
                  {Math.max(1, Math.ceil((100 - percentage) / 10))}w
                </div>
                <div className="text-xs text-blue-700">Est. Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsSection;