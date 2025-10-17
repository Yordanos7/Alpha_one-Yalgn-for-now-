// apps/web/src/app/messages/page.tsx
"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { getSocket } from "@/utils/socket";
import { useSession } from "@/components/providers"; // Assuming you have a useSession hook
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming you have a ScrollArea component
import { formatDistanceToNow } from "date-fns"; // You might need to install date-fns: npm install date-fns

type Conversation = Awaited<
  ReturnType<typeof trpc.conversation.list.query>
>[number];
type Message = Awaited<ReturnType<typeof trpc.message.list.query>>[number];

export default function MessagesPage() {
  const { session } = useSession();
  const userId = session?.user?.id;

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");

  const { data: conversations, refetch: refetchConversations } =
    trpc.conversation.list.useQuery(undefined, {
      enabled: !!userId,
    });
  const { data: messages, refetch: refetchMessages } =
    trpc.message.list.useQuery(
      { conversationId: selectedConversationId! },
      {
        enabled: !!selectedConversationId,
      }
    );
  const sendMessageMutation = trpc.message.send.useMutation({
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
      refetchConversations();
    },
  });

  useEffect(() => {
    const socket = getSocket();

    if (selectedConversationId) {
      socket.emit("joinConversation", selectedConversationId);

      const handleNewMessage = (message: Message) => {
        if (message.conversationId === selectedConversationId) {
          refetchMessages();
          refetchConversations();
        }
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.emit("leaveConversation", selectedConversationId);
      };
    }
  }, [selectedConversationId, refetchMessages, refetchConversations]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !selectedConversationId || !userId) return;

    const participant = conversations
      ?.find((c) => c.id === selectedConversationId)
      ?.participants.find((p) => p.id !== userId);

    if (participant) {
      sendMessageMutation.mutate({
        conversationId: selectedConversationId,
        toUserId: participant.id,
        body: newMessage,
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {" "}
      {/* Adjust height as needed */}
      {/* Conversation List */}
      <div className="w-1/4 border-r">
        <h2 className="p-4 text-lg font-semibold">Conversations</h2>
        <ScrollArea className="h-[calc(100%-60px)]">
          {conversations?.map((conversation) => {
            const otherParticipant = conversation.participants.find(
              (p) => p.id !== userId
            );
            const lastMessage = conversation.messages[0];
            return (
              <div
                key={conversation.id}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedConversationId === conversation.id
                    ? "bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
                onClick={() => setSelectedConversationId(conversation.id)}
              >
                <Avatar>
                  <AvatarImage
                    src={otherParticipant?.image || "/placeholder-avatar.jpg"}
                  />
                  <AvatarFallback>{otherParticipant?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">
                    {otherParticipant?.name || "Unknown User"}
                  </p>
                  {lastMessage && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {lastMessage.body} -{" "}
                      {formatDistanceToNow(new Date(lastMessage.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </div>
      {/* Message Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <>
            <div className="flex items-center gap-3 p-4 border-b">
              <Avatar>
                <AvatarImage
                  src={
                    conversations
                      ?.find((c) => c.id === selectedConversationId)
                      ?.participants.find((p) => p.id !== userId)?.image ||
                    "/placeholder-avatar.jpg"
                  }
                />
                <AvatarFallback>
                  {
                    conversations
                      ?.find((c) => c.id === selectedConversationId)
                      ?.participants.find((p) => p.id !== userId)?.name?.[0]
                  }
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold">
                {conversations
                  ?.find((c) => c.id === selectedConversationId)
                  ?.participants.find((p) => p.id !== userId)?.name ||
                  "Unknown User"}
              </h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.fromUserId === userId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.fromUserId === userId
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <p className="text-sm">{message.body}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isLoading}
              >
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
