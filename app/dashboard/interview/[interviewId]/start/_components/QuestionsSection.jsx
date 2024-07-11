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

  console.log('mockInterviewQuestion:', mockInterviewQuestion);
  if (mockInterviewQuestion && mockInterviewQuestion.length > 0) {
    console.log('First question structure:', mockInterviewQuestion[0]);
  }

  return mockInterviewQuestion && (
    <div className='bg-gray-100 border border-gray-300 shadow-lg p-5  rounded-lg my-10'>
      <motion.div 
        initial={{ opacity: 0, x: -100 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.5 }} 
        className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
      >
        {mockInterviewQuestion.map((question, index) => (
          <motion.h2
            key={index}
            className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex === index && 'border-2 border-blue-800 shadow-lg text-blue-800'}`}
            onClick={() => setActiveQuestionIndex(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Question #{index + 1}
          </motion.h2>
        ))}
      </motion.div>
      <motion.h2 
        className='my-5 text-md md:text-lg'
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        {mockInterviewQuestion[activeQuestionIndex]?.Question}
      </motion.h2>
      <Volume2 className='cursor-pointer' onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.Question)} />
      <div className='border rounded-lg p-5 bg-blue-100 my-10'>
        <h2 className='flex gap-2 items-center text-primary'>
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className='text-sm text-blue-700 my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
      </div>
    </div>
  );
}

export default QuestionsSection;
