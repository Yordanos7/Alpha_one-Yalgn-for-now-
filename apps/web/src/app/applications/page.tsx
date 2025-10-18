"use client";

import Sidebar from "@/components/sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Briefcase,
  DollarSign,
  BarChart,
  Check,
  X,
  FileText,
  Calendar,
  Clock,
  Users,
  Plus,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function ApplicationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<"provider" | "seeker">("provider"); // "provider" or "seeker"

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex min-h-screen bg-[#202020] text-white">
      <Sidebar currentPage="applications" />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#202020] flex flex-col">
        {/* Tabs/Toggle for role selection */}
        <div className="mb-8">
          <Tabs
            defaultValue="provider"
            onValueChange={(value) =>
              setUserRole(value as "provider" | "seeker")
            }
          >
            <TabsList className="grid w-full grid-cols-2 bg-[#2C2C2C]">
              <TabsTrigger value="provider">My Applications</TabsTrigger>
              <TabsTrigger value="seeker">My Jobs</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {userRole === "provider" ? (
          <>
            {/* Provider View Header */}
            <header className="flex flex-col mb-8 bg-[#2C2C2C] p-4 rounded-lg">
              <h1 className="text-2xl font-bold">My Applications</h1>
              <p className="text-gray-400">
                Track the jobs you’ve applied to and manage your proposals.
              </p>
            </header>

            {/* Provider Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <Input
                placeholder="Search by job title..."
                className="flex-1 bg-[#3A3A3A] border-none text-white placeholder-gray-400"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-[#3A3A3A] border-none text-white"
                  >
                    Status: All
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#2C2C2C] text-white border-none">
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Submitted</DropdownMenuItem>
                  <DropdownMenuItem>Interview</DropdownMenuItem>
                  <DropdownMenuItem>In Progress</DropdownMenuItem>
                  <DropdownMenuItem>Completed</DropdownMenuItem>
                  <DropdownMenuItem>Rejected</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-[#3A3A3A] border-none text-white"
                  >
                    Sort by: Newest
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#2C2C2C] text-white border-none">
                  <DropdownMenuItem>Newest</DropdownMenuItem>
                  <DropdownMenuItem>Oldest</DropdownMenuItem>
                  <DropdownMenuItem>Budget</DropdownMenuItem>
                  <DropdownMenuItem>Client rating</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Provider Application List */}
            <ScrollArea className="flex-1 h-full pr-4">
              {/* Example Application Card */}
              <Card
                className="bg-[#2C2C2C] p-6 rounded-lg mb-4 flex items-center justify-between cursor-pointer"
                onClick={openModal}
              >
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl font-semibold">
                      Mobile App UI Design
                    </p>
                    <p className="text-gray-400">Acme Corp</p>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <Clock className="mr-1" size={16} />
                      <span>Applied on: Oct 15, 2025</span>
                      <DollarSign className="ml-4 mr-1" size={16} />
                      <span>Proposed: ETB 12,000</span>
                      <Badge className="ml-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Submitted
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="bg-[#3A3A3A] border-none text-white"
                  >
                    View Job
                  </Button>
                  <Button variant="destructive">Withdraw</Button>
                </div>
              </Card>

              {/* Empty State for Provider */}
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                <Briefcase size={48} className="mb-4" />
                <p className="text-lg text-center">
                  You haven’t applied to any jobs yet — explore new
                  opportunities in the Marketplace.
                </p>
                <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
                  Explore Marketplace
                </Button>
              </div>
            </ScrollArea>

            {/* Provider Dashboard Enhancements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {/* Progress Tracker (Placeholder) */}
              <Card className="bg-[#2C2C2C] p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Application Progress
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Proposal Sent</span>
                  <span>Client Viewed</span>
                  <span>Interview</span>
                  <span>Hired</span>
                  <span>Completed</span>
                </div>
                <Progress
                  value={40}
                  className="h-2 bg-[#3A3A3A] mt-2"
                  indicatorClassName="bg-yellow-500"
                />
              </Card>

              {/* Earnings Summary Widget (Placeholder) */}
              <Card className="bg-[#2C2C2C] p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Earnings Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-yellow-500">12</p>
                    <p className="text-gray-400 text-sm">Applied</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-500">3</p>
                    <p className="text-gray-400 text-sm">Hired</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">ETB 35,000</p>
                    <p className="text-gray-400 text-sm">This Month</p>
                  </div>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* Seeker View Header */}
            <header className="flex items-center justify-between mb-8 bg-[#2C2C2C] p-4 rounded-lg">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">My Jobs</h1>
                <p className="text-gray-400">
                  Manage your job postings and review applicants.
                </p>
              </div>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
                <Plus className="mr-2" size={20} /> Post New Job
              </Button>
            </header>

            {/* Seeker Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <Input
                placeholder="Search by job title..."
                className="flex-1 bg-[#3A3A3A] border-none text-white placeholder-gray-400"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-[#3A3A3A] border-none text-white"
                  >
                    Status: All
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#2C2C2C] text-white border-none">
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Draft</DropdownMenuItem>
                  <DropdownMenuItem>Closed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-[#3A3A3A] border-none text-white"
                  >
                    Sort by: Newest
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#2C2C2C] text-white border-none">
                  <DropdownMenuItem>Newest</DropdownMenuItem>
                  <DropdownMenuItem>Deadline</DropdownMenuItem>
                  <DropdownMenuItem>Most Applicants</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Seeker Job List */}
            <ScrollArea className="flex-1 h-full pr-4">
              {/* Example Job Card */}
              <Card
                className="bg-[#2C2C2C] p-6 rounded-lg mb-4 flex items-center justify-between cursor-pointer"
                onClick={openModal}
              >
                <div className="flex items-center">
                  <Briefcase
                    className="h-12 w-12 mr-4 text-yellow-500"
                    size={32}
                  />
                  <div>
                    <p className="text-xl font-semibold">
                      Senior Frontend Developer
                    </p>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <Users className="mr-1" size={16} />
                      <span>5 Applicants</span>
                      <DollarSign className="ml-4 mr-1" size={16} />
                      <span>Budget: ETB 25,000</span>
                      <Calendar className="ml-4 mr-1" size={16} />
                      <span>Deadline: Nov 30, 2025</span>
                      <Badge className="ml-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
                    View Applicants
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-[#3A3A3A] border-none text-white"
                  >
                    Edit Job
                  </Button>
                </div>
              </Card>

              {/* Empty State for Seeker */}
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                <Briefcase size={48} className="mb-4" />
                <p className="text-lg text-center">
                  You haven’t posted any jobs yet — post your first listing and
                  find the right talent!
                </p>
                <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
                  Post New Job
                </Button>
              </div>
            </ScrollArea>
          </>
        )}

        {/* Job Details Modal (shared for both roles, content will be dynamic) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-[#2C2C2C] p-8 rounded-lg w-1/2 max-w-2xl relative">
              <Button
                variant="ghost"
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={closeModal}
              >
                <X size={24} />
              </Button>
              {userRole === "provider" ? (
                <>
                  <div className="flex items-center mb-6">
                    <Search className="mr-3 text-gray-400" size={20} />
                    <h2 className="text-2xl font-bold">
                      Job Details: Mobile App UI Design
                    </h2>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-400">
                      You've moved a mobile UI Design project that requires a
                      strong understanding of user experience and visual
                      aesthetics. The project involves creating intuitive and
                      visually appealing interfaces for a mobile application.
                      Attention to detail and a passion for delivering
                      high-quality designs are crucial.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Proposal Summary
                    </h3>
                    <p className="text-gray-400">
                      My proposal for this project includes a comprehensive
                      approach to UI/UX design, focusing on user-centric
                      principles and modern aesthetics. I will deliver
                      high-fidelity mockups, interactive prototypes, and a
                      detailed design system.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Client Info</h3>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>AC</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Acme Corp</p>
                        <p className="text-gray-400 text-sm">
                          Client Rating: 4.8/5
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Timeline</h3>
                    <div className="flex items-center text-gray-400">
                      <Calendar className="mr-2" size={20} />
                      <span>Delivery Deadline: July 20, 2024</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-400">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2 ml-auto">
                      Message Client
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Applicant Detail Modal for Seeker */}
                  <div className="flex items-center mb-6">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">John Doe</h2>
                      <p className="text-gray-400">Rating: 4.5/5</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Proposal Message
                    </h3>
                    <p className="text-gray-400">
                      I am highly interested in the Senior Frontend Developer
                      position. My expertise in React and Next.js aligns
                      perfectly with your requirements. I have a strong
                      portfolio demonstrating my ability to deliver
                      high-quality, scalable frontend solutions.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Budget Offer</h3>
                    <p className="text-gray-400">ETB 23,000</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Attachments</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-[#3A3A3A] p-4 rounded-lg flex flex-col items-center">
                        <FileText className="mb-2 text-yellow-500" size={32} />
                        <span className="text-sm">resume.pdf</span>
                      </div>
                      <div className="bg-[#3A3A3A] p-4 rounded-lg flex flex-col items-center">
                        <FileText className="mb-2 text-yellow-500" size={32} />
                        <span className="text-sm">portfolio.pdf</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      className="bg-[#3A3A3A] border-none text-white"
                    >
                      View Profile
                    </Button>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
                      Message
                    </Button>
                    <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2">
                      Accept
                    </Button>
                    <Button variant="destructive">Reject</Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
