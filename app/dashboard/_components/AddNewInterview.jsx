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
import { chatSession } from "../../../utils/GeminiAIModal"
import {db} from "utils/db"
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "utils/schema";
import {v4 as uuidv4} from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading,setLoading]=useState(false);
  const [jsonResponse,setJsonResponse]=useState([]);
  const router=useRouter();
  const {user}=useUser();

  const onSubmit = async(e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobDesc, jobExperience, jobPosition);

    const InputPrompt="Job Position:"+jobPosition+",Job Description:"+jobDesc+",Years of Experience:"+jobExperience+",Depends on this information please give me "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" Interview question with Answered inJson Format,Give Question and Answered as filed in JSON"
    const result=await chatSession.sendMessage(InputPrompt);
    const MockJsonResp=(result.response.text()).replace('```json','').replace('```','');
    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp);
    if(MockJsonResp){
    const resp=await db.insert(MockInterview)
    .values({
      mockId:uuidv4(),
      jsonMockResp:MockJsonResp,
      jobPosition:jobPosition,
      jobDesc:jobDesc,
      jobExperience:jobExperience,
      createdBy:user?.primaryEmailAddress?.emailAddress,
      createdAt:moment().format('DD--MM-yyyy')
    }).returning({mockId:MockInterview.mockId});
    console.log("Inserted ID:",resp)
    if(resp){
      setOpenDialog(false);
      router.push('/dasboard/interview/'+resp[0]?.mockId)
    }
  }
  else {
    console.log("error");
  }
    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center p-4s">
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
                    <label className="block  text-white font-semibold mb-2">
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
                    {loading?<>
                    <LoaderCircle className="animate-spin" />'Generating Response From AI'
                    </>:'Start Interview'}
                    
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
