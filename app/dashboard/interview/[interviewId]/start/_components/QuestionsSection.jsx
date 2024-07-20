import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex, setActiveQuestionIndex }) {
  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };

  return (
    mockInterviewQuestion && (
      <div className='bg-white border border-gray-300 shadow-lg p-6 rounded-lg my-10'>
        <motion.div 
          initial={{ opacity: 0, x: -100 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }} 
          className='flex flex-wrap gap-4 mb-6'
        >
          {mockInterviewQuestion.map((question, index) => (
            <motion.button
              key={index}
              className={`p-3 bg-gray-200 rounded-md text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex === index ? 'border-2 border-blue-800 bg-blue-100 text-blue-800' : ''}`}
              onClick={() => setActiveQuestionIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Question #{index + 1}
            </motion.button>
          ))}
        </motion.div>
        
        <div className='mb-6'>
          <motion.h2 
            className='text-lg font-semibold mb-2'
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            {mockInterviewQuestion[activeQuestionIndex]?.Question}
          </motion.h2>

          <div className='flex items-center gap-2 mb-4'>
            <Volume2 
              className='text-gray-600 cursor-pointer hover:text-gray-800'
              onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.Question)} 
            />
            <span className='text-gray-500 text-sm'>Read Aloud</span>
          </div>
          {mockInterviewQuestion[activeQuestionIndex]?.Type && (
            <div className='flex flex-wrap gap-4 mb-4'>
              <span className='px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full'>
                {mockInterviewQuestion[activeQuestionIndex]?.Type}
              </span>
              {mockInterviewQuestion[activeQuestionIndex]?.Difficulty && (
                <span className='px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full'>
                  {mockInterviewQuestion[activeQuestionIndex]?.Difficulty}
                </span>
              )}
              {mockInterviewQuestion[activeQuestionIndex]?.Language && (
                <span className='px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded-full'>
                  {mockInterviewQuestion[activeQuestionIndex]?.Language}
                </span>
              )}
            </div>
          )}
        </div>

        <div className='border rounded-lg p-5 bg-blue-100'>
          <h2 className='flex gap-2 items-center text-primary'>
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className='text-sm text-blue-700 my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
