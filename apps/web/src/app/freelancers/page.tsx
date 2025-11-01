"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  FreelancerFiltersState,
  RateType,
  ExperienceLevel,
  FreelancerLevel,
  EstimatedDelivery,
  Rating,
} from "@/types/freelancer"; // Import refined types
import { trpc } from "@/utils/trpc"; // Assuming this is your tRPC client setup
import type {
  CategoryEnum,
  ExperienceLevel as PrismaExperienceLevel,
  FreelancerLevel as PrismaFreelancerLevel,
  DeliveryTime as PrismaDeliveryTime,
} from "@alpha/db/prisma/generated/client";

// Define a type for a Freelancer (adjust based on your actual data structure from backend)
interface Freelancer {
  id: string;
  name: string;
  bio: string | null;
  location: string | null;
  isVerified: boolean;
  isOpenToWork: boolean;
  languages: string[];
  profile: {
    id: string;
    headline: string | null;
    hourlyRate: number | null;
    currency: "ETB" | "USD" | null;
    mainCategory: CategoryEnum | null;
    rateTypePreference: "FIXED" | "HOURLY" | null;
    experienceLevel: PrismaExperienceLevel | null;
    averageRating: number | null;
    freelancerLevel: PrismaFreelancerLevel | null;
    deliveryTime: PrismaDeliveryTime | null;
    skills: { skill: { name: string } }[];
  } | null;
}

export default function FreelancersPage() {
  const { data: categoryData, isLoading: isLoadingCategories } =
    trpc.category.getAll.useQuery();
  const { data: experienceData, isLoading: isLoadingExperiences } =
    trpc.category.getExperienceLevels.useQuery();
  const { data: levelData, isLoading: isLoadingLevels } =
    trpc.category.getFreelancerLevels.useQuery();
  const { data: deliveryData, isLoading: isLoadingDelivery } =
    trpc.category.getDeliveryTimes.useQuery();

  const [filters, setFilters] = useState<FreelancerFiltersState>({
    search: "",
    category: null,
    rateType: null,
    experiences: null,
    language: null,
    rating: null,
    level: null,
    estimatedDelivery: null,
    location: null,
    isVerified: null,
    isOpenToWork: null,
  });

  // Use tRPC hook to fetch data
  const {
    data: freelancers,
    isLoading,
    refetch,
  } = trpc.freelancer.getFilteredFreelancers.useQuery(
    {
      search: filters.search || undefined,
      category: filters.category as CategoryEnum | undefined,
      rateType: filters.rateType || undefined,
      experiences: filters.experiences || undefined,
      language: filters.language || undefined,
      rating: filters.rating || undefined,
      level: filters.level || undefined,
      estimatedDelivery: filters.estimatedDelivery || undefined,
      location: filters.location || undefined,
      isVerified: filters.isVerified || undefined,
      isOpenToWork: filters.isOpenToWork || undefined,
    },
    {
      // For now, it refetches on every filter change.
      // You might want to debounce this or trigger on a specific "Apply" button click
      refetchOnWindowFocus: false,
    }
  );

  // Trigger refetch when filters change
  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value as CategoryEnum }));
  };

  const handleRateTypeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, rateType: value as RateType }));
  };

  const handleExperiencesChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      experiences: value as ExperienceLevel,
    }));
  };

  const handleLanguageChange = (value: string) => {
    setFilters((prev) => ({ ...prev, language: value }));
  };

  const handleRatingChange = (value: string) => {
    setFilters((prev) => ({ ...prev, rating: parseInt(value) as Rating }));
  };

  const handleLevelChange = (value: string) => {
    setFilters((prev) => ({ ...prev, level: value as FreelancerLevel }));
  };

  const handleEstimatedDeliveryChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      estimatedDelivery: value as EstimatedDelivery,
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, location: e.target.value }));
  };

  const handleIsVerifiedChange = (value: boolean) => {
    setFilters((prev) => ({ ...prev, isVerified: value }));
  };

  const handleIsOpenToWorkChange = (value: boolean) => {
    setFilters((prev) => ({ ...prev, isOpenToWork: value }));
  };

  const clearFilters = () => {
    const clearedState = {
      search: "",
      category: null,
      rateType: null,
      experiences: null,
      language: null,
      rating: null,
      level: null,
      estimatedDelivery: null,
      location: null,
      isVerified: null,
      isOpenToWork: null,
    };
    setFilters(clearedState);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-4 mb-8 bg-[#2C2C2C] p-3 rounded-lg">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[180px] sm:min-w-[200px]">
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

        {/* Location Input */}
        <div className="relative flex-1 min-w-[180px] sm:min-w-[200px]">
          <Input
            type="text"
            placeholder="Location"
            className="pl-4 pr-4 py-2 rounded-lg bg-[#3A3A3A] border-none text-white focus:ring-0 focus:outline-none w-full"
            value={filters.location || ""}
            onChange={handleLocationChange}
          />
        </div>

        {/* Category Filter */}
        <Select
          onValueChange={handleCategoryChange}
          value={filters.category || ""}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-[#3A3A3A] text-white">
            {isLoadingCategories ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              categoryData?.categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* Rate Type Filter */}
        <Select
          onValueChange={handleRateTypeChange}
          value={filters.rateType || ""}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
            <SelectValue placeholder="Rate Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#3A3A3A] text-white">
            <SelectItem value="HOURLY">Hourly</SelectItem>
            <SelectItem value="FIXED">Fixed Price</SelectItem>
          </SelectContent>
        </Select>

        {/* Experiences Filter */}
        <Select
          onValueChange={handleExperiencesChange}
          value={filters.experiences || ""}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
            <SelectValue placeholder="Experiences" />
          </SelectTrigger>
          <SelectContent className="bg-[#3A3A3A] text-white">
            {isLoadingExperiences ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              experienceData?.experienceLevels.map((exp) => (
                <SelectItem key={exp.id} value={exp.id}>
                  {exp.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* Language Filter */}
        <Select
          onValueChange={handleLanguageChange}
          value={filters.language || ""}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="bg-[#3A3A3A] text-white">
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Amharic">Amharic</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            {/* Add more languages as needed */}
          </SelectContent>
        </Select>

        {/* Rating Filter */}
        <Select
          onValueChange={handleRatingChange}
          value={filters.rating?.toString() || ""}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
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
          <SelectTrigger className="w-full sm:w-[160px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent className="bg-[#3A3A3A] text-white">
            {isLoadingLevels ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              levelData?.freelancerLevels.map((lvl) => (
                <SelectItem key={lvl.id} value={lvl.id}>
                  {lvl.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* Estimated Delivery Filter */}
        <Select
          onValueChange={handleEstimatedDeliveryChange}
          value={filters.estimatedDelivery || ""}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
            <SelectValue placeholder="Estimated Delivery" />
          </SelectTrigger>
          <SelectContent className="bg-[#3A3A3A] text-white">
            {isLoadingDelivery ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              deliveryData?.deliveryTimes.map((time) => (
                <SelectItem key={time.id} value={time.id}>
                  {time.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* Is Verified Filter (Toggle Button or Select) */}
        <Select
          onValueChange={(value) => handleIsVerifiedChange(value === "true")}
          value={filters.isVerified?.toString() || ""}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
            <SelectValue placeholder="Verified" />
          </SelectTrigger>
          <SelectContent className="bg-[#3A3A3A] text-white">
            <SelectItem value="true">Verified</SelectItem>
            <SelectItem value="false">Not Verified</SelectItem>
          </SelectContent>
        </Select>

        {/* Is Open To Work Filter (Toggle Button or Select) */}
        <Select
          onValueChange={(value) => handleIsOpenToWorkChange(value === "true")}
          value={filters.isOpenToWork?.toString() || ""}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
            <SelectValue placeholder="Open to Work" />
          </SelectTrigger>
          <SelectContent className="bg-[#3A3A3A] text-white">
            <SelectItem value="true">Open to Work</SelectItem>
            <SelectItem value="false">Not Open to Work</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        <Button
          variant="ghost"
          className="text-gray-400 hover:text-white flex items-center"
          onClick={clearFilters}
        >
          <X className="mr-1" size={16} />
          Clear
        </Button>
      </div>

      {/* Freelancer List Section */}
      <h2 className="text-2xl font-bold mb-4 text-white">
        Available Freelancers
      </h2>
      {isLoading ? (
        <div className="text-white">Loading freelancers...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {freelancers && freelancers.length > 0 ? (
            freelancers.map(
              (
                freelancer: Freelancer // Explicitly typed freelancer
              ) => (
                <div
                  key={freelancer.id}
                  className="bg-[#2C2C2C] p-4 rounded-lg shadow-md text-white"
                >
                  <h3 className="text-lg font-semibold">{freelancer.name}</h3>
                  <p className="text-gray-400">
                    Category:{" "}
                    {freelancer.profile?.mainCategory?.replace(/_/g, " ") ||
                      "N/A"}
                  </p>
                  <p className="text-gray-400">
                    Rate Type: {freelancer.profile?.rateTypePreference || "N/A"}
                  </p>
                  <p className="text-gray-400">
                    Experience:{" "}
                    {freelancer.profile?.experienceLevel?.replace(/_/g, " ") ||
                      "N/A"}
                  </p>
                  <p className="text-gray-400">
                    Rating:{" "}
                    {freelancer.profile?.averageRating?.toFixed(1) || "N/A"}
                  </p>
                  <p className="text-gray-400">
                    Level:{" "}
                    {freelancer.profile?.freelancerLevel?.replace(/_/g, " ") ||
                      "N/A"}
                  </p>
                  <p className="text-gray-400">
                    Delivery:{" "}
                    {freelancer.profile?.deliveryTime?.replace(/_/g, " ") ||
                      "N/A"}
                  </p>
                  <p className="text-gray-400">
                    Location: {freelancer.location || "N/A"}
                  </p>
                  <p className="text-gray-400">
                    Verified: {freelancer.isVerified ? "Yes" : "No"}
                  </p>
                  <p className="text-gray-400">
                    Open to Work: {freelancer.isOpenToWork ? "Yes" : "No"}
                  </p>
                  {/* Render other freelancer details */}
                </div>
              )
            )
          ) : (
            <div className="col-span-full text-white">
              No freelancers found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
