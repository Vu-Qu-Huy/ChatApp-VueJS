<template>
    <div class="flex flex-col h-screen max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <div class="p-4 bg-green-600 text-white text-center rounded-t-lg">
        <h3 class="m-0">Gemini Chat</h3>
      </div>
  
      <div class="flex-1 p-4 overflow-y-auto bg-gray-100" ref="messagesContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index" 
          :class="{
            'mb-4 p-3 rounded-lg shadow': true,
            'bg-white': message.type === 'user',
            'bg-green-100': message.type === 'bot',
          }"
        >
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
        <button 
          type="submit" 
          class="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 active:translate-y-1"
        >
          Send
        </button>
      </form>
    </div>
</template>
  
<script setup>
  import PocketBase from 'pocketbase';
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const pb = new PocketBase('http://127.0.0.1:8090');
  const currentUser = ref(pb.authStore.model); // Current logged-in user
  const messages = ref([]); // User-specific chat messages
  const newMessage = ref(''); // New message input
  const messagesContainer = ref(null); // Reference for scrolling
  let unsubscribe = null; // Real-time subscription cleanup
  
  // Fetch and load user chat messages
  const loadMessages = async () => {
    try {
      const res = await pb.collection('chat_messages').getFullList({
        filter: `user = "${currentUser.value.id}"`,
        sort: 'created_at',
      });
      messages.value = res.map(msg => ({
        id: msg.id,
        text: msg.content,
        type: msg.type, 
      }));
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };
  
  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.value.trim() || !currentUser.value) return;
  
    try {
      // Add user message to "chat_messages" collection
      const userMessage = {
        user: currentUser.value.id,
        content: newMessage.value.trim(),
        type: 'user',
      };
      console.log(userMessage);
      await pb.collection('chat_messages').create(userMessage);
      console.log(JSON.stringify({ message: newMessage.value.trim() }));
      console.log('Message sent');
      
      // Call the backend for AI response
      const encodedMessage = encodeURIComponent(newMessage.value.trim());
      newMessage.value = '';
      console.log(encodedMessage);
      const response = await pb.send(`/api/${encodedMessage}`, {
            method: 'POST',
      });
      console.log(response.message);
      const botMessage = {
        user: currentUser.value.id,
        content: response.message,
        type: 'bot',
      };

      await pb.collection('chat_messages').create(botMessage);
  

      scrollToBottom();

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Subscribe to real-time updates
  const subscribeToUpdates = async () => {
    if (!currentUser.value) return;
  
    unsubscribe = await pb.collection('chat_messages').subscribe('*', ({ action, record }) => {
      if (action === 'create' && record.user === currentUser.value.id) {
        messages.value.push({
          id: record.id,
          text: record.content,
          type: record.type,
        });
        scrollToBottom();
      }
    });
  };
  
  // Scroll to the bottom of the messages container
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    }, 100);
  };
  
  // Cleanup subscription on unmount
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
  
  // Load messages and subscribe on component mount
  onMounted(async () => {
    if (currentUser.value) {
      await loadMessages();
      await subscribeToUpdates();
    }
  });
  </script>
  
  <style scoped>
  /* You can add custom styles here */
  </style>
  