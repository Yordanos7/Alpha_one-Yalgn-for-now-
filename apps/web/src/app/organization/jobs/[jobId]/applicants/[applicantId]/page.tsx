"use client";

import Sidebar from "@/components/sidebar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"; // Added ScrollArea import
import { Search, FileText, Check, X, MessageSquare, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation"; // Added useRouter import
import { useSession } from "@/hooks/use-session";
import { redirect } from "next/navigation";

export default function ApplicantDetailPage() {
  const params = useParams();
  const jobId = params.jobId;
  const applicantId = params.applicantId;
  const router = useRouter(); // Initialized router
  const { session, isLoading } = useSession();

  // Simulate fetching applicant details based on jobId and applicantId
  const [applicantDetails, setApplicantDetails] = useState<any>(null);
  const [applicantLoading, setApplicantLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && session?.user?.accountType !== "ORGANIZATION") {
      redirect("/access-denied");
    }

    // Simulate API call to fetch applicant details
    const fetchApplicant = async () => {
      setApplicantLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setApplicantDetails({
        id: applicantId,
        name: "John Doe",
        avatar: "https://github.com/shadcn.png",
        rating: 4.5,
        proposalMessage: `I am highly interested in the Senior Frontend Developer position. My expertise in React and Next.js aligns perfectly with your requirements. I have a strong portfolio demonstrating my ability to deliver high-quality, scalable frontend solutions.`,
        budgetOffer: "ETB 23,000",
        attachments: [
          { name: "resume.pdf", url: "/uploads/resume.pdf" },
          { name: "portfolio.pdf", url: "/uploads/portfolio.pdf" },
        ],
      });
      setApplicantLoading(false);
    };
    if (!isLoading && session?.user?.accountType === "ORGANIZATION") {
      fetchApplicant();
    }
  }, [jobId, applicantId, session, isLoading]);

  if (isLoading || applicantLoading) {
    return (
      <div className="flex min-h-screen bg-[#202020] text-white">
        <Sidebar currentPage="applicant-detail" />
        <main className="flex-1 p-8 bg-[#202020] flex flex-col items-center justify-center">
          <p className="text-gray-400">Loading applicant details...</p>
        </main>
      </div>
    );
  }

  if (session?.user?.accountType !== "ORGANIZATION") {
    return (
      <div className="flex min-h-screen bg-[#202020] text-white">
        <Sidebar currentPage="applicant-detail" />
        <main className="flex-1 p-8 bg-[#202020] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="text-gray-400">
            You do not have permission to view this page.
          </p>
        </main>
      </div>
    );
  }

  if (!applicantDetails) {
    return (
      <div className="flex min-h-screen bg-[#202020] text-white">
        <Sidebar currentPage="applicant-detail" />
        <main className="flex-1 p-8 bg-[#202020] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500">
            Applicant Not Found
          </h1>
          <p className="text-gray-400">
            The applicant you are looking for does not exist for Job ID: {jobId}
            .
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#202020] text-white">
      <Sidebar currentPage="applicant-detail" />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#202020] flex flex-col">
        <ScrollArea className="flex-1 h-full pr-4">
          <Card className="bg-[#2C2C2C] p-8 rounded-lg mb-8">
            <div className="flex items-center mb-6">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage
                  src={applicantDetails.avatar}
                  alt={applicantDetails.name}
                />
                <AvatarFallback>
                  {applicantDetails.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{applicantDetails.name}</h1>
                <p className="text-gray-400">
                  Rating: {applicantDetails.rating}/5
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Proposal Message</h2>
              <p className="text-gray-300 leading-relaxed">
                {applicantDetails.proposalMessage}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Budget Offer</h2>
              <p className="text-gray-300">{applicantDetails.budgetOffer}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Attachments</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {applicantDetails.attachments.map((attachment: any) => (
                  <a
                    key={attachment.name}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#3A3A3A] p-4 rounded-lg flex flex-col items-center hover:bg-[#4A4A4A] transition-colors"
                  >
                    <FileText className="mb-2 text-yellow-500" size={32} />
                    <span className="text-sm text-center">
                      {attachment.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <Button
                variant="outline"
                className="bg-[#3A3A3A] border-none text-white"
                onClick={() =>
                  router.push(`/individual/profile/${applicantId}`)
                }
              >
                <User className="mr-2" size={20} /> View Profile
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
                <MessageSquare className="mr-2" size={20} /> Message
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2">
                <Check className="mr-2" size={20} /> Accept
              </Button>
              <Button variant="destructive">
                <X className="mr-2" size={20} /> Reject
              </Button>
            </div>
          </Card>
        </ScrollArea>
      </main>
    </div>
  );
}
