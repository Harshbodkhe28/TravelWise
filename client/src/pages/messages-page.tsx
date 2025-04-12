import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Message, User, Agency } from "@shared/schema";
import { Loader2, Send, UserCircle, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch users with message history
  const { data: contacts, isLoading: isLoadingContacts } = useQuery<User[]>({
    queryKey: ["/api/contacts"],
  });

  // Fetch messages with selected user
  const { data: messages, isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: [`/api/messages/${selectedUserId}`],
    enabled: !!selectedUserId,
  });

  // Fetch agency info for each contact that is an agency
  const { data: agencies } = useQuery<Agency[]>({
    queryKey: ["/api/agencies"],
    enabled: !!contacts?.some(c => c.role === "agency"),
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/messages", {
        receiverId: selectedUserId,
        content
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${selectedUserId}`] });
      setMessageContent("");
    }
  });

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Filter contacts based on search term
  const filteredContacts = contacts?.filter(contact => {
    const agency = agencies?.find(a => a.userId === contact.id);
    const displayName = agency ? agency.companyName : contact.fullName;
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get agency info for a user if they are an agency
  const getAgencyInfo = (userId: number) => {
    return agencies?.find(a => a.userId === userId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim() || !selectedUserId) return;
    sendMessageMutation.mutate(messageContent);
  };

  return (
    <div className="container mx-auto pt-24 h-[calc(100vh-80px)]">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full gap-0 border rounded-lg overflow-hidden">
        {/* Contacts sidebar */}
        <div className="border-r">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-4">Messages</h2>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {isLoadingContacts ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredContacts?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No contacts found
              </div>
            ) : (
              <div>
                {filteredContacts?.map((contact) => {
                  const agency = getAgencyInfo(contact.id);
                  const displayName = agency ? agency.companyName : contact.fullName;
                  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase();
                  
                  return (
                    <div 
                      key={contact.id}
                      className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${selectedUserId === contact.id ? "bg-gray-50" : ""}`}
                      onClick={() => setSelectedUserId(contact.id)}
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{displayName}</p>
                        <p className="text-sm text-gray-500">
                          {agency ? "Travel Agency" : "Traveler"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
        
        {/* Messages area */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col">
          {!selectedUserId ? (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
              <UserCircle className="h-16 w-16 mb-4" />
              <p>Select a contact to start messaging</p>
            </div>
          ) : (
            <>
              {/* Selected contact header */}
              <div className="p-4 border-b flex items-center">
                {contacts && (
                  <>
                    {(() => {
                      const contact = contacts.find(c => c.id === selectedUserId);
                      if (!contact) return null;
                      
                      const agency = getAgencyInfo(contact.id);
                      const displayName = agency ? agency.companyName : contact.fullName;
                      const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase();
                      
                      return (
                        <>
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{displayName}</p>
                            <p className="text-sm text-gray-500">
                              {agency ? "Travel Agency" : "Traveler"}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-grow p-4">
                {isLoadingMessages ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : messages?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages?.map((message) => {
                      const isFromMe = message.senderId === user?.id;
                      
                      return (
                        <div 
                          key={message.id} 
                          className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
                        >
                          <div 
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              isFromMe 
                                ? "bg-primary text-white" 
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${isFromMe ? "text-white/80" : "text-gray-500"}`}>
                              {format(new Date(message.createdAt), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
              
              {/* Message input */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                  />
                  <Button type="submit" disabled={sendMessageMutation.isPending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
