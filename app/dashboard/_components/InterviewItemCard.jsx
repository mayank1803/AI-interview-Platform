import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { format,parse } from 'date-fns'
import moment from "moment";
function InterviewItemCard({ interview }) {
    const router = useRouter();

    // Log the createdAt value for debugging
    console.log('createdAt:', interview?.createdAt);

    const onStart = () => {
        router.push('/dashboard/interview/' + interview?.mockId);
    }

    const onFeedbackPress = () => {
        router.push('/dashboard/interview/' + interview?.mockId + "/feedback");
    }

    // Check if createdAt is a valid date before formatting
    const createdAt = interview?.createdAt;
    const parsedDate = createdAt ? moment(createdAt, 'DD-MM-YYYY').format('DD-MM-YYYY') : 'Invalid Date';

    return (
        <div className='bg-gray-100 border border-gray-300 shadow-lg rounded-lg p-5 hover:shadow-md transition-shadow duration-300'>
            <h2 className='font-bold text-xl text-gray-800 mb-2'>Job Position: {interview?.jobPosition}</h2>
            <p className='text-s text-indigo-500 mb-1'>Years of Experience: {interview?.jobExperience}</p>
            <p className='text-xs text-green-500 mb-3'>Created At: {parsedDate}</p>
            <div className='flex flex-col md:flex-row justify-between gap-3'>
                <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm w-full md:w-auto transition-colors duration-300' onClick={onFeedbackPress}>Feedback</button>
                <button className='bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm w-full md:w-auto transition-colors duration-300' onClick={onStart}>Start</button>
            </div>
        </div>
    );
}

export default InterviewItemCard;
