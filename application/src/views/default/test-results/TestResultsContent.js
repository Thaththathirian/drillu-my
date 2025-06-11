import React from "react";
import { Alert } from "react-bootstrap";
import { CheckCircle } from "lucide-react";
import ScoreCards from "./ScoreCards";
import TestInformation from "./TestInformation";
import PerformanceChart from "./PerformanceChart";
import PerformanceInsights from "./PerformanceInsights";
import RecommendationsSection from "./RecommendationsSection";
import QuestionAnalysis from "./QuestionAnalysis";

const TestResultsContent = ({ handleGoBack, results, TestResultsHeader }) => {
  const { test, course, module, submission, questions, solutions } = results;

  console.log("🔍 TestResultsContent Debug Info:");
  console.log("📊 Full Results:", results);
  console.log("📝 Questions:", questions);
  console.log("💡 Solutions:", solutions);
  console.log("📋 Submission:", submission);

  // Calculate additional metrics from the actual response data
  const totalQuestions = questions?.length || 0;
  
  // Calculate correct answers from solutions
  const correctAnswers = solutions ? 
    Object.values(solutions).filter(solution => parseInt(solution.score || 0) > 0).length : 0;
  
  // Calculate total time spent from solutions
  const totalTimeSpent = solutions ? 
    Object.values(solutions).reduce((total, solution) => {
      const timeSpent = parseInt(solution.time_spent || 0);
      return total + timeSpent;
    }, 0) : (parseInt(submission?.time_spent || 0));

  // Calculate questions attempted (solutions with answered_options or score)
  const questionsAttempted = solutions ? 
    Object.values(solutions).filter(solution => 
      (solution.answered_options && solution.answered_options.length > 0) || 
      parseInt(solution.score || 0) >= 0
    ).length : totalQuestions;

  // Calculate average time per question
  const averageTimePerQuestion = questionsAttempted > 0 ? 
    Math.round(totalTimeSpent / questionsAttempted) : 0;

  console.log("📊 Calculated Metrics:", {
    totalQuestions,
    correctAnswers,
    totalTimeSpent,
    questionsAttempted,
    averageTimePerQuestion,
    submissionTimeSpent: submission?.time_spent
  });

  // Update submission object with calculated values for compatibility
  const enhancedSubmission = {
    ...submission,
    correct_answers: correctAnswers,
    total_questions: totalQuestions,
    time_spent: totalTimeSpent, // Use calculated time
    questions_attempted: questionsAttempted,
    average_time_per_question: averageTimePerQuestion
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-2 sm:px-5 lg:px-8 py-1">
        <div className="max-w-7xl mx-auto">
          {/* Render the header component */}
          {TestResultsHeader && <TestResultsHeader />}

          {/* Score Cards - Mobile responsive grid */}
          <ScoreCards submission={enhancedSubmission} questions={questions} />

          {/* Main Content Grid - Test Information and Performance Overview */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            {/* Test Information - Takes 1 column */}
            <div className="flex">
              <div className="w-full">
                <TestInformation
                  test={test}
                  course={course}
                  module={module}
                  submission={enhancedSubmission}
                />
              </div>
            </div>

            {/* Performance Chart - Takes 1 column */}
            <div className="flex">
              <div className="w-full">
                <PerformanceChart submission={enhancedSubmission} />
              </div>
            </div>
          </div>

          {/* Performance Summary - Full width section */}
          {/* <div className="mb-6">
            <div
              className="bg-white rounded-3xl p-3 p-sm-5"
              style={{
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            > */}
                {/* <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                    <CheckCircle className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Performance Summary
                    </h3>
                    <p className="text-sm text-gray-600">
                      Complete overview of your test performance and scores
                    </p>
                  </div>
                </div> */}

              {/* Performance metrics in responsive grid */}
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> */}
                {/* Overall Score */}
                {/* <div 
                  className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-200"
                  style={{
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  }}
                >
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                    {parseFloat(enhancedSubmission?.percentage || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm font-semibold text-blue-800">Overall Score</div>
                  <div className="text-xs text-blue-600">Performance level</div>
                </div> */}

                {/* Question Analysis */}
                {/* <div 
                  className="text-center p-4 bg-green-50 rounded-2xl border border-green-200"
                  style={{
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  }}
                >
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                    {correctAnswers}
                  </div>
                  <div className="text-sm font-semibold text-green-800">Correct Answers</div>
                  <div className="text-xs text-green-600">out of {totalQuestions}</div>
                </div> */}

                {/* Score Earned */}
                {/* <div 
                  className="text-center p-4 bg-yellow-50 rounded-2xl border border-yellow-200"
                  style={{
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  }}
                >
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">
                    {enhancedSubmission?.earned_score || 0}
                  </div>
                  <div className="text-sm font-semibold text-yellow-800">Points Earned</div>
                  <div className="text-xs text-yellow-600">out of {enhancedSubmission?.total_score || 0}</div>
                </div> */}

                {/* Time Spent */}
                {/* <div 
                  className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-200"
                  style={{
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  }}
                >
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                    {Math.floor((totalTimeSpent || 0) / 60)}m
                  </div>
                  <div className="text-sm font-semibold text-purple-800">Time Spent</div>
                  <div className="text-xs text-purple-600">Total duration</div>
                </div> */}
              {/* </div>
            </div>
          </div> */}

          {/* Performance Insights - Full width */}
          <PerformanceInsights submission={enhancedSubmission} questions={questions} />

          {/* Question Analysis - Only show if questions exist */}
          {questions && questions.length > 0 && (
            <QuestionAnalysis
              questions={questions}
              solutions={solutions}
              submission={enhancedSubmission}
            />
          )}

          {/* Recommendations Section - Full width */}
          {/* <RecommendationsSection submission={enhancedSubmission} /> */}
        </div>
      </div>
    </div>
  );
};

export default TestResultsContent;