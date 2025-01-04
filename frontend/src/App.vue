<script setup>
import PocketBase from 'pocketbase';
import { onMounted, ref } from 'vue';
import Header from './components/Header.vue';

let pb = null;
const currentUser = ref();
const username = ref('');
const password = ref('');
const fullname = ref('');

onMounted(() => {
  pb = new PocketBase('http://127.0.0.1:8090');

  pb.authStore.onChange(() => {
    currentUser.value = pb.authStore.model;
  }, true);
});

const doLogout = async () => {
  await pb.authStore.clear();
  currentUser.value = null;
};

const doLogin = async () => {
  try {
    const authData = await pb.collection('users').authWithPassword(username.value, password.value);
    console.log(pb.authStore.isValid);
    console.log(pb.authStore.token);
    console.log(pb.authStore.model);
  } catch (e) {
    alert(e.message);
  }
};

const doCreateAccount = async () => {
  try {
    const data = {
      username: `user_${crypto.randomUUID().split('-')[0]}`,
      email: username.value,
      emailVisibility: true,
      password: password.value,
      name: fullname.value,
    };
    const record = await pb.collection('users').create(data);
    await doLogin();
  } catch (e) {
    alert(e.message);
  }
};
</script>

<template>
  <div id="app">
    <Header />
  </div>
  <div class="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div v-if="currentUser">
        <h1>Current User: {{ currentUser?.name || 'No name' }}</h1>
        <div>
          <button type="button" @click="doLogout"
            class="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Logout
          </button>
        </div>
      </div>
      <div v-else>
        <form @submit.prevent="doLogin">
          <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
              <img class="mx-auto h-10 w-auto"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
              <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>
            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <div>
                <label for="username" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                <div class="mt-2">
                  <input v-model="username" type="text" id="username" autocomplete="none"
                    placeholder="Enter Email Address"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600" />
                </div>
              </div>
              <div>
                <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
                <div class="mt-2">
                  <input v-model="password" type="password" id="password" autocomplete="none"
                    placeholder="Enter Password"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600" />
                </div>
              </div>
              <div>
                <button type="submit"
                  class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Login
                </button>
              </div>
              <p class="mt-10 text-center text-sm/6 text-gray-500">
                Not a member?
                <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Start a 14 day free trial</a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
