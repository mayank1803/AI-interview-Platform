"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatSession } from "../../../utils/GeminiAIModal";
import { db } from "utils/db";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import Ajv from "ajv";
import { useRouter } from 'next/navigation';
import * as pdfjsLib from 'pdfjs-dist/webpack';  // Importing PDF.js

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  

  // Function to parse PDF content using pdfjs-dist
  const parsePDFContent = async (arrayBuffer) => {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str).join(' ');
      text += strings;
    }
    return text;
  };

  // Function to parse DOCX content from ArrayBuffer
  const parseDOCXContent = async (arrayBuffer) => {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  // Function to parse resume based on file type
  const parseResume = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const arrayBuffer = reader.result;
        if (file.type.includes('pdf')) {
          resolve(parsePDFContent(arrayBuffer));
        } else if (file.type.includes('word')) {
          resolve(parseDOCXContent(arrayBuffer));
        } else {
          reject(new Error('Unsupported file format. Please upload a PDF or DOCX file.'));
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };
  const cleanJSON = (input) => {
    // Replace control characters and other unwanted characters
    return input.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  };
  function sanitizeResumeContent(content) {
    return content
        .replace(/\n/g, ' ')
        .replace(/"/g, '\\"')
        .replace(/\t/g, ' ')
        .replace(/\r/g, ' ');
}
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
  
    let resumeContent = "";
    if (resumeFile) {
      try {
        resumeContent = await parseResume(resumeFile);
      } catch (error) {
        console.error("Error parsing resume:", error);
        setLoading(false);
        return;
      }
    }
    const sanitizedContent = sanitizeResumeContent(resumeContent);
    console.log(sanitizedContent);
  
    // Prepare the input prompt
    const InputPrompt = `You are an expert interviewer preparing questions for a job interview. The candidate's profile is as follows:
  - Job Position: ${jobPosition}
  - Job Description: ${jobDesc}
  - Years of Experience: ${jobExperience}
  - Resume Content: ${sanitizedContent}

  Based on this profile, generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} well-balanced Interview questions with answers in JSON format. Ensure that the questions are realistic and tailored to the candidate's experience and job role. The questions should include:

  - A mix of Simple and Practical questions.
  - Simple questions covering fundamental concepts and theory relevant to the job role.
  - Practical questions based on the resume content, job position, and job description, including:
    - A coding problem related to data structures or algorithms, or a story-based DSA problem.
    - A design question that reflects real-world challenges in the role.
    - Solutions with example code and explanations in C++ or Java.
    - Difficulty levels (Beginner, Intermediate, Advanced).
    - Relevant programming languages or technologies used in the job role.
    
  Format:
  [
    {
      "Question": "Question text",
      "Answer": "Answer text",
      "Type": "Simple" | "Practical",
      "Difficulty": "Beginner" | "Intermediate" | "Advanced",
      "Language": "Programming language" (optional for Simple Question),
      "Technology": "Technology" (optional for Simple Question)
    }
  ]`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      let rawResponse = (await result.response.text()).trim();
      
      // Log rawResponse for debugging
      console.log("Raw Response:", rawResponse);

      // Clean the raw response
      let cleanedResponse = cleanJSON(rawResponse);
      console.log("Cleaned Response:", cleanedResponse);

      // Extract JSON part by finding the first and last occurrences of square brackets
      let jsonString;
      try {
        const startIndex = cleanedResponse.indexOf('[');
        const endIndex = cleanedResponse.lastIndexOf(']') + 1;

        if (startIndex === -1 || endIndex === -1) {
          throw new Error('Invalid JSON format: No valid JSON array found.');
        }

        jsonString = cleanedResponse.substring(startIndex, endIndex).trim();
        console.log("Extracted JSON String:", jsonString);

        // Validate and parse JSON response
        let parsedJsonResp;
        try {
          parsedJsonResp = JSON.parse(jsonString);
          console.log("Parsed JSON Response:", parsedJsonResp);
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          throw new Error("Invalid JSON format in response");
        }

        // Optional: Validate the structure of the parsed JSON
        const schema = {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              Question: { type: 'string' },
              Answer: { type: 'string' },
              Type: { type: 'string', enum: ['Simple', 'Practical'] },
              Difficulty: { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'] },
              Language: { type: 'string' },
              Technology: { type: 'string' }
            },
            required: ['Question', 'Answer', 'Type']
          }
        };

        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const isValid = validate(parsedJsonResp);
        if (!isValid) {
          console.error('Invalid JSON schema:', validate.errors);
          throw new Error('JSON response does not match the expected schema');
        }

        setJsonResponse(parsedJsonResp);

        const resp = await db.insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: JSON.stringify(parsedJsonResp),
            jobPosition: jobPosition,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-YYYY')
          })
          .returning({ mockId: MockInterview.mockId });

        console.log("Inserted ID:", resp);

        if (resp) {
          setOpenDialog(false);
          router.push('/dashboard/interview/' + resp[0]?.mockId);
        } else {
          console.error("Error inserting data into the database.");
        }
      } catch (error) {
        console.error("Error during the interview creation process:", error);
        throw new Error("Invalid JSON format in response");
      }
    } catch (error) {
      console.error("Error during the interview creation process:", error);
    } finally {
      setLoading(false);
    }
  }

  
  // Clean JSON function
  
  
  // Custom function to clean and validate JSON
  
  
  
  // Custom function to clean and validate JSON
  
  
  

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className="p-6 border rounded-lg bg-gradient-to-r from-blue-500 via-green-500 to-teal-500 hover:scale-105 hover:shadow-lg cursor-pointer transition-transform"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center text-white font-bold">+ Add New</h2>
      </div>
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
        <DialogTrigger />
        <DialogContent
          className="max-w-lg mx-auto p-8 rounded-lg bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://www.w3schools.com/w3images/lights.jpg')",
            backgroundColor: '#ffffffb3', // semi-transparent white overlay for better text visibility
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription>
            <form onSubmit={onSubmit} className="space-y-5">
                <h2 className="text-lg text-white">
                  Add details about your job position/role, job description, and years of experience.
                </h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Job Role/Job Position
                    </label>
                    <Input
                      className="w-full p-2 border rounded"
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Job Description/Tech Stack (In Short)
                    </label>
                    <Input
                      className="w-full p-2 border rounded"
                      placeholder="Ex. React, Angular, Node.js, MySQL"
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Years of Experience
                    </label>
                    <Input
                      className="w-full p-2 border rounded"
                      placeholder="Ex. 5"
                      type="number"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                  <div>
                  <label className="block text-white font-semibold mb-2">
                      Resume
                    </label>
                    <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => setResumeFile(event.target.files[0])}
                   className="w-full p-2 border rounded"
                />
                  </div>
                </div>
                <div className="flex gap-4 justify-end mt-4">
                  <Button
                    type="button"
                    className="bg-gray-400 hover:bg-gray-600 transition"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700 transition" disabled={loading}
                  >
                    {loading ? <>
                      <LoaderCircle className="animate-spin" /> Generating Response From AI
                    </> : 'Start Interview'}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
