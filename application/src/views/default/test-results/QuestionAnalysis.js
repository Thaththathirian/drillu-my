import React, { useState, useMemo } from "react";
import {
  CheckCircle,
  Clock,
  FileText,
  BookOpen,
  X,
  AlertTriangle,
  Target,
  XCircle,
  MinusCircle,
} from "lucide-react";

// Enhanced markdown renderer that works without external dependencies
const EnhancedMarkdown = ({ children, className = "" }) => {
  if (!children) return null;

  // Enhanced markdown parsing with image support
  const parseMarkdown = (text) => {
    if (!text) return '';
    
    // Handle cases where text might be an image URL directly
    let parsedText = text?.toString() || '';
    
    // Check if the text is a direct image URL
    if (parsedText.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return `<img src="${parsedText}" alt="Question Image" class="max-w-full h-auto rounded-lg shadow-sm my-4" style="max-height: 400px; object-fit: contain; display: block; margin: 16px auto;" loading="lazy" />`;
    }
    
    // Parse images first (before other markdown)
    parsedText = parsedText.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g, 
      '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-sm my-4" style="max-height: 400px; object-fit: contain; display: block; margin: 16px auto;" loading="lazy" />'
    );
    
    // Parse links
    parsedText = parsedText.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g, 
      '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    
    // Parse headers
    parsedText = parsedText.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 my-2">$1</h3>');
    parsedText = parsedText.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 my-3">$1</h2>');
    parsedText = parsedText.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 my-4">$1</h1>');
    
    // Parse code blocks
    parsedText = parsedText.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      '<pre class="bg-gray-800 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm my-4"><code>$2</code></pre>'
    );
    
    // Parse inline code
    parsedText = parsedText.replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Parse bold and italic
    parsedText = parsedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    parsedText = parsedText.replace(/\*(.*?)\*/g, "<em>$1</em>");
    
    // Parse lists
    parsedText = parsedText.replace(/^\* (.+$)/gim, '<li class="list-disc list-inside">$1</li>');
    parsedText = parsedText.replace(/^\d+\. (.+$)/gim, '<li class="list-decimal list-inside">$1</li>');
    
    // Wrap consecutive list items
    parsedText = parsedText.replace(
      /(<li class="list-disc list-inside">.*<\/li>)/gs,
      '<ul class="list-disc list-inside my-2 space-y-1">$1</ul>'
    );
    parsedText = parsedText.replace(
      /(<li class="list-decimal list-inside">.*<\/li>)/gs,
      '<ol class="list-decimal list-inside my-2 space-y-1">$1</ol>'
    );
    
    // Parse blockquotes
    parsedText = parsedText.replace(
      /^> (.+$)/gim, 
      '<blockquote class="border-l-4 border-blue-400 pl-4 py-2 my-4 bg-blue-50 rounded-r-lg">$1</blockquote>'
    );
    
    // Parse line breaks
    parsedText = parsedText.replace(/\n\n/g, "</p><p class='text-gray-700 leading-relaxed my-2'>");
    parsedText = parsedText.replace(/\n/g, "<br/>");
    
    // Wrap in paragraph if needed
    if (!parsedText.match(/^<(h[1-6]|div|p|ul|ol|blockquote|pre|img)/)) {
      parsedText = `<p class="text-gray-700 leading-relaxed my-2">${parsedText}</p>`;
    }
    
    return parsedText;
  };

  const parsedContent = parseMarkdown(children);

  return (
    <div
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: parsedContent }}
      style={{ lineHeight: '1.6' }}
    />
  );
};

const QuestionCard = ({
  question,
  solution,
  index,
  isCorrect,
  isAttempted,
  userAnswers,
  correctAnswers,
  timeSpent,
  difficultyLevel,
}) => {
  const explanation = solution?.explanation || question?.explanation;
  const hasExplanation = explanation && explanation !== null && explanation.trim() !== '';

  const getStatusIcon = () => {
    if (!isAttempted) {
      return <MinusCircle className="text-gray-600" size={20} />;
    }
    if (isCorrect) {
      return <CheckCircle className="text-green-600" size={20} />;
    }
    return <XCircle className="text-red-600" size={20} />;
  };

  const getStatusText = () => {
    if (!isAttempted) return "Not Attempted";
    return isCorrect ? "Correct" : "Incorrect";
  };

  const getStatusColor = () => {
    if (!isAttempted) return "bg-gray-100 text-gray-800";
    return isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getDifficultyBadge = (level) => {
    const config = {
      "1": { color: "bg-blue-100 text-blue-800", text: "Easy" },
      "2": { color: "bg-yellow-100 text-yellow-800", text: "Medium" },
      "3": { color: "bg-red-100 text-red-800", text: "Hard" },
    }[level] || { color: "bg-gray-100 text-gray-800", text: "Unknown" };

    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatTime = (seconds) => {
    const timeValue = typeof seconds === 'string' ? parseInt(seconds) : seconds;
    
    if (!timeValue || timeValue === 0 || isNaN(timeValue)) return "0s";
    
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

  // Get option letter for an index
  const getOptionLetter = (index) => String.fromCharCode(65 + index);

  // Format user answers with option letters
  const formatAnswers = (answers, options) => {
    if (!answers || answers.length === 0) return "Not answered";
    
    return answers.map((answer, idx) => {
      // Handle user answers which have complete option objects
      if (answer?.option_text || answer?.text) {
        const text = (answer.option_text || answer.text).toString();
        const optionIndex = options?.findIndex(opt => 
          opt.id === answer.id || 
          opt.id === parseInt(answer.id) ||
          opt?.option_text === text
        );
        
        const letter = optionIndex !== -1 ? getOptionLetter(optionIndex) : getOptionLetter(idx);
        
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(text) ?
          `${letter}: ![Selected Image](${text})` :
          `${letter}: ${text}`;
      }
      
      // Handle cases where answer is just an ID
      const answerId = answer?.id || answer;
      const option = options?.find(opt => 
        opt.id === answerId || 
        opt.id === parseInt(answerId) ||
        (typeof opt.id === 'string' && opt.id === String(answerId))
      );
      
      if (option) {
        const optionIndex = options.findIndex(opt => opt.id === option.id);
        const letter = optionIndex !== -1 ? getOptionLetter(optionIndex) : 'A';
        const text = option.option_text || option.text || String(answerId);
        
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(text) ?
          `${letter}: ![Selected Image](${text})` :
          `${letter}: ${text}`;
      }
      
      return String(answerId);
    }).join(", ");
  };

  // Format correct answers specifically - FIXED FUNCTION
  const formatCorrectAnswers = (correctAnswerIds, options) => {
    if (!correctAnswerIds || correctAnswerIds.length === 0) return "Not available";
    
    return correctAnswerIds.map(answerId => {
      // Find the option that matches this correct answer ID
      const option = options?.find(opt => 
        opt.id === answerId || 
        opt.id === parseInt(answerId) ||
        (typeof opt.id === 'string' && opt.id === String(answerId)) ||
        opt.is_correct === true ||
        opt.is_correct === 1 ||
        opt.is_correct === "1"
      );
      
      if (option) {
        const optionIndex = options.findIndex(opt => opt.id === option.id);
        const letter = optionIndex !== -1 ? getOptionLetter(optionIndex) : 'A';
        const text = option.option_text || option.text || String(answerId);
        
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(text) ?
          `${letter}: ![Image Option](${text})` :
          `${letter}: ${text}`;
      }
      
      return String(answerId);
    }).join(", ");
  };

  // Calculate options layout
  const getOptionsGridClass = (options) => {
    if (!options || !Array.isArray(options)) return "";
    const maxLength = Math.max(...options.map(opt => 
      (opt?.option_text || opt?.text || '')?.toString().length || 0
    ));
    
    if (options.length <= 4 && maxLength <= 50) {
      return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4";
    }
    if (options.length <= 4) {
      return "grid-cols-1 sm:grid-cols-2";
    }
    if (options.length <= 6) {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
    return "grid-cols-1 sm:grid-cols-2";
  };

  return (
    <div className="bg-white rounded-3xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
              Question {index + 1}
            </h4>
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
              {timeSpent > 0 && (
                <span className="bg-gray-100 text-gray-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full flex items-center">
                  <Clock size={14} className="mr-1" />
                  {formatTime(timeSpent)}
                </span>
              )}
              {difficultyLevel && getDifficultyBadge(difficultyLevel)}
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="space-y-6">
        {/* Question Title - NEW ADDITION */}
        {question?.question_title && (
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="text-purple-600 mr-2" size={18} />
              Question Title
            </h5>
            <div className="bg-purple-50 rounded-xl p-4 shadow-sm border border-purple-200">
              <p className="text-purple-900 font-medium">
                {question.question_title}
              </p>
            </div>
          </div>
        )}

        {/* Question Content */}
        <div>
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
            <FileText className="text-blue-600 mr-2" size={18} />
            Question
          </h5>
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
            <EnhancedMarkdown>
              {question?.question_content || question?.question || question?.text || "Question not available"}
            </EnhancedMarkdown>
          </div>
        </div>

        {/* Options */}
        {solution?.options && Array.isArray(solution.options) && solution.options.length > 0 && (
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Options</h5>
            <div className={`grid ${getOptionsGridClass(solution.options)} gap-4`}>
              {solution.options.map((option, optionIndex) => {
                const optionText = option?.option_text || option?.text || `Option ${optionIndex + 1}`;
                const optionId = option?.id || optionIndex + 1;
                const isUserAnswer = userAnswers?.some(answer => 
                  answer?.id === optionId || 
                  answer?.id === parseInt(optionId) ||
                  answer?.option_text === optionText
                );
                const isCorrectOption = correctAnswers?.includes(optionId) || 
                  correctAnswers?.includes(parseInt(optionId)) ||
                  option?.is_correct === true ||
                  option?.is_correct === 1 ||
                  option?.is_correct === "1";

                let bgColor = "bg-gray-50";
                let borderColor = "border-gray-200";
                let textColor = "text-gray-900";

                if (isCorrectOption) {
                  bgColor = "bg-green-50";
                  borderColor = "border-green-200";
                  textColor = "text-green-800";
                } else if (isUserAnswer && !isCorrect) {
                  bgColor = "bg-red-50";
                  borderColor = "border-red-200";
                  textColor = "text-red-800";
                }

                return (
                  <div
                    key={optionIndex}
                    className={`${bgColor} border ${borderColor} rounded-xl p-4 flex items-start justify-between`}
                  >
                    <div className={`${textColor} font-medium flex-1`}>
                      <span className="font-bold mr-2">
                        {getOptionLetter(optionIndex)}.
                      </span>
                      <div className={/\.(jpg|jpeg|png|gif|webp)$/i.test(optionText?.toString() || '') ? "block mt-2" : "inline"}>
                        <EnhancedMarkdown className="inline-markdown">
                          {optionText}
                        </EnhancedMarkdown>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                      {isCorrectOption && <CheckCircle className="text-green-600" size={16} />}
                      {isUserAnswer && !isCorrect && <X className="text-red-600" size={16} />}
                      {isUserAnswer && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          Your Answer
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Answer Summary - FIXED */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 shadow-sm">
            <h6 className="font-semibold text-blue-800 mb-2 flex items-center">
              <Target className="mr-2" size={16} />
              Your Answer
            </h6>
            <div className="text-blue-700 text-sm">
              <EnhancedMarkdown>
                {formatAnswers(userAnswers, solution?.options)}
              </EnhancedMarkdown>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200 shadow-sm">
            <h6 className="font-semibold text-green-800 mb-2 flex items-center">
              <CheckCircle className="mr-2" size={16} />
              Correct Answer
            </h6>
            <div className="text-green-700 text-sm">
              <EnhancedMarkdown>
                {formatCorrectAnswers(correctAnswers, solution?.options)}
              </EnhancedMarkdown>
            </div>
          </div>
        </div>

        {/* Solution Section */}
        {hasExplanation && (
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
              <BookOpen className="text-purple-600 mr-2" size={18} />
              Solution & Explanation
            </h5>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 shadow-sm">
              <EnhancedMarkdown>
                {explanation}
              </EnhancedMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuestionAnalysis = ({ questions, solutions, submission }) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("question");

  const processedQuestions = useMemo(() => {
    if (!questions || !Array.isArray(questions)) return [];

    return questions.map((question, index) => {
      const questionId = question?.question_id || question?.id;
      let solution = solutions?.[questionId] || solutions?.[String(questionId)];
      
      let userAnswers = [];
      if (solution?.answered_options && Array.isArray(solution.answered_options)) {
        userAnswers = solution.answered_options;
      }

      let correctAnswers = [];
      if (solution?.correct_answer && Array.isArray(solution.correct_answer)) {
        correctAnswers = solution.correct_answer;
      }

      // Check if question was attempted
      const isAttempted = userAnswers && userAnswers.length > 0;
      const isCorrect = parseInt(solution?.score || 0) > 0;

      return {
        ...question,
        solution,
        userAnswers,
        correctAnswers,
        isCorrect,
        isAttempted,
        timeSpent: parseInt(solution?.time_spent || 0),
        difficultyLevel: question?.difficulty_level,
        index,
      };
    });
  }, [questions, solutions]);

  const filteredQuestions = processedQuestions.filter((q) => {
    if (filter === "correct") return q.isCorrect;
    if (filter === "incorrect") return q.isAttempted && !q.isCorrect;
    if (filter === "not_attempted") return !q.isAttempted;
    return true;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortBy === "time") return (b.timeSpent || 0) - (a.timeSpent || 0);
    if (sortBy === "difficulty") {
      const difficultyOrder = { "1": 1, "2": 2, "3": 3 };
      return (difficultyOrder[b.difficultyLevel] || 0) - (difficultyOrder[a.difficultyLevel] || 0);
    }
    return a.index - b.index;
  });

  const correctCount = processedQuestions.filter((q) => q.isCorrect).length;
  const incorrectCount = processedQuestions.filter((q) => q.isAttempted && !q.isCorrect).length;
  const notAttemptedCount = processedQuestions.filter((q) => !q.isAttempted).length;

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-lg mb-2">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="flex items-center">
          <FileText className="text-blue-600 mr-3" size={24} />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Question Analysis
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {correctCount} correct • {incorrectCount} incorrect • {notAttemptedCount} not attempted • {processedQuestions.length} total
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white rounded-xl text-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          >
            <option value="all">All Questions ({processedQuestions.length})</option>
            <option value="correct">Correct ({correctCount})</option>
            <option value="incorrect">Incorrect ({incorrectCount})</option>
            <option value="not_attempted">Not Attempted ({notAttemptedCount})</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white rounded-xl text-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          >
            <option value="question">Sort by Question</option>
            <option value="time">Sort by Time Spent</option>
            <option value="difficulty">Sort by Difficulty</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {sortedQuestions.length > 0 ? (
          sortedQuestions.map((question) => (
            <QuestionCard
              key={question.index}
              question={question}
              solution={question.solution}
              index={question.index}
              isCorrect={question.isCorrect}
              isAttempted={question.isAttempted}
              userAnswers={question.userAnswers}
              correctAnswers={question.correctAnswers}
              timeSpent={question.timeSpent}
              difficultyLevel={question.difficultyLevel}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <FileText className="text-gray-400 mx-auto mb-4" size={48} />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No Questions Found
            </h4>
            <p className="text-gray-600 mb-4">
              {filter === "all"
                ? "No questions available for this test."
                : `No ${filter.replace('_', ' ')} questions found.`}
            </p>

            {processedQuestions.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-xl text-left max-w-2xl mx-auto border border-yellow-200">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="text-yellow-600 mr-2" size={16} />
                  <h5 className="font-semibold text-yellow-800">Debug Information</h5>
                </div>
                <div className="text-xs text-yellow-700 space-y-1">
                  <p>Questions array length: {questions?.length || 0}</p>
                  <p>
                    Solutions available:{" "}
                    {solutions
                      ? Array.isArray(solutions)
                        ? solutions.length
                        : "Object"
                      : "None"}
                  </p>
                  <p>Submission data: {submission ? "Available" : "None"}</p>
                  <p>Processed questions: {processedQuestions.length}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionAnalysis;