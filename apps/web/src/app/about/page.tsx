"use client";

import React from "react";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define colors for consistent use (can be moved to a global style if needed)
const COLORS = {
  primaryGold: "#D4AF37",
  darkBlue: "#0D1B2A",
  lightBackground: "#F7F3E9",
  accentBlue: "#4361EE",
};

export default function AboutPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center py-12 px-4"
      style={{ backgroundColor: COLORS.lightBackground }}
    >
      <main className="flex-grow w-full max-w-4xl mx-auto space-y-8">
        <Card className="shadow-lg rounded-xl" style={{ border: `1px solid ${COLORS.primaryGold}` }}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center" style={{ color: COLORS.darkBlue }}>
              About Yalegn
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-center text-gray-700 space-y-4 px-6 pb-6">
            <p>
              Yalegn is a revolutionary platform dedicated to connecting talent with opportunity.
              Our mission is to empower individuals and organizations by providing a seamless
              marketplace for freelance work, scholarships, mentorship, and professional networking.
            </p>
            <p>
              We believe in fostering a vibrant community where skills are recognized,
              knowledge is shared, and careers are built. Whether you're a freelancer
              seeking your next project, a student looking for scholarships, a mentor
              ready to guide, or an organization searching for top talent, Yalegn is
              your trusted partner.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl" style={{ border: `1px solid ${COLORS.primaryGold}` }}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center" style={{ color: COLORS.darkBlue }}>
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="text-md text-center text-gray-700 space-y-4 px-6 pb-6">
            <p>
              To create a world where every individual has access to opportunities
              that match their potential, and every organization can find the
              expertise they need to thrive. We envision a future where geographical
              boundaries do not limit talent, and collaboration drives innovation.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl" style={{ border: `1px solid ${COLORS.primaryGold}` }}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center" style={{ color: COLORS.darkBlue }}>
              Join Our Community
            </CardTitle>
          </CardHeader>
          <CardContent className="text-md text-center text-gray-700 px-6 pb-6">
            <p>
              Become a part of Yalegn today and start your journey towards
              growth, connection, and success.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
