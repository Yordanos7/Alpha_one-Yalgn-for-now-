"use client";

import Sidebar from "@/components/sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Briefcase, DollarSign, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session"; // Added useSession import

export default function ApplicationsPage() {
  const router = useRouter();
  const { session, isLoading } = useSession(); // Get session and loading state

  // No session or modal state needed for this generic job posts page

  return (
    <div className="flex min-h-screen bg-[#202020] text-white">
      <Sidebar currentPage="applications" />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#202020] flex flex-col">
        {/* Main Header for Job Posts */}
        <header className="flex items-center justify-between mb-8 bg-[#2C2C2C] p-4 rounded-lg">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Job Posts</h1>
            <p className="text-gray-400">
              Explore available job opportunities from various organizations.
            </p>
          </div>
          {!isLoading && session?.user?.accountType === "ORGANIZATION" && (
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2"
              onClick={() => router.push("/organization/jobs")}
            >
              Manage My Job Postings
            </Button>
          )}
          {!isLoading && session?.user?.accountType === "INDIVIDUAL" && (
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2"
              onClick={() => router.push("/individual/applications")}
            >
              View My Applications
            </Button>
          )}
        </header>

        {/* Filters */}
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
                Category: All
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#2C2C2C] text-white border-none">
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Design</DropdownMenuItem>
              <DropdownMenuItem>Development</DropdownMenuItem>
              <DropdownMenuItem>Marketing</DropdownMenuItem>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Job List */}
        <ScrollArea className="flex-1 h-full pr-4">
          {/* Example Job Card */}
          <Card
            className="bg-[#2C2C2C] p-6 rounded-lg mb-4 flex items-center justify-between cursor-pointer"
            onClick={() => router.push(`/jobs/123`)} // Example: Navigate to a dummy job ID
          >
            <div className="flex items-center">
              <Briefcase className="h-12 w-12 mr-4 text-yellow-500" size={32} />
              <div>
                <p className="text-xl font-semibold">
                  Senior Frontend Developer
                </p>
                <p className="text-gray-400">Acme Corp</p>{" "}
                {/* Organization Name */}
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <Users className="mr-1" size={16} />
                  <span>Applicants: 5</span>
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
                View Details
              </Button>
              {/* For individual providers, this would be an "Apply" button */}
              {/* For organizations, this might be "View Applicants" or "Edit Job" on their specific page */}
            </div>
          </Card>

          {/* Another Example Job Card */}
          <Card
            className="bg-[#2C2C2C] p-6 rounded-lg mb-4 flex items-center justify-between cursor-pointer"
            onClick={() => router.push(`/jobs/456`)} // Example: Navigate to another dummy job ID
          >
            <div className="flex items-center">
              <Briefcase className="h-12 w-12 mr-4 text-yellow-500" size={32} />
              <div>
                <p className="text-xl font-semibold">
                  Mobile App UI/UX Designer
                </p>
                <p className="text-gray-400">Global Solutions Inc.</p>{" "}
                {/* Organization Name */}
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <Users className="mr-1" size={16} />
                  <span>Applicants: 10</span>
                  <DollarSign className="ml-4 mr-1" size={16} />
                  <span>Budget: ETB 18,000</span>
                  <Calendar className="ml-4 mr-1" size={16} />
                  <span>Deadline: Dec 15, 2025</span>
                  <Badge className="ml-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
                View Details
              </Button>
            </div>
          </Card>

          {/* Generic Empty State */}
          {/*
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
            <Briefcase size={48} className="mb-4" />
            <p className="text-lg text-center">No job postings available yet. Check back later!</p>
          </div>
          */}
        </ScrollArea>
      </main>
    </div>
  );
}
