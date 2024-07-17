"use client"
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../../utils/db'
import { UserAnswer } from '../../../../../utils/schema'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../../../../components/ui/collapsible"
import { ChevronsUpDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { format, parse } from 'date-fns'

function Feedback({ params }) {
    const [feedbackList, setFeedbackList] = useState([]);
    const [overallRating, setOverallRating] = useState(0);
    const router = useRouter();

    useEffect(() => {
        GetFeedback();
    }, []);

    const GetFeedback = async () => {
        try {
            const result = await db.select()
                .from(UserAnswer)
                .where(eq(UserAnswer.mockIdRef, params.interviewId))
                .orderBy(UserAnswer.id);

            console.log(result);
            setFeedbackList(result);

            // Calculate overall rating
            if (result.length > 0) {
                const totalRating = result.reduce((acc, item) => acc + Number(item.rating), 0);
                const averageRating = totalRating / result.length;
                setOverallRating(averageRating.toFixed(1)); // rounding to one decimal place
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    }

    // Group answers by question
    const groupedFeedback = feedbackList.reduce((acc, item) => {
        if (!acc[item.question]) {
            acc[item.question] = [];
        }
        acc[item.question].push(item);
        return acc;
    }, {});

    return (
        <div className='p-10 min-h-screen flex flex-col items-center'>
            {feedbackList.length === 0 ?
                <h2 className='font-bold text-xl text-gray-700'>No Interview Feedback Record Found</h2>
                :
                <>
                    <h2 className='text-4xl font-bold text-green-800 mb-4'>Congratulations!</h2>
                    <h2 className='text-2xl font-semibold text-gray-900 mb-2'>Here is your interview feedback</h2>
                    <h2 className='text-lg my-3 p-3 bg-gradient-to-r from-green-200 to-green-300 text-green-900 rounded-lg border border-green-500 shadow-lg'>
                        Your overall interview rating: <strong className='text-xl'>{overallRating}/10</strong>
                    </h2>
                    <h2 className='text-sm text-gray-700 mb-6 text-center max-w-4xl mx-auto'>
                        Find below interview questions with correct answers, your answers, and feedback for improvement
                    </h2>

                    {Object.entries(groupedFeedback).map(([question, answers], index) => (
                        <Collapsible key={index} className='mt-7 w-full'>
                            <CollapsibleTrigger className='p-4 bg-white shadow-lg rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-300 ease-in-out flex justify-between items-center text-left gap-4 w-full'>
                                <span className='text-gray-800 font-semibold'>{question}</span>
                                <ChevronsUpDownIcon className='h-5 w-5 text-gray-600 transition-transform duration-300 ease-in-out group-open:rotate-180' />
                            </CollapsibleTrigger>
                            <CollapsibleContent className='p-4 bg-white border border-gray-200 rounded-b-lg shadow-md'>
                                <div className='flex flex-col gap-4'>
                                    {answers.map((item, idx) => (
                                        <div key={idx} className='p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-white shadow-md hover:shadow-lg transition-shadow duration-300'>
                                            <h2 className='p-2 border-b border-gray-200 text-sm text-blue-700'>
                                                <strong>Answer Provided on:</strong> {`${format(parse(item.createdAt, 'dd-MM-yyyy hh:mm a', new Date()), 'dd-MM-yyyy')} at ${format(parse(item.createdAt, 'dd-MM-yyyy hh:mm a', new Date()), 'hh:mm a')}`}
                                            </h2>
                                            <h2 className='text-red-600 p-2 border-b border-gray-200 mt-2'><strong>Rating: </strong> {item.rating}</h2>
                                            <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900 mt-2 whitespace-pre-wrap'><strong>Your Answer: </strong>{item.userAns}</h2>
                                            <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900 mt-2 whitespace-pre-wrap'><strong>Correct Answer: </strong>{item.correctAns}</h2>
                                            <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900 mt-2 whitespace-pre-wrap'><strong>Feedback: </strong>{item.feedback}</h2>
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </>
            }
            <Button onClick={() => router.replace('/dashboard')} className='mt-5 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 ease-in-out shadow-lg'>
                Go Home
            </Button>
        </div>
    )
}

export default Feedback
