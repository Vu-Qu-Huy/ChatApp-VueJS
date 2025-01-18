<template>
    <div class="flex flex-col h-screen max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <div class="p-4 bg-green-600 text-white text-center rounded-t-lg">
        <h3 class="m-0">Chat App using VueJS and Pocketbase</h3>
      </div>
  
      <div
        class="flex-1 p-4 overflow-y-auto bg-gray-100"
        ref="messagesContainer"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          class="mb-4 p-3 bg-white rounded-lg shadow"
        >
          <div class="flex items-center mb-2">
            <img
              class="w-8 h-8 rounded-full mr-2"
              :src="
                message.expand?.user?.avatar
                  ? `${baseUrl}/_pb_users_auth_/${message.expand.user.id}/${message.expand.user.avatar}`
                  : 'https://static.vecteezy.com/system/resources/thumbnails/036/594/092/small_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'
              "
              alt="avatar"
            />
            <span class="font-semibold text-gray-800">
              {{ message.expand?.user?.name || 'Anonymous' }}
            </span>
            <span class="ml-auto text-sm text-gray-600">
              {{ new Date(message.created).toLocaleTimeString() }}
            </span>
          </div>
          <p class="m-0 text-gray-800">{{ message.text }}</p>
        </div>
      </div>
  
      <form
        @submit.prevent="sendMessage"
        class="flex p-4 bg-gray-100 border-t border-gray-300"
      >
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
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  
  const baseUrl = 'http://127.0.0.1:8090/api/files';
  
  const pb = new PocketBase('http://127.0.0.1:8090');
  const currentUser = ref(pb.authStore.model);
  
  const messages = ref([]);
  const newMessage = ref('');
  const messagesContainer = ref(null);
  let unsubscribe = null;
  
  // Load initial messages and subscribe to real-time updates
  onMounted(async () => {
    try {
      // Get initial messages
      const resultList = await pb.collection('messages').getList(1, 50, {
        sort: 'created',
        expand: 'user', // Ensures related user details are included
      });
      messages.value = resultList.items;
  
      // Subscribe to real-time updates
      unsubscribe = await pb
        .collection('messages')
        .subscribe('*', async ({ action, record }) => {
          if (action === 'create') {
            try {
              // Expand user details dynamically if not already present
              if (!record.expand?.user) {
                const user = await pb.collection('users').getOne(record.user);
                record.expand = { user };
              }
              messages.value = [...messages.value, record];
              scrollToBottom();
            } catch (error) {
              console.error('Error fetching user details:', error);
            }
          }
          if (action === 'delete') {
            messages.value = messages.value.filter((m) => m.id !== record.id);
          }
        });
    } catch (error) {
      console.error('Error setting up chat:', error);
    }
  });
  
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
        text: newMessage.value.trim(),
        user: currentUser.value.id,
      };
      await pb.collection('messages').create(data);
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
