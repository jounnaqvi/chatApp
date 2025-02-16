import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  messages: [],

  // ✅ Overwrite messages instead of appending
  setMessages: (newMessages) => 
    set(() => ({ messages: Array.isArray(newMessages) ? newMessages : [] })),

  // ✅ Append only unique messages (avoids duplicates)
  addMessage: (newMessage) => 
    set((state) => {
      if (!newMessage || typeof newMessage !== "object") return state;

      const exists = state.messages.some((msg) => msg._id === newMessage._id);
      if (!exists) {
        return { messages: [...state.messages, newMessage] };
      }
      return state;
    }),

  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation, messages: [] }), // ✅ Reset messages on new chat
}));

export default useConversation;
