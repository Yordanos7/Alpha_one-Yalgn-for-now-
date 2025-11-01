"use client";

import React, { useState, useEffect } from "react";
import FreelancerFilters from "@/components/FreelancerFilters"; // Import the component
import type {
  FreelancerFiltersState,
  ExperienceLevel,
  FreelancerLevel,
  EstimatedDelivery,
  Rating,
} from "@/types/freelancer";
import { trpc } from "@/utils/trpc";
import type {
  CategoryEnum,
  ExperienceLevel as PrismaExperienceLevel,
  FreelancerLevel as PrismaFreelancerLevel,
  DeliveryTime as PrismaDeliveryTime,
} from "@Alpha/db/prisma/generated/client";

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
  // State for managing the filter states
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Section */}
      <FreelancerFilters filters={filters} setFilters={setFilters} />

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
