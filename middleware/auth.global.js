export default defineNuxtRouteMiddleware((to, from) => {
  const userDetails = useUserDetails();

  if (!import.meta.env.SSR) { // import.meta.client

    // console.log(userDetails.token.value);

    if (to.path === '/' && userDetails.token.value == null) {
      console.log("to.path", to.path);
      return navigateTo('/websites')
    }
    if (to.path === '/' && userDetails.token.value !== null) {
      console.log("to.path", to.path);
      return navigateTo('/member/websites')
    }

    if ((userDetails.token.value && to.path === '/signin') || (userDetails.token.value && to.path === '/signup') || (userDetails.token.value && to.path.startsWith('/websites'))) {
      return navigateTo('/member/websites');
    }
    if (to.path.startsWith("/member")) {
      console.log("to.path", to.path);
      if (userDetails.isGhost()) {
        console.log('Redirecting to login:', to.fullPath);
        return navigateTo(`/signin?returnURL=${to.fullPath}`);
      }
      // 회원이 아니면 에러 페이지로.
      if (!userDetails.hasRole("ROLE_MEMBER")) {
        return navigateTo("/error403"); // 보안(권한) 에러
      }
    }
  }
});