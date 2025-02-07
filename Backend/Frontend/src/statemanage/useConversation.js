import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  messages: [],
  
  // ✅ Correctly append messages instead of replacing them
  setMessages: (newMessages) => 
    set((state) => ({ messages: [...state.messages, ...newMessages] })), 
  
  // ✅ Add method for adding a single message (for real-time updates)
  addMessage: (newMessage) =>
    set((state) => ({ messages: [...state.messages, newMessage] })), 

  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation, messages: [] }), // Reset messages on new chat
}));

export default useConversation;
