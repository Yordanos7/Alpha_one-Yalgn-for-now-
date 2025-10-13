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
} from "lucide-react";

export default function ApplicationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex min-h-screen bg-[#202020] text-white">
      <Sidebar currentPage="applications" />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#202020] flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 bg-[#2C2C2C] p-4 rounded-lg">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-6">Applications / Jobs</h1>
            <div className="flex space-x-2">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
                Active
              </Button>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Pending
              </Button>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Rejected
              </Button>
            </div>
          </div>
          <div className="flex items-center bg-[#3A3A3A] px-3 py-1 rounded-full text-sm">
            <BarChart className="mr-2 text-yellow-500" size={16} />
            <span>ETB 52,000</span>
          </div>
        </header>

        {/* Application List */}
        <div className="flex-1 overflow-y-auto">
          <Card
            className="bg-[#2C2C2C] p-6 rounded-lg mb-4 flex items-center justify-between"
            onClick={openModal}
          >
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>MA</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-semibold">Mobile App UI Design</p>
                <p className="text-gray-400">Acme Corp</p>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <DollarSign className="mr-1" size={16} />
                  <span>ETB 12,000</span>
                  <span className="ml-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                  <span className="ml-4">ETB 12,000</span>
                </div>
              </div>
            </div>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
              Open Chat
            </Button>
          </Card>

          <Card
            className="bg-[#2C2C2C] p-6 rounded-lg mb-4 flex items-center justify-between"
            onClick={openModal}
          >
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>MA</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-semibold">Mobile App UI Design</p>
                <p className="text-gray-400">Acme Corp</p>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <DollarSign className="mr-1" size={16} />
                  <span>ETB 12,000</span>
                  <span className="ml-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                  <span className="ml-4">ETB 12,000</span>
                </div>
              </div>
            </div>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
              Open Chat
            </Button>
          </Card>
        </div>

        {/* Profile Completion (from dashboard) */}
        <Card className="bg-[#2C2C2C] p-6 rounded-lg flex items-center justify-between mt-8">
          <div className="flex items-center">
            <span className="mr-4">Profile Completion: 75%</span>
            <div className="w-48">
              <Progress
                value={75}
                className="h-2 bg-[#3A3A3A]"
                indicatorClassName="bg-yellow-500"
              />
            </div>
            <Avatar className="h-10 w-10 ml-4">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="ml-4 text-sm text-gray-400">
              Tips: Verify ID for 20% higher trust
            </p>
          </div>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
            Complete Your Profile
          </Button>
        </Card>
      </main>

      {/* Job Details Modal */}
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
            <div className="flex items-center mb-6">
              <Search className="mr-3 text-gray-400" size={20} />
              <h2 className="text-2xl font-bold">
                Job Details: Mobile App UI Design
              </h2>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-400">
                You've moved a mobile UI Design project that requires a strong
                understanding of user experience and visual aesthetics. The
                project involves creating intuitive and visually appealing
                interfaces for a mobile application. Attention to detail and a
                passion for delivering high-quality designs are crucial.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Files Exchanged</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#3A3A3A] p-4 rounded-lg flex flex-col items-center">
                  <FileText className="mb-2 text-yellow-500" size={32} />
                  <span className="text-sm">Breif Aistite</span>
                </div>
                <div className="bg-[#3A3A3A] p-4 rounded-lg flex flex-col items-center">
                  <FileText className="mb-2 text-yellow-500" size={32} />
                  <span className="text-sm">design_brief.pdf</span>
                </div>
                <div className="bg-[#3A3A3A] p-4 rounded-lg flex flex-col items-center">
                  <FileText className="mb-2 text-yellow-500" size={32} />
                  <span className="text-sm">design_brief.pdf</span>
                </div>
                <div className="bg-[#3A3A3A] p-4 rounded-lg flex flex-col items-center">
                  <FileText className="mb-2 text-yellow-500" size={32} />
                  <span className="text-sm">design_brief.pdf</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Payment Milestones</h3>
              <div className="flex items-center mb-2">
                <Check className="text-green-500 mr-2" size={20} />
                <span>50% Upon Design Approval</span>
                <span className="ml-auto">$50.00</span>
              </div>
              <div className="flex items-center">
                <Check className="text-green-500 mr-2" size={20} />
                <span>Desedenip or Restinld</span>
                <span className="ml-auto">$50.00</span>
              </div>
            </div>

            <div className="flex items-center text-gray-400">
              <Calendar className="mr-2" size={20} />
              <span>Delivery Deadline: July 20, 2024</span>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2 ml-auto">
                Open Chat
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
