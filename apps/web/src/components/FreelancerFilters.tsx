import React from "react";
import { Search, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FreelancerFilters() {
  return (
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
  );
}
