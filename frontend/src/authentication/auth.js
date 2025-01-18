import PocketBase from 'pocketbase';
import { ref, onMounted } from 'vue';

const pb = new PocketBase('http://127.0.0.1:8090');
const currentUser = ref(pb.authStore.model);

pb.authStore.onChange(() => {
  currentUser.value = pb.authStore.model;
}, true);

export function useAuth() {
  const errorMessage = ref('');
  const loading = ref(false);

  const doLogout = async () => {
    pb.authStore.clear();
    currentUser.value = null;
  };

  const doGoogleLogin = async () => {
    errorMessage.value = '';
    loading.value = true;
    try {
      const redirectUri = 'http://127.0.0.1:8090/api/oauth2-redirect';
      const authData = await pb.collection('users').authWithOAuth2({
        provider: 'google',
        redirectUrl: redirectUri,
      });

      currentUser.value = pb.authStore.model;
      console.log('Auth Data:', currentUser.value);
    } catch (e) {
      errorMessage.value = e.message || 'Google OAuth failed. Please try again.';
    } finally {
      loading.value = false;
    }
  };

  return { currentUser, doLogout, doGoogleLogin, errorMessage, loading };
}