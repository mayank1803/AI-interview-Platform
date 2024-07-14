"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import Webcam from 'react-webcam'
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '../../../../../../utils/GeminiAIModal'
import { db } from '../../../../../../utils/db'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { UserAnswer } from 'utils/schema'

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interimResult, setInterimResult] = useState('');
  const [finalResult, setFinalResult] = useState('');
  const [inputMode, setInputMode] = useState('speech');

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
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInterimResult(interimTranscript);
      setFinalResult(finalTranscript);
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
    if (finalResult) {
      setUserAnswer(prevAns => prevAns + finalResult);
      setFinalResult('');
    }
  }, [finalResult]);

  useEffect(() => {
    const debounceTimeout = setTimeout(processResults, 500);
    return () => clearTimeout(debounceTimeout);
  }, [finalResult, processResults]);

  const StartStopRecording = async () => {
    if (inputMode === 'speech') {
      if (isRecording) {
        recognition.current?.stop();
        setIsRecording(false);
      } else {
        recognition.current?.start();
        setIsRecording(true);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    if (userAnswer.trim().length === 0) {
      toast.error('Please provide an answer before submitting.');
      return;
    }

    setLoading(true);
    const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.Question + ",User Answer:" + userAnswer + ",Depends on question and user answer for given interview question please" +
      " give us rating for answer out of 10 and feedback as area of improvement if any " +
      " in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = await result.response.text();

      // Extract JSON from response text
      let jsonFeedbackResp;
      try {
        const jsonResponse = responseText
          .replace(/```json/g, '') // Remove the opening ```json
          .replace(/```/g, '')    // Remove the closing ```
          .trim();                // Trim any extra spaces

        jsonFeedbackResp = JSON.parse(jsonResponse);
      } catch (jsonParseError) {
        console.error('Failed to parse JSON:', jsonParseError);
        toast.error('Failed to parse the feedback response. Please try again.');
        setLoading(false);
        return;
      }

      const resp = await db.insert(UserAnswer)
        .values({
          mockIdRef: interviewData?.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.Question,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
          userAns: userAnswer,
          feedback: jsonFeedbackResp?.feedback,
          rating: jsonFeedbackResp?.rating,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-yyyy hh:mm a')
        });

      if (resp) {
        toast('User Answer recorded Successfully');
        setUserAnswer('');
        setInterimResult('');
        setFinalResult('');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('An error occurred while submitting your answer. Please try again.');
    } finally {
      setLoading(false);
    }
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
      <div className='bg-gray-100 border border-gray-300 flex flex-col mt-20 justify-center items-center rounded-lg pd-5'>
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

      {/* Toggle Button for Input Mode */}
      <Button 
        variant="outline" 
        className='my-4'
        onClick={() => {
          if (inputMode === 'speech' && isRecording) {
            recognition.current?.stop();
            setIsRecording(false);
          }
          setInputMode(inputMode === 'speech' ? 'text' : 'speech');
        }}
      >
        {inputMode === 'speech' ? 'Switch to Text Input' : 'Switch to Speech Input'}
      </Button>

      {/* Speech Recognition Controls */}
      {inputMode === 'speech' && (
        <>
          <Button 
            disabled={loading} 
            variant="outline" 
            className='my-4' 
            onClick={StartStopRecording}
          >
            {isRecording ? (
              <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
                <StopCircle /> Stop Recording
              </h2>
            ) : (
              <h2 className='text-primary flex gap-2 items-center'>
                <Mic /> Record Answer
              </h2>
            )}
          </Button>
          {interimResult && <p className='text-gray-600'>{interimResult}</p>}
        </>
      )}

      {/* Text Input Controls */}
      {inputMode === 'text' && (
        <>
          <textarea
            className='border border-gray-300 p-2 mt-4 w-full'
            rows={4}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <Button
            disabled={loading}
            variant="outline"
            className='my-4'
            onClick={handleSubmitAnswer}
          >
            Submit Answer
          </Button>
        </>
      )}

      {/* Show Text Area */}
      {inputMode === 'speech' && (
        <>
          <textarea
            className='border border-gray-300 p-2 mt-4 w-full'
            rows={4}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <Button
            disabled={loading}
            variant="outline"
            className='my-4'
            onClick={handleSubmitAnswer}
          >
            Submit Answer
          </Button>
        </>
      )}

      {errorMessage && <p className='text-red-600'>{errorMessage}</p>}
    </div>
  );
}

export default RecordAnswerSection;
