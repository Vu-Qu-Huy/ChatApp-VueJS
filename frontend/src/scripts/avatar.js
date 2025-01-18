import { computed } from 'vue';
import { useAuth } from "../authentication/auth";

const baseUrl = "http://127.0.0.1:8090/api/files";

// No need to pass `currentUser` as a parameter; use the one from `useAuth`
export function useUserAvatar() {
  const { currentUser } = useAuth();

  const fullAvatarUrl = computed(() => {
    if (
      currentUser?.value?.avatar &&
      currentUser?.value?.collectionId &&
      currentUser?.value?.id
    ) {
      return `${baseUrl}/${currentUser.value.collectionId}/${currentUser.value.id}/${currentUser.value.avatar}`;
    }
    return null;
  });

  return { fullAvatarUrl };
}
