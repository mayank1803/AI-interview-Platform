"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
function How() {
    const steps = [
        {
          title: "Step 1: Login",
          description: "Log in to the platform to access your dashboard where you can see previous interviews, retake them, view feedback, and start new interviews.",
          imgSrc: "/login.png",
          imgAlt: "Login",
        },
        {
          title: "Step 2: Create Your Interview",
          description: "Click the 'Add New' button to provide details like job role, description, tech stack, and years of experience. Click 'Start Interview' and wait for the setup to complete.",
          imgSrc: "/create-interview.png",
          imgAlt: "Create Interview",
        },
        {
          title: "Step 3: Prepare for the Interview",
          description: "Review the interview details and open your webcam for a realistic experience. The platform records only your answers, not the video.",
          imgSrc: "/prepare-interview.png",
          imgAlt: "Prepare for Interview",
        },
        {
          title: "Step 4: Answer Questions",
          description: "Navigate through questions related to your job role. Click the speaker icon to hear the question. Record your answers by clicking the 'Record Answer' button.",
          imgSrc: "/answer-questions.png",
          imgAlt: "Answer Questions",
        },
        {
          title: "Step 5: Receive Feedback",
          description: "After completing the interview, get redirected to the feedback page where you’ll see your answers, questions, correct answers, ratings, and improvement areas.",
          imgSrc: "/get-feedback.png",
          imgAlt: "Get Feedback",
        },
      ];
  return (
    <div className="space-y-16">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center md:space-x-8 transition-transform duration-500 opacity-0 animate-fade-in`}
          style={{
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            opacity: 1,
            transform: 'translateY(0)',
            transitionDelay: `${index * 0.2}s`
          }}
        >
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
            <p className="text-gray-700 mb-4">{step.description}</p>
          </div>
          <div className="w-full md:w-1/2 p-4">
            <img src={step.imgSrc} alt={step.imgAlt} className="w-full rounded-lg shadow-lg" />
          </div>
        </div>
      ))}
    </div>


  );
}

export default How;
