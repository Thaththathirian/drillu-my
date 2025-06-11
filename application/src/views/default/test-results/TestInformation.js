import React from "react";
import Chart from "react-apexcharts";
import { Info, BookOpen, Layers, Clock, Calendar, Send, Trophy, Target, Users, TrendingUp, FileText, Award } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toLocaleTimeString(); // This keeps the original time format with seconds and AM/PM
    return `${day}/${month}/${year} ${time}`;
  } catch {
    return dateString;
  }
};

const formatTime = (seconds) => {
  if (!seconds || seconds === 0) return "0s";
  const timeValue = typeof seconds === 'string' ? parseInt(seconds) : seconds;
  
  if (timeValue < 60) return `${timeValue}s`;
  if (timeValue < 3600) {
    const mins = Math.floor(timeValue / 60);
    const secs = timeValue % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  
  const hours = Math.floor(timeValue / 3600);
  const mins = Math.floor((timeValue % 3600) / 60);
  const secs = timeValue % 60;
  
  if (secs > 0) return `${hours}h ${mins}m ${secs}s`;
  if (mins > 0) return `${hours}h ${mins}m`;
  return `${hours}h`;
};

const InfoRow = ({ icon: Icon, label, value, color = "text-blue-600" }) => (
  <div 
    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
    style={{
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    }}
  >
    <Icon className={`${color} mt-0.5 flex-shrink-0`} size={14} />
    <div className="min-w-0 flex-1">
      <span className="text-xs font-medium text-gray-700">{label}:</span>
      <span className="ml-2 text-xs text-gray-900 break-words">{value}</span>
    </div>
  </div>
);

const TestInformation = ({ test, course, module, submission }) => {
  // Calculate test statistics with proper data extraction
  const duration = test?.duration || 30; // Default 30 minutes
  const totalQuestions = submission?.total_questions || 0;
  const totalMarks = test?.total_marks || submission?.total_score || 0;
  const earnedMarks = submission?.earned_score || 0;
  const percentage = parseFloat(submission?.percentage) || 0;
  const correctAnswers = submission?.correct_answers || 0;
  const timeSpent = submission?.time_spent || 0;
  const questionsAttempted = submission?.questions_attempted || totalQuestions;
  const averageTimePerQuestion = submission?.average_time_per_question || 
    (questionsAttempted > 0 ? Math.round(timeSpent / questionsAttempted) : 0);
  const finished = submission?.finished === "1" || submission?.finished === true;

  return (
    <div
      className="bg-white rounded-3xl p-3 p-sm-5 h-full"
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="flex items-center mb-6">
        <Info className="text-blue-600 mr-3" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">
          Test Information & Details
        </h3>
      </div>

      <div className="space-y-6">
        {/* Combined Test Details and Timeline */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="text-blue-500 mr-2" size={18} />
            Test Details & Timeline
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Test Details Column */}
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">Test Information</h5>
              <InfoRow
                icon={FileText}
                label="Test Title"
                value={test?.title || "Sample Test"}
                color="text-blue-600"
              />
              <InfoRow
                icon={BookOpen}
                label="Course"
                value={`${course?.name || 'Demo Course'} (${course?.code || 'N/A'})`}
                color="text-green-600"
              />
              <InfoRow
                icon={Layers}
                label="Module"
                value={module?.name || "MCQ Test"}
                color="text-purple-600"
              />
              <InfoRow
                icon={Clock}
                label="Duration"
                value={`${duration} minutes`}
                color="text-orange-600"
              />
              {test?.id && (
                <InfoRow
                  icon={Info}
                  label="Test ID"
                  value={test.id}
                  color="text-gray-600"
                />
              )}
            </div>

            {/* Timeline Column */}
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">Test Timeline</h5>
              <InfoRow
                icon={Calendar}
                label="Test Started"
                value={formatDate(test?.start_date)}
                color="text-blue-600"
              />
              <InfoRow
                icon={Calendar}
                label="Test Ended"
                value={formatDate(test?.end_date)}
                color="text-purple-600"
              />
              <InfoRow
                icon={Send}
                label="Submitted At"
                value={formatDate(submission?.submission_time)}
                color="text-green-600"
              />
              <InfoRow
                icon={Award}
                label="Test Status"
                value={finished ? "Completed" : "In Progress"}
                color={finished ? "text-green-600" : "text-orange-600"}
              />
            </div>
          </div>
        </div>

        {/* Test Completion Status */}
        <div 
          className={`p-4 rounded-2xl border ${finished ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}
          style={{
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className={`${finished ? 'text-green-600' : 'text-orange-600'} mr-3`} size={20} />
              <div>
                <div className={`font-semibold ${finished ? 'text-green-800' : 'text-orange-800'}`}>
                  Test {finished ? 'Completed Successfully' : 'In Progress'}
                </div>
                <div className={`text-sm ${finished ? 'text-green-600' : 'text-orange-600'}`}>
                  {finished ? 'All questions have been submitted' : 'Test is currently ongoing'}
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-2xl text-xs font-medium ${finished ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'}`}>
              {finished ? 'Complete' : 'Ongoing'}
            </div>
          </div>
        </div>

        {/* Enhanced Test Statistics */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
            <Info className="text-indigo-500 mr-2" size={18} />
            Test Statistics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-200"
              style={{
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
            >
              <div className="text-sm text-gray-600 mb-1">Questions Attempted</div>
              <div className="text-2xl font-bold text-gray-900">{questionsAttempted}</div>
              <div className="text-xs text-gray-500 mt-1">out of {totalQuestions}</div>
            </div>
            <div 
              className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-200"
              style={{
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
            >
              <div className="text-sm text-gray-600 mb-1">Average Time</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(averageTimePerQuestion)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Per question</div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInformation;