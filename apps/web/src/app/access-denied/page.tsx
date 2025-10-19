"use client";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen bg-[#202020] text-white">
      <Sidebar currentPage="access-denied" />
      <main className="flex-1 p-8 bg-[#202020] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-400 mb-8 text-center">
          You do not have the necessary permissions to view this page.
        </p>
        <Link href="/">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-6 py-3">
            Go to Homepage
          </Button>
        </Link>
      </main>
    </div>
  );
}
