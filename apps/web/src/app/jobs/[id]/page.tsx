"use client";

import Sidebar from "@/components/sidebar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  DollarSign,
  Calendar,
  MapPin,
  Tag,
  Clock,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { redirect } from "next/navigation";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id; // Get job ID from URL
  const router = useRouter();
  const { session, isLoading } = useSession();

  // Simulate fetching job details based on jobId
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [jobLoading, setJobLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch job details from an API here
    // For now, simulate with a dummy object
    const fetchJob = async () => {
      setJobLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setJobDetails({
        id: jobId,
        title: "Senior Frontend Developer",
        organizationName: "Acme Corp",
        organizationLogo: "https://github.com/shadcn.png",
        location: "Addis Ababa, Ethiopia (Remote)",
        budget: "ETB 25,000 - 35,000",
        deadline: "Nov 30, 2025",
        status: "Active",
        applicantsCount: 5,
        description: `We are seeking a highly skilled and motivated Senior Frontend Developer to join our dynamic team. The ideal candidate will have extensive experience with modern JavaScript frameworks, particularly React and Next.js. You will be responsible for developing and maintaining user-facing features, optimizing applications for maximum speed and scalability, and collaborating with backend developers and UI/UX designers.`,
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GraphQL"],
      });
      setJobLoading(false);
    };
    fetchJob();
  }, [jobId]);

  if (isLoading || jobLoading) {
    return (
      <div className="flex min-h-screen bg-[#202020] text-white">
        <Sidebar currentPage="job-detail" />
        <main className="flex-1 p-8 bg-[#202020] flex flex-col items-center justify-center">
          <p className="text-gray-400">Loading job details...</p>
        </main>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="flex min-h-screen bg-[#202020] text-white">
        <Sidebar currentPage="job-detail" />
        <main className="flex-1 p-8 bg-[#202020] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500">Job Not Found</h1>
          <p className="text-gray-400">
            The job you are looking for does not exist.
          </p>
        </main>
      </div>
    );
  }

  const isIndividual = session?.user?.accountType === "INDIVIDUAL";
  const isOrganization = session?.user?.accountType === "ORGANIZATION";

  return (
    <div className="flex min-h-screen bg-[#202020] text-white">
      <Sidebar currentPage="job-detail" />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#202020] flex flex-col">
        <ScrollArea className="flex-1 h-full pr-4">
          <Card className="bg-[#2C2C2C] p-8 rounded-lg mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{jobDetails.title}</h1>
                <div className="flex items-center text-gray-400 text-sm">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage
                      src={jobDetails.organizationLogo}
                      alt={jobDetails.organizationName}
                    />
                    <AvatarFallback>
                      {jobDetails.organizationName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{jobDetails.organizationName}</span>
                  <MapPin className="ml-4 mr-1" size={16} />
                  <span>{jobDetails.location}</span>
                </div>
              </div>
              {isIndividual && (
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-6 py-3"
                  onClick={() => router.push(`/jobs/${jobId}/apply`)}
                >
                  Apply Now
                </Button>
              )}
              {isOrganization && (
                <Button
                  variant="outline"
                  className="bg-[#3A3A3A] border-none text-white"
                >
                  Edit Job
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-gray-400 text-sm">
              <div className="flex items-center">
                <DollarSign className="mr-2" size={16} />
                <span>Budget: {jobDetails.budget}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2" size={16} />
                <span>Deadline: {jobDetails.deadline}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2" size={16} />
                <span>
                  Status:{" "}
                  <Badge className="ml-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {jobDetails.status}
                  </Badge>
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Job Description</h2>
              <p className="text-gray-300 leading-relaxed">
                {jobDetails.description}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {jobDetails.skills.map((skill: string) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-[#3A3A3A] text-white px-3 py-1 rounded-full"
                  >
                    <Tag className="mr-1" size={14} /> {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Placeholder for other sections like "About Organization", "Contact Info" etc. */}
          </Card>

          {/* Placeholder for Similar Jobs */}
          <h2 className="text-2xl font-bold mb-4">Similar Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#2C2C2C] p-6 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">React Native Developer</p>
                <p className="text-gray-400 text-sm">Tech Solutions Ltd.</p>
              </div>
              <Button
                variant="outline"
                className="bg-[#3A3A3A] border-none text-white"
              >
                View Details
              </Button>
            </Card>
            <Card className="bg-[#2C2C2C] p-6 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">UI/UX Designer</p>
                <p className="text-gray-400 text-sm">Creative Agency</p>
              </div>
              <Button
                variant="outline"
                className="bg-[#3A3A3A] border-none text-white"
              >
                View Details
              </Button>
            </Card>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
