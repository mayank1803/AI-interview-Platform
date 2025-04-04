"use client"
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { db } from '../../../utils/db';
import { MockInterview } from '../../../utils/schema';
import InterviewItemCard from '../_components/InterviewItemCard';

function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);

    useEffect(() => {
        user && GetInterviewList();
    }, [user]);

    const GetInterviewList = async () => {
        const result = await db.select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user?.primaryEmailAddress.emailAddress))
            .orderBy(desc(MockInterview.id));
        console.log(result);
        setInterviewList(result);
    }

    return (
        <div className='bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 shadow-lg rounded-lg p-6'>
            <h2 className='font-medium text-xl mb-4'>Previous Mock Interviews</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                {interviewList && interviewList.map((interview, index) => (
                    <InterviewItemCard
                        interview={interview}
                        key={index} />
                ))}
            </div>
        </div>
    );
}

export default InterviewList;
