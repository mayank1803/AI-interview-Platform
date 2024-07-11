"use client";
import Webcam from 'react-webcam';
import { db } from '../../../../utils/db';
import { MockInterview } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Interview({ params }) {
    const [interviewData, setInterviewData] = useState();
    const [webCamEnabled, setWebCamEnabled] = useState(false);

    useEffect(() => {
        console.log(params.interviewId);
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId));
        setInterviewData(result[0]);
    };

    return (
        <div className='my-10 p-6 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 shadow-lg rounded-lg'>
            <h2 className='font-extrabold text-3xl text-center text-blue-700 mb-6'>Let's Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 p-5'>
                <div className='flex flex-col p-5 gap-5'>
                    <div className='flex flex-col p-6 rounded-lg border border-gray-200 bg-gray-50 shadow-md'>
                        {interviewData ? (
                            <>
                                <h2 className='text-lg text-gray-800'><strong>Job Role/Job Position:</strong> {interviewData.jobPosition}</h2>
                                <h2 className='text-lg text-gray-800'><strong>Job Description/Tech Stack:</strong> {interviewData.jobDesc}</h2>
                                <h2 className='text-lg text-gray-800'><strong>Years Of Experience:</strong> {interviewData.jobExperience}</h2>
                            </>
                        ) : (
                            <p className='text-gray-600'>Loading interview details...</p>
                        )}
                    </div>
                    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-600'><Lightbulb /><strong>Information</strong></h2>
                        <h2 className='mt-3 text-yellow-600'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                    {webCamEnabled ? (
                        <Webcam
                        onUserMedia={() => setWebCamEnabled(true)}
                        onUserMediaError={() => setWebCamEnabled(false)}
                        mirrored={true}
                        style={{
                          height: '100%',
                          width: '100%',
                          maxWidth: '400px',  // Adjusted for larger screens
                          maxHeight: '400px',
                          borderRadius: '10px',
                          border: '4px solid #0070f3',
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        }}
                        className="transform hover:scale-105 hover:shadow-xl"
                      />
                      
                      
                    ) : (
                        <>
                            <WebcamIcon className='h-72 w-full my-7 p-20 bg-gray-200 text-gray-500 rounded-lg border-dashed border-2 border-gray-300' />
                            <Button className='mt-4 bg-blue-600 text-white hover:bg-blue-700' onClick={() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
                        </>
                    )}
                </div>
            </div>
            <div className='flex justify-end items-end mt-6'>
                <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
                    <Button className='bg-green-600 text-white hover:bg-green-700'>Start Interview</Button>
                </Link>
            </div>
        </div>
    );
}

export default Interview;
