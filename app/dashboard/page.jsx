import { UserButton } from '@clerk/nextjs';
import AddNewInterview from './_components/AddNewInterview';
import React from 'react';
import InterviewList from './_components/InterviewList';

const Dashboard = () => {
  return (
    <div className='p-10 bg-gray-100 min-h-screen'>
      <header className='flex justify-between items-center mb-10'>
        <h1 className='font-bold text-3xl text-blue-800'>Interview Mocker</h1>
        <UserButton />
      </header>
      <section class="bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 shadow-lg rounded-lg p-6 text-center text-gray-800">
  <h2 class="font-bold text-3xl mb-4 text-blue-500">Welcome to Your Dashboard</h2>
  <p class="text-lg mb-6 text-gray-600">Here you can manage your AI Mockup Interviews with ease.</p>
  <div class="flex justify-center mb-8">
    <AddNewInterview /> 
  </div>
</section>






      <section className='mt-10'>
        <InterviewList />
      </section>
    </div>
  );
}

export default Dashboard;
