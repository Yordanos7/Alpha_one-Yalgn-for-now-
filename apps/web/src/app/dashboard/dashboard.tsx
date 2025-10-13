"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Assuming a progress component exists or will be created
import {
  Bell,
  Search,
  Coins, // Assuming a Coins icon exists or will be created
  Home,
  MessageSquare,
  Wallet,
  List,
  Briefcase,
  BarChart,
  Settings,
  HelpCircle,
  LogOut,
  DollarSign,
  Package,
  Send,
  TrendingUp,
  Star,
} from "lucide-react"; // Assuming lucide-react is installed

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#202020] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2C2C2C] p-6 flex flex-col">
        <div className="flex items-center mb-8">
          <img src="/assets/logo.png" alt="Logo" className="h-8 mr-2" />{" "}
          {/* Placeholder for logo */}
          <span className="text-xl font-bold">Dashboard</span>
        </div>
        <nav className="flex-1">
          <ul>
            <li className="mb-4">
              <a
                href="#"
                className="flex items-center text-gray-400 hover:text-white"
              >
                <Home className="mr-3" size={20} />
                Dashboard (Home)
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                className="flex items-center text-gray-400 hover:text-white"
              >
                <MessageSquare className="mr-3" size={20} />
                Messages
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                className="flex items-center text-gray-400 hover:text-white"
              >
                <Wallet className="mr-3" size={20} />
                Wallet
              </a>
            </li>
            <li className="mb-4 border-l-4 border-yellow-500 pl-2">
              <a
                href="#"
                className="flex items-center text-white font-semibold"
              >
                <List className="mr-3" size={20} />
                My Listings
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                className="flex items-center text-gray-400 hover:text-white"
              >
                <Briefcase className="mr-3" size={20} />
                Applications / Jobs
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                className="flex items-center text-gray-400 hover:text-white"
              >
                <BarChart className="mr-3" size={20} />
                Analytics
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                className="flex items-center text-gray-400 hover:text-white"
              >
                <Settings className="mr-3" size={20} />
                Settings
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                className="flex items-center text-gray-400 hover:text-white"
              >
                <HelpCircle className="mr-3" size={20} />
                Help / Support
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                className="flex items-center text-gray-400 hover:text-white"
              >
                <LogOut className="mr-3" size={20} />
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#202020] flex">
        <div className="flex-1">
          {/* Header */}
          <header className="flex items-center justify-between mb-8 bg-[#2C2C2C] p-4 rounded-lg">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />{" "}
                {/* Placeholder profile image */}
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 rounded-lg bg-[#3A3A3A] border-none text-white focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="text-gray-400" size={24} />
              <div className="flex items-center bg-[#3A3A3A] px-3 py-1 rounded-full text-sm">
                <Coins className="mr-2 text-yellow-500" size={16} />
                <span>250 Coins</span>
              </div>
              <div className="flex items-center bg-[#3A3A3A] px-3 py-1 rounded-full text-sm">
                <Coins className="mr-2 text-yellow-500" size={16} />
                <span>250 cns</span>
              </div>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
                Create New Listing
              </Button>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#2C2C2C] p-6 rounded-lg flex flex-col items-center justify-center">
              <DollarSign className="text-yellow-500 mb-2" size={32} />
              <p className="text-2xl font-bold">ETB 14,500</p>
              <p className="text-gray-400">+ 250 Coins</p>
            </Card>
            <Card className="bg-[#2C2C2C] p-6 rounded-lg flex flex-col items-center justify-center">
              <Package className="text-yellow-500 mb-2" size={32} />
              <p className="text-2xl font-bold">12</p>
            </Card>
            <Card className="bg-[#2C2C2C] p-6 rounded-lg flex flex-col items-center justify-center">
              <Send className="text-yellow-500 mb-2" size={32} />
              <p className="text-2xl font-bold">8</p>
            </Card>
            <Card className="bg-[#2C2C2C] p-6 rounded-lg flex flex-col items-center justify-center">
              <TrendingUp className="text-yellow-500 mb-2" size={32} />
              <p className="text-2xl font-bold">ETB 52,300</p>
            </Card>
          </div>

          {/* Performance Graph */}
          <Card className="bg-[#2C2C2C] p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Dashboard Home</h2>
            <h3 className="text-lg font-medium mb-4">
              Performance Graph - Earnings per Month
            </h3>
            <div className="flex justify-end space-x-2 mb-4">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Week
              </Button>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Month
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
                Year
              </Button>
            </div>
            {/* Placeholder for the graph */}
            <div className="h-64 bg-[#3A3A3A] rounded-lg flex items-center justify-center text-gray-400">
              [Graph Placeholder]
            </div>
          </Card>

          {/* Profile Completion */}
          <Card className="bg-[#2C2C2C] p-6 rounded-lg flex items-center justify-between">
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
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />{" "}
                {/* Placeholder profile image */}
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
        </div>

        {/* Quick Stats Sidebar */}
        <aside className="w-64 ml-8 bg-[#2C2C2C] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="mb-4">
            <p className="text-gray-400">Earnings: +1,200</p>
            <p className="text-gray-400">ETB this week</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-400">
              Rating <Star className="inline-block text-yellow-500" size={16} />{" "}
              4,8
            </p>
          </div>
          <div>
            <p className="text-gray-400">Analytics</p>
            <p className="text-gray-400">15% growth</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
