"use client";

import React, { useState } from "react";
import { Search, ChevronDown, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming this path for Select component
import { FreelancerFiltersState } from "@/types/freelancer"; // Import the defined types

interface FreelancerFiltersProps {
  onApplyFilters: (filters: FreelancerFiltersState) => void;
  initialFilters?: FreelancerFiltersState;
}

export function FreelancerFilters({
  onApplyFilters,
  initialFilters,
}: FreelancerFiltersProps) {
  const [filters, setFilters] = useState<FreelancerFiltersState>(
    initialFilters || {
      search: "",
      category: null,
      rateType: null,
      experiences: null,
      language: null,
      rating: null,
      level: null,
      estimatedDelivery: null,
    }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }));
  };

  const handleRateTypeChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      rateType: value as FreelancerFiltersState["rateType"],
    }));
  };

  const handleExperiencesChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      experiences: value as FreelancerFiltersState["experiences"],
    }));
  };

  const handleLanguageChange = (value: string) => {
    setFilters((prev) => ({ ...prev, language: value }));
  };

  const handleRatingChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      rating: parseInt(value) as FreelancerFiltersState["rating"],
    }));
  };

  const handleLevelChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      level: value as FreelancerFiltersState["level"],
    }));
  };

  const handleEstimatedDeliveryChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      estimatedDelivery: value as FreelancerFiltersState["estimatedDelivery"],
    }));
  };

  // This button would trigger the actual filter application
  const applyFilters = () => {
    onApplyFilters(filters);
  };

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
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Category Filter */}
      <Select
        onValueChange={handleCategoryChange}
        value={filters.category || ""}
      >
        <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="bg-[#3A3A3A] text-white">
          <SelectItem value="web-development">Web Development</SelectItem>
          <SelectItem value="mobile-development">Mobile Development</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          {/* Add more categories */}
        </SelectContent>
      </Select>

      {/* Rate Type Filter */}
      <Select
        onValueChange={handleRateTypeChange}
        value={filters.rateType || ""}
      >
        <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
          <SelectValue placeholder="Rate Type" />
        </SelectTrigger>
        <SelectContent className="bg-[#3A3A3A] text-white">
          <SelectItem value="hourly">Hourly</SelectItem>
          <SelectItem value="fixed-price">Fixed Price</SelectItem>
        </SelectContent>
      </Select>

      {/* Experiences Filter */}
      <Select
        onValueChange={handleExperiencesChange}
        value={filters.experiences || ""}
      >
        <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
          <SelectValue placeholder="Experiences" />
        </SelectTrigger>
        <SelectContent className="bg-[#3A3A3A] text-white">
          <SelectItem value="entry">Entry Level</SelectItem>
          <SelectItem value="intermediate">Intermediate</SelectItem>
          <SelectItem value="expert">Expert</SelectItem>
        </SelectContent>
      </Select>

      {/* Language Filter */}
      <Select
        onValueChange={handleLanguageChange}
        value={filters.language || ""}
      >
        <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent className="bg-[#3A3A3A] text-white">
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="spanish">Spanish</SelectItem>
          <SelectItem value="french">French</SelectItem>
          {/* Add more languages */}
        </SelectContent>
      </Select>

      {/* Rating Filter */}
      <Select
        onValueChange={handleRatingChange}
        value={filters.rating?.toString() || ""}
      >
        <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent className="bg-[#3A3A3A] text-white">
          <SelectItem value="5">5 Stars</SelectItem>
          <SelectItem value="4">4 Stars & Up</SelectItem>
          <SelectItem value="3">3 Stars & Up</SelectItem>
          {/* Add more rating options */}
        </SelectContent>
      </Select>

      {/* Level Filter */}
      <Select onValueChange={handleLevelChange} value={filters.level || ""}>
        <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent className="bg-[#3A3A3A] text-white">
          <SelectItem value="junior">Junior</SelectItem>
          <SelectItem value="mid">Mid</SelectItem>
          <SelectItem value="senior">Senior</SelectItem>
        </SelectContent>
      </Select>

      {/* Estimated Delivery Filter */}
      <Select
        onValueChange={handleEstimatedDeliveryChange}
        value={filters.estimatedDelivery || ""}
      >
        <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
          <SelectValue placeholder="Estimated Delivery" />
        </SelectTrigger>
        <SelectContent className="bg-[#3A3A3A] text-white">
          <SelectItem value="1-3_days">1-3 Days</SelectItem>
          <SelectItem value="3-7_days">3-7 Days</SelectItem>
          <SelectItem value="1-2_weeks">1-2 Weeks</SelectItem>
          <SelectItem value="2-4_weeks">2-4 Weeks</SelectItem>
        </SelectContent>
      </Select>

      <Button
        className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-gray-300 font-semibold rounded-lg px-4 py-2 flex items-center"
        onClick={applyFilters}
      >
        <User className="mr-2" size={16} />
        Apply Filters
      </Button>
    </div>
  );
}
