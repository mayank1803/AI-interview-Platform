import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '../../../../../../utils/GeminiAIModal';
import { db } from '../../../../../../utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { UserAnswer } from 'utils/schema';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interimResult, setInterimResult] = useState('');
  const [finalResult, setFinalResult] = useState('');

  const recognition = useRef(null);

  const initWebSpeechAPI = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Web Speech API is not supported in this browser.");
      setErrorMessage("Web Speech API is not supported in this browser.");
      return;
    }

    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = 'en-US';

    recognition.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInterimResult(interimTranscript);
      setFinalResult(prevFinal => prevFinal + finalTranscript);
    };

    recognition.current.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
      setErrorMessage('Speech recognition error occurred. Please try again.');
      toast.error('Speech recognition error occurred. Please try again.');
    };
  };

  useEffect(() => {
    initWebSpeechAPI();
  }, []);

  const processResults = useCallback(() => {
    if (finalResult.trim()) {
      setUserAnswer(prevAns => prevAns + finalResult);
      setFinalResult('');
    }
  }, [finalResult]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  useEffect(() => {
    const debounceTimeout = setTimeout(processResults, 500);
    return () => clearTimeout(debounceTimeout);
  }, [finalResult, processResults]);

  const StartStopRecording = async () => {
    if (isRecording) {
      recognition.current?.stop();
      setIsRecording(false);
    } else {
      recognition.current?.start();
      setIsRecording(true);
    }
  };

  const UpdateUserAnswer = async () => {
    setLoading(true);
    const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.Question + ",User Answer:" + userAnswer + ",Depends on question and user answer for given interview question please" +
      " give us rating for answer and feedback as area of improvement if any " +
      " in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";
    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonRes = (result.response.text()).replace('```json', '').replace('```', '');
    console.log(mockJsonRes);
    const JsonFeedbackResp = JSON.parse(mockJsonRes);
    const resp = await db.insert(UserAnswer)
      .values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.Question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy hh:mm a')
      });
    if (resp) {
      toast('User Answer recorded Successfully');
      setUserAnswer('');
      setInterimResult('');
      setFinalResult('');
    }
    setLoading(false);
  };

  const isMobile = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };

  useEffect(() => {
    if (isMobile()) {
      setErrorMessage('Mobile browser detected. Speech recognition might not work reliably on some mobile devices.');
    }
  }, []);

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='bg-gray-100 border border-gray-300 flex flex-col mt-20 justify-center  items-center rounded-lg pd-5'>
        <Image src={'/webcam.png'} width={200} height={200} className='absolute bg-gray-100' />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }} 
        />
      </div>
      <Button disabled={loading} variant="outline" className='my-10' onClick={StartStopRecording}>
        {isRecording ?
          <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
            <StopCircle /> Stop Recording
          </h2> :
          <h2 className='text-primary flex gap-2 items-center'>
            <Mic /> Record Answer
          </h2>
        }
      </Button>
      {interimResult && <p className='text-gray-600'>{interimResult}</p>}
      {errorMessage && <p className='text-red-600'>{errorMessage}</p>}
    </div>
  );
}

export default RecordAnswerSection;
