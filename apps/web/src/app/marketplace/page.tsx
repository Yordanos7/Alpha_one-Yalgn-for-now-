"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/sidebar";
import {
  Search,
  DollarSign,
  Briefcase,
  Star,
  Check,
  Flag,
  Plus,
  Mail,
} from "lucide-react";

export default function MarketplacePage() {
  return (
    <div className="flex min-h-screen bg-[#202020] text-white">
      <Sidebar currentPage="marketplace" />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#202020] flex flex-col">
        {/* Top Header */}
        <header className="flex items-center justify-between mb-8 bg-[#2C2C2C] p-4 rounded-lg">
          <div className="flex items-center">
            <img
              src="/assets/logo.png"
              alt="Yalegn Marketplace"
              className="h-10 mr-4"
            />
            <span className="text-2xl font-bold">YALEGN MARKETPLACE</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="text"
                placeholder="Search for jobs or freelancers..."
                className="pl-10 pr-4 py-2 rounded-lg bg-[#3A3A3A] border-none text-white focus:ring-0 focus:outline-none w-80"
              />
            </div>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <DollarSign className="mr-2" size={16} />
              Category
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <Briefcase className="mr-2" size={16} />
              Budget
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <Star className="mr-2" size={16} />
              Time
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <Flag className="mr-2" size={16} />
              Language
            </Button>
          </div>
        </header>

        {/* Projects / Top Freelancers Toggle */}
        <div className="flex space-x-4 mb-8">
          <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-6 py-2">
            Projects
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Top Freelancers
          </Button>
        </div>

        {/* Hire from Ethiopia's Top Talent Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">
              Hire from Ethiopia's Top Talent
            </h2>
            <div className="flex space-x-4">
              {/* Talent Card 1 */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-yellow-500">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>TA</AvatarFallback>
                  </Avatar>
                  <img
                    src="/assets/ethiopian-flag.png"
                    alt="Ethiopian Flag"
                    className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white"
                  />
                </div>
                <div className="flex items-center mt-2">
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-gray-400" size={16} />
                </div>
              </div>
              {/* Talent Card 2 */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-yellow-500">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>TA</AvatarFallback>
                  </Avatar>
                  <img
                    src="/assets/ethiopian-flag.png"
                    alt="Ethiopian Flag"
                    className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white"
                  />
                </div>
                <div className="flex items-center mt-2">
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-gray-400" size={16} />
                </div>
              </div>
              {/* Talent Card 3 */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-yellow-500">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>TA</AvatarFallback>
                  </Avatar>
                  <img
                    src="/assets/ethiopian-flag.png"
                    alt="Ethiopian Flag"
                    className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white"
                  />
                </div>
                <div className="flex items-center mt-2">
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-gray-400" size={16} />
                </div>
              </div>
              {/* Talent Card 4 */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-yellow-500">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>TA</AvatarFallback>
                  </Avatar>
                  <img
                    src="/assets/ethiopian-flag.png"
                    alt="Ethiopian Flag"
                    className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white"
                  />
                </div>
                <div className="flex items-center mt-2">
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-gray-400" size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Progress Tracker */}
          <Card className="bg-[#2C2C2C] p-6 rounded-lg w-64 ml-8">
            <h3 className="text-lg font-semibold mb-4">
              Profile Progress Tracker
            </h3>
            <p className="text-2xl font-bold mb-2">85%</p>
            <Progress
              value={85}
              className="h-2 bg-[#3A3A3A] mb-4"
              indicatorClassName="bg-green-500"
            />
            <div className="flex items-center mb-2">
              <Check className="text-green-500 mr-2" size={20} />
              <span>Complete</span>
            </div>
            <div className="flex items-center mb-2">
              <Plus className="text-green-500 mr-2" size={20} />
              <span>Add portfolio</span>
            </div>
            <div className="flex items-center mb-2">
              <Check className="text-green-500 mr-2" size={20} />
              <span>Verify email</span>
            </div>
            <div className="flex items-center">
              <Mail className="text-green-500 mr-2" size={20} />
              <span>Verify email</span>
            </div>
          </Card>
        </div>

        {/* Featured Section */}
        <h2 className="text-xl font-semibold mb-4">Featured Section</h2>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#2C2C2C] p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Project</h3>
            <p className="text-xl font-bold mb-2">
              Build Modern Portfolio Website
            </p>
            <p className="text-gray-400 mb-4">Budget: ETB 5000 - 7,000</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Posted by: Meron A. (4.9)</p>
              <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2">
                Apply
              </Button>
            </div>
          </Card>
          <Card className="bg-[#2C2C2C] p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Samuel K. 4.8</h3>
            <p className="text-xl font-bold mb-2">
              I will design a professional logo in days
            </p>
            <p className="text-gray-400 mb-4">Deadline: 5 days</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Skills: React, TailwindCSS
              </p>
              <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2">
                Apply
              </Button>
            </div>
          </Card>
          <Card className="bg-[#2C2C2C] p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Service K. 4.8</h3>
            <p className="text-xl font-bold mb-2">
              I will design a professional logo in days
            </p>
            <p className="text-gray-400 mb-4">Price: ETB 2000</p>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                View Service
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2">
                View Service
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Feed */}
        <h2 className="text-xl font-semibold mb-4">Main Feed</h2>
        <div className="grid grid-cols-5 gap-6 mb-8">
          <Card className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Project"
              className="mb-2 rounded-lg"
            />
            <p className="text-sm font-semibold text-center">
              Recently Posted in Web Development
            </p>
          </Card>
          <Card className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Project"
              className="mb-2 rounded-lg"
            />
            <p className="text-sm font-semibold text-center">
              Top Rated in Web Development
            </p>
          </Card>
          <Card className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Project"
              className="mb-2 rounded-lg"
            />
            <p className="text-sm font-semibold text-center">
              Top Rated in Web Development
            </p>
          </Card>
          <Card className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Project"
              className="mb-2 rounded-lg"
            />
            <p className="text-sm font-semibold text-center">
              Category Graphic Design
            </p>
          </Card>
          <Card className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Project"
              className="mb-2 rounded-lg"
            />
            <p className="text-sm font-semibold text-center">
              Popular in this Week
            </p>
          </Card>
        </div>

        {/* Recently Posted in Addis Ababa */}
        <h2 className="text-xl font-semibold mb-4">
          Recently Posted in Addis Ababa
        </h2>
        <div className="grid grid-cols-5 gap-6">
          <Card className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Project"
              className="mb-2 rounded-lg"
            />
            <p className="text-sm font-semibold text-center">
              Recently Posted in Web Development
            </p>
          </Card>
          <Card className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Project"
              className="mb-2 rounded-lg"
            />
            <p className="text-sm font-semibold text-center">
              Top Rated in Web Development
            </p>
          </Card>
          <Card className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Project"
              className="mb-2 rounded-lg"
            />
            <p className="text-sm font-semibold text-center">
              Top Rated in Web Development
            </p>
          </Card>
          <Card className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Project"
              className="mb-2 rounded-lg"
            />
            <p className="text-sm font-semibold text-center">
              Category Graphic Design
            </p>
          </Card>
          <Card className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Project"
              className="mb-2 rounded-lg"
            />
            <p className="text-sm font-semibold text-center">
              Popular in this Week
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
