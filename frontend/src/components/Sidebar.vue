<template>
  <div>
    <!-- Mobile menu button -->
    <div class="lg:hidden fixed top-4 left-4 z-50">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        @click="isSidebarOpen = true"
      >
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="size-6" aria-hidden="true" />
      </button>
    </div>

    <!-- Backdrop -->
    <TransitionRoot appear :show="isSidebarOpen" as="template">
      <div
        class="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40"
        @click="isSidebarOpen = false"
      />
    </TransitionRoot>

    <!-- Sidebar -->
    <TransitionRoot appear :show="true" as="template">
      <div
        :class="[ 
          'fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md transform transition-all duration-300 ease-in-out shadow-xl',
          'border-r border-gray-200/80',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ]"
      >
        <!-- Logo Area -->
        <div
          class="flex h-16 items-center justify-between px-6 border-b border-gray-200/80 bg-white/50"
        >
          <a href="#" class="flex items-center space-x-3">
            <img
              class="h-12 w-auto"
              src="../assets/logo.svg"
              alt="Chat App"
            />
            <span class="font-semibold text-gray-900">Chat App</span>
          </a>
          <button
            type="button"
            class="lg:hidden rounded-full p-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            @click="isSidebarOpen = false"
          >
            <span class="sr-only">Close sidebar</span>
            <XMarkIcon class="size-5" aria-hidden="true" />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-col h-[calc(100vh-4rem)] p-4">
          <!-- User Profile -->
          <div
            class="flex items-center space-x-4 px-4 py-2 mb-4 border-b border-gray-200/80"
          >
            <img
              v-if="fullAvatarUrl"
              :src="fullAvatarUrl"
              alt="Profile Image"
              class="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ currentUser?.name || "Guest" }}
              </p>
              <p class="text-sm text-gray-500">
                {{ currentUser?.email || "No email" }}
              </p>
            </div>
          </div>

          <!-- Main Navigation -->
          <div class="space-y-1">
            <button
              @click="currentView = 'Chat'"
              class="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100/80 transition-colors duration-200"
            >
              <ChatBubbleLeftIcon class="size-5 text-gray-500" />
              <span>Chat</span>
            </button>
            <button
              @click="currentView = 'Gemini'"
              class="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100/80 transition-colors duration-200"
            >
              <ChatBubbleLeftIcon class="size-5 text-gray-500" />
              <span>Gemini</span>
            </button>
          </div>

          <!-- Logout -->
          <div
            class="mt-auto border-t border-gray-200/80 pt-4 space-y-2"
          >
            <button
              type="button"
              @click="doLogout"
              class="flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <span class="flex items-center space-x-2">
                <ArrowRightIcon class="size-5 text-red-500" />
                <span>Logout</span>
              </span>
            </button>
          </div>
        </nav>
      </div>
    </TransitionRoot>

    <!-- Main Content Area -->
    <div class="ml-64 p-4">
      <component :is="currentViewComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { TransitionRoot } from "@headlessui/vue";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/vue/24/outline";
import { useAuth } from "../authentication/auth"; // Assuming you have an auth composable
import Chat from "./Chat.vue";
import Gemini from "./Gemini.vue";

const navItems = [
  { name: "Chats", icon: ChatBubbleLeftIcon },
];

const isSidebarOpen = ref(false);
const currentView = ref("Chat");
const currentViewComponent = computed(() => {
  return currentView.value === "Chat" ? Chat : Gemini;
});
const { currentUser, doLogout } = useAuth();

// Compute the full avatar URL
const fullAvatarUrl = computed(() => {
  if (
    currentUser?.value?.avatar &&
    currentUser?.value?.collectionId &&
    currentUser?.value?.id
  ) {
    const baseUrl = "http://127.0.0.1:8090/api/files";
    return `${baseUrl}/${currentUser.value.collectionId}/${currentUser.value.id}/${currentUser.value.avatar}`;
  }
  return null; // Return null if any field is missing
});
</script>
