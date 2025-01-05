<template>
  <div>
    <!-- Mobile menu button with smooth hover effect -->
    <div class="lg:hidden fixed top-4 left-4 z-50">
      <button type="button" 
        class="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        @click="isSidebarOpen = true">
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="size-6" aria-hidden="true" />
      </button>
    </div>

    <!-- Improved backdrop with blur effect -->
    <TransitionRoot appear :show="isSidebarOpen" as="template">
      <div class="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40" @click="isSidebarOpen = false" />
    </TransitionRoot>

    <!-- Enhanced Sidebar -->
    <TransitionRoot appear :show="true" as="template">
      <div :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md transform transition-all duration-300 ease-in-out shadow-xl',
        'border-r border-gray-200/80',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]">
        <!-- Refined Logo Area -->
        <div class="flex h-16 items-center justify-between px-6 border-b border-gray-200/80 bg-white/50">
          <a href="#" class="flex items-center space-x-3">
            <img class="h-8 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
            <span class="font-semibold text-gray-900">Dashboard</span>
          </a>
          <button type="button" 
            class="lg:hidden rounded-full p-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200" 
            @click="isSidebarOpen = false">
            <span class="sr-only">Close sidebar</span>
            <XMarkIcon class="size-5" aria-hidden="true" />
          </button>
        </div>

        <!-- Improved Navigation -->
        <nav class="flex flex-col h-[calc(100vh-4rem)] p-4">
          <div class="space-y-1">
            <!-- Enhanced Products Dropdown -->
            <Disclosure v-slot="{ open }" defaultOpen>
              <DisclosureButton 
                class="flex w-full items-center justify-between rounded-lg py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-100/80 transition-colors duration-200"
                :class="open ? 'bg-gray-100/80' : ''">
                <span class="flex items-center space-x-2">
                  <CubeIcon class="size-5 text-gray-500" />
                  <span>Products</span>
                </span>
                <ChevronDownIcon 
                  :class="[open ? 'rotate-180' : '', 'size-5 flex-none text-gray-500 transition-transform duration-200']" 
                  aria-hidden="true" />
              </DisclosureButton>
              <TransitionChild
                enter="transition duration-200 ease-out"
                enter-from="transform scale-95 opacity-0"
                enter-to="transform scale-100 opacity-100"
                leave="transition duration-150 ease-in"
                leave-from="transform scale-100 opacity-100"
                leave-to="transform scale-95 opacity-0">
                <DisclosurePanel class="mt-1 space-y-1">
                  <a v-for="item in products" 
                    :key="item.name" 
                    :href="item.href" 
                    class="group flex items-center gap-x-3 rounded-lg p-2 pl-9 text-sm text-gray-700 hover:bg-gray-100/80 transition-colors duration-200">
                    <div class="flex size-6 flex-none items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-gray-200/50 group-hover:bg-indigo-50 group-hover:ring-indigo-200 transition-colors duration-200">
                      <component :is="item.icon" class="size-4 text-gray-500 group-hover:text-indigo-600" aria-hidden="true" />
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{{ item.name }}</div>
                      <div class="text-xs text-gray-500">{{ item.description }}</div>
                    </div>
                  </a>
                </DisclosurePanel>
              </TransitionChild>
            </Disclosure>

            <!-- Enhanced Regular Nav Links -->
            <a v-for="(item, index) in navItems" 
              :key="index"
              href="#" 
              class="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100/80 transition-colors duration-200">
              <component :is="item.icon" class="size-5 text-gray-500" />
              <span>{{ item.name }}</span>
            </a>
          </div>

          <!-- Enhanced Call to Actions -->
          <div class="mt-auto border-t border-gray-200/80 pt-4 space-y-1">
            <a v-for="item in callsToAction" 
              :key="item.name" 
              :href="item.href" 
              class="flex items-center gap-x-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100/80 transition-colors duration-200">
              <component :is="item.icon" class="size-5 flex-none text-gray-500" aria-hidden="true" />
              {{ item.name }}
            </a>
            <a href="#" 
              class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100/80 transition-colors duration-200">
              <span class="flex items-center space-x-2">
                <UserCircleIcon class="size-5 text-gray-500" />
                <span>Log in</span>
              </span>
              <ArrowRightIcon class="size-4 text-gray-500" />
            </a>
          </div>
        </nav>
      </div>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
  CubeIcon,
  UserCircleIcon,
  ArrowRightIcon,
  ChatBubbleLeftIcon,
  BuildingOfficeIcon,
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/vue/20/solid'

const products = [
  { name: 'Analytics', description: 'Track your performance', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Connect with customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Integrations', description: 'Connect your tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build conversion funnels', href: '#', icon: ArrowPathIcon },
]

const navItems = [
  { name: 'Features', icon: SquaresPlusIcon },
  { name: 'Messages', icon: ChatBubbleLeftIcon },
  { name: 'Company', icon: BuildingOfficeIcon },
]

const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

const isSidebarOpen = ref(false)
</script>