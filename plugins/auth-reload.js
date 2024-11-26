export default defineNuxtPlugin((nuxtApp) => {
    const userDetails = useUserDetails();

    if(import.meta.client) { // NUXT 3는 process.client 지원 안함
        //  userDetails.loadUserFromCookies();
         userDetails.loadUserFromStorage();
    }
});