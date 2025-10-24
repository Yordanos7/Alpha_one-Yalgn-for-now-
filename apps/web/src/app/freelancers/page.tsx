"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/sidebar";
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Star,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface Freelancer {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  description: string;
  imageUrl: string;
  skills: string[];
}

const freelancers: Freelancer[] = [
  {
    id: "1",
    name: "Samuel K. Jai J.",
    title: "Senior Develgiher",
    rating: 5.0,
    reviews: 299,
    description:
      "This al imiat eo lognmulice ter rter tnon cofte tism vwoi edhas.",
    imageUrl: "https://github.com/shadcn.png",
    skills: ["React", "Node.js", "TailwindCSS"],
  },
  {
    id: "2",
    name: "Compact Drme",
    title: "Web Develgther",
    rating: 5.0,
    reviews: 299,
    description:
      "This al imiat eo lognmulice ter rter tnon cofte tism vwoi edhas.",
    imageUrl: "https://github.com/shadcn.png",
    skills: ["Vue.js", "Express", "MongoDB"],
  },
  {
    id: "3",
    name: "Senior UI/X Designer",
    title: "Web Develgther",
    rating: 5.0,
    reviews: 299,
    description:
      "This al imiat eo lognmulice ter rter tnon cofte tism vwoi edhas.",
    imageUrl: "https://github.com/shadcn.png",
    skills: ["Figma", "Sketch", "UI/UX"],
  },
  {
    id: "4",
    name: "Starg Unn",
    title: "Graphic Designer",
    rating: 4.5,
    reviews: 150,
    description:
      "This al imiat eo lognmulice ter rter tnon cofte tism vwoi edhas.",
    imageUrl: "https://via.placeholder.com/150",
    skills: ["Photoshop", "Illustrator"],
  },
  {
    id: "5",
    name: "Fuls.:ck Deyijones",
    title: "Mobile Developer",
    rating: 4.8,
    reviews: 210,
    description:
      "This al imiat eo lognmulice ter rter tnon cofte tism vwoi edhas.",
    imageUrl: "https://via.placeholder.com/150",
    skills: ["React Native", "Flutter"],
  },
  {
    id: "6",
    name: "Smart Projector",
    title: "Data Scientist",
    rating: 4.2,
    reviews: 180,
    description:
      "This al imiat eo lognmulice ter rter tnon cofte tism vwoi edhas.",
    imageUrl: "https://via.placeholder.com/150",
    skills: ["Python", "R", "Machine Learning"],
  },
];

const FreelancerCard = ({ freelancer }: { freelancer: Freelancer }) => (
  <Card className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center">
    <Avatar className="h-24 w-24 mb-4">
      <AvatarImage src={freelancer.imageUrl} alt={freelancer.name} />
      <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
    </Avatar>
    <p className="text-lg font-semibold text-center mb-1">{freelancer.name}</p>
    <p className="text-sm text-gray-400 mb-2">{freelancer.title}</p>
    <div className="flex items-center mb-2">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={
            i < Math.floor(freelancer.rating)
              ? "text-yellow-500"
              : "text-gray-500"
          }
          size={16}
          fill={i < Math.floor(freelancer.rating) ? "currentColor" : "none"}
        />
      ))}
      <span className="text-sm text-gray-400 ml-2">
        ({freelancer.rating}) ({freelancer.reviews} relewe)
      </span>
    </div>
    <p className="text-sm text-gray-300 text-center mb-4">
      {freelancer.description}
    </p>
    <div className="flex space-x-2 mb-4">
      {freelancer.skills.map((skill, index) => (
        <span
          key={index}
          className="bg-[#3A3A3A] text-gray-300 text-xs px-2 py-1 rounded-full"
        >
          {skill}
        </span>
      ))}
    </div>
    <div className="flex space-x-4">
      <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md px-4 py-2">
        View Profile
      </Button>
      <Button
        variant="ghost"
        className="text-gray-400 hover:text-white font-semibold rounded-md px-4 py-2"
      >
        Message
      </Button>
    </div>
  </Card>
);

export default function FreelancersPage() {
  return (
    <div className="flex min-h-screen bg-[#202020] text-white">
      <Sidebar currentPage="freelancers" />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#202020] flex flex-col">
        {/* Top Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              src="/assets/logo.png"
              alt="Yalegn Marketplace"
              className="h-8 mr-2"
            />
            <span className="text-xl font-bold text-gray-200">
              Yalegn Marketplace
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/marketplace">
              <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md px-4 py-2">
                Products
              </Button>
            </Link>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Search and Filter Bar */}
        <div className="flex items-center space-x-4 mb-8 bg-[#2C2C2C] p-3 rounded-lg">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-lg bg-[#3A3A3A] border-none text-white focus:ring-0 focus:outline-none w-full"
            />
          </div>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Category <ChevronDown className="ml-1" size={16} />
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Rate Type <ChevronDown className="ml-1" size={16} />
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Experiences <ChevronDown className="ml-1" size={16} />
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Language <ChevronDown className="ml-1" size={16} />
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Rating <ChevronDown className="ml-1" size={16} />
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Level <ChevronDown className="ml-1" size={16} />
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Estimated Delivery <ChevronDown className="ml-1" size={16} />
          </Button>
          <Button className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-gray-300 font-semibold rounded-lg px-4 py-2 flex items-center">
            <User className="mr-2" size={16} />
            Freelancers
          </Button>
        </div>

        {/* Content area for freelancer grid and featured freelancers */}
        <div className="flex flex-1 space-x-8">
          {/* Freelancer Grid */}
          <div className="flex-1 grid grid-cols-3 gap-6">
            {freelancers.map((freelancer) => (
              <FreelancerCard key={freelancer.id} freelancer={freelancer} />
            ))}
          </div>

          {/* Featured Freelancers Sidebar */}
          <Card className="w-72 bg-[#2C2C2C] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Featured Freelancers</h3>
            <div className="space-y-4">
              {/* Freelancer Card 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>GD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Graphic Design</p>
                    <p className="text-sm text-gray-400">Graphic Designer</p>
                  </div>
                </div>
                <Star className="text-gray-400" size={16} />
              </div>
              {/* Freelancer Card 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>DC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">David Chen</p>
                    <p className="text-sm text-gray-400">Graphic Designer</p>
                  </div>
                </div>
                <Star className="text-gray-400" size={16} />
              </div>
              {/* Freelancer Card 3 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>DC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">David Chen</p>
                    <p className="text-sm text-gray-400">Web Developer</p>
                  </div>
                </div>
                <Star className="text-gray-400" size={16} />
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
