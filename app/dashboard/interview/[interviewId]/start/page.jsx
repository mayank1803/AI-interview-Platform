"use client";
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../../../../utils/db';
import { MockInterview } from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format,parse } from 'date-fns'
import moment from "moment";
function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const questionSectionRef = useRef(null);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db.select().from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    const jsonMockResp = JSON.parse(result[0].jsonMockResp);
    console.log(jsonMockResp);
    setMockInterviewQuestion(jsonMockResp);
    setInterviewData(result[0]);
  };

  const scrollToQuestions = () => {
    if (questionSectionRef.current) {
      questionSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextQuestion = () => {
    setActiveQuestionIndex((prevIndex) => prevIndex + 1);
    scrollToQuestions();
  };

  const handlePreviousQuestion = () => {
    setActiveQuestionIndex((prevIndex) => prevIndex - 1);
    scrollToQuestions();
  };
  const createdAt = interviewData?.createdAt;
  const parsedDate = createdAt ? moment(createdAt, 'DD-MM-YYYY').format('DD-MM-YYYY') : 'Invalid Date';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Start Your Mock Interview</h1>
        <div className="bg-gray-100 border border-gray-300 shadow-lg rounded-lg p-6 mb-6 border border-gray-200 transition-transform transform hover:scale-105">
  <motion.div 
    initial={{ opacity: 0, y: -20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5 }} 
  >
    <h2 className="text-2xl font-bold mb-4 text-gray-900">Interview Details</h2>
    <p className="text-lg mb-2">
      <span className="font-semibold text-blue-600">Title:</span> {interviewData?.jobPosition}
    </p>
    <p className="text-lg mb-2">
      <span className="font-semibold text-blue-600">Description:</span> {interviewData?.jobDesc}
    </p>
    <p className="text-lg">
      <span className="font-semibold text-blue-600">Date:</span> {parsedDate}
    </p>
  </motion.div>
</div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mb-10' ref={questionSectionRef}>
          <QuestionsSection 
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
          />
          <RecordAnswerSection 
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
          />
        </div>
        <div className='flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0 md:space-x-4'>
          {activeQuestionIndex > 0 &&
            <Button onClick={handlePreviousQuestion} className="bg-blue-500 text-white hover:bg-blue-600">
              Previous Question
            </Button>
          }
          {activeQuestionIndex !== mockInterviewQuestion?.length - 1 &&
            <Button onClick={handleNextQuestion} className="bg-blue-500 text-white hover:bg-blue-600">
              Next Question
            </Button>
          }
          {activeQuestionIndex === mockInterviewQuestion?.length - 1 &&
            <Link href={'/dashboard/interview/' + interviewData?.mockId + "/feedback"}>
              <Button className="bg-green-500 text-white hover:bg-green-600">
                End Interview
              </Button>
            </Link>
          }
        </div>
      </div>
    </div>
  )
}

export default StartInterview;
