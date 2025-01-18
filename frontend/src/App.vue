<template>
  <div id="app">
    <div v-if="currentUser">
      <Header />
      <Chat />
    </div>
    <div v-else>
      <Login />
    </div>
  </div>
</template>

<script setup>
import { useAuth } from './authentication/auth';
import Header from './components/Sidebar.vue';
import Login from './components/Login.vue';
import Chat from './components/Chat.vue'; 
import Gemini from './components/Gemini.vue';

const { currentUser } = useAuth();
</script>
