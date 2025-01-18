<template>
    <div class="flex flex-col h-screen max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <div class="p-4 bg-green-600 text-white text-center rounded-t-lg">
        <h3 class="m-0">Gemini Chat</h3>
      </div>
  
      <div class="flex-1 p-4 overflow-y-auto bg-gray-100" ref="messagesContainer">
        <div v-for="message in messages" :key="message.id" class="mb-4 p-3 bg-white rounded-lg shadow">
          <p class="m-0 text-gray-800">{{ message.text }}</p>
        </div>
      </div>
  
      <form @submit.prevent="sendMessage" class="flex p-4 bg-gray-100 border-t border-gray-300">
        <input 
          v-model="newMessage" 
          type="text" 
          placeholder="Type a message..." 
          class="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
        />
        <button type="submit" class="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 active:translate-y-1">
          Send
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import PocketBase from 'pocketbase';
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const pb = new PocketBase('http://127.0.0.1:8090');
  const currentUser = ref(pb.authStore.model);
  const messages = ref([]);
  const newMessage = ref('');
  const messagesContainer = ref(null);
  let unsubscribe = null;
  
  const userChatId = ref(null); // To store the specific chat ID for the user
  
  // Load initial messages and subscribe to real-time updates
  onMounted(async () => {
    if (currentUser.value) {
      await loadUserChat();
    }
  });
  
  const loadUserChat = async () => {
    try {
      // Fetch or create a chat for the current user
      const chat = await pb.collection('user_chats').getFirstListItem(`user = "${currentUser.value.id}"`);
  
      userChatId.value = chat.id;
      messages.value = chat.messages || [];
  
      // Subscribe to updates for this user's chat
      unsubscribe = await pb.collection('user_chats').subscribe(chat.id, async ({ action, record }) => {
        if (action === 'update') {
          messages.value = record.messages || [];
          scrollToBottom();
        }
      });
    } catch (error) {
      console.error('Error loading user chat:', error);
    }
  };
  
  // Cleanup subscription on component unmount
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
  
  // Send new message
  const sendMessage = async () => {
    if (!newMessage.value.trim() || !currentUser.value) return;
  
    try {
      const data = {
        user: currentUser.value.id,
        messages: [...messages.value, { text: newMessage.value.trim() }],
      };
  
      // Update the user's chat
      await pb.collection('user_chats').update(userChatId.value, data);
      newMessage.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    }, 100);
  };
  </script>
