<template>
  <div id="app">
    <div v-if="currentUser">
      <Layout @response="(msg) => currentView = msg"> <!-- Listen for 'response' -->
        <div v-if="currentView === 'Chat'">
          <Chat />
        </div>
        <div v-else="currentView === 'Gemini'">
          <Gemini />
        </div>
      </Layout>
    </div>
    <div v-else>
      <Login />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from './authentication/auth';
import Layout from './components/Layout.vue';
import Login from './components/Login.vue';
import Chat from './components/Chat.vue';
import Gemini from './components/Gemini.vue';

// Use the authentication composable
const { currentUser } = useAuth();

// Ref to track the current view, default is 'Chat'
const currentView = ref('Chat');

// Debugging: Log current view changes
console.log('Initial currentView:', currentView.value);
</script>
