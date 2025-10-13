"use client";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  Calendar,
  Check,
  MoreVertical,
  Plus,
} from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="flex min-h-screen bg-[#202020] text-white">
      <Sidebar currentPage="messages" />

      {/* Main Chat Content */}
      <main className="flex-1 p-8 bg-[#202020] flex flex-col">
        {/* Chat Header */}
        <header className="flex items-center justify-between mb-8 bg-[#2C2C2C] p-4 rounded-lg">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-4">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">Sara M</p>
              <p className="text-sm text-gray-400">Open Job 20b</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-4 py-2">
              Open Job
            </Button>
            <MoreVertical className="text-gray-400" size={24} />
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#2C2C2C] rounded-lg mb-4">
          {/* Example incoming message */}
          <div className="flex items-start mb-4">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <div className="bg-[#3A3A3A] p-3 rounded-lg max-w-xs">
              <p>He is aue wouh aurk ou siarcestd to this bile tate.</p>
            </div>
          </div>

          {/* Example outgoing message with file */}
          <div className="flex justify-end mb-4">
            <div className="bg-yellow-500 text-black p-3 rounded-lg max-w-xs flex items-center">
              <Paperclip className="mr-2" size={16} />
              <span>design.brief.pdf</span>
            </div>
          </div>

          {/* Example incoming message */}
          <div className="flex items-start mb-4">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <div className="bg-[#3A3A3A] p-3 rounded-lg max-w-xs">
              <p>
                To sdhue thet time boage iath taat on we niire nd tnd shet grow
                hy cislese.
              </p>
            </div>
          </div>

          {/* Example outgoing message */}
          <div className="flex justify-end mb-4">
            <div className="bg-yellow-500 text-black p-3 rounded-lg max-w-xs">
              <p>design bried</p>
              <Check className="inline-block ml-2" size={16} />
            </div>
          </div>

          {/* Example incoming message with file */}
          <div className="flex items-start mb-4">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <div className="bg-[#3A3A3A] p-3 rounded-lg max-w-xs flex items-center">
              <Paperclip className="mr-2" size={16} />
              <span>Sele biup u htie cl.id pod</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 text-center">Sara is typing...</p>
        </div>

        {/* Chat Input */}
        <div className="bg-[#2C2C2C] p-4 rounded-lg flex items-center">
          <div className="flex items-center space-x-2 mr-4">
            <Plus className="text-gray-400" size={24} />
            <Paperclip className="text-gray-400" size={24} />
            <Smile className="text-gray-400" size={24} />
          </div>
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1 pr-4 py-2 rounded-lg bg-[#3A3A3A] border-none text-white focus:ring-0 focus:outline-none"
          />
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg px-6 py-2 ml-4">
            Send
          </Button>
        </div>
      </main>
    </div>
  );
}
