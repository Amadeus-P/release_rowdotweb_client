export default function useCSRFetch(url, options={}){

    const { token } = useUserDetails(); // 토큰을 가져오는 곳
    
    options.headers = {
        ...options.headers,
        ...(token.value && {Authorization: `Bearer ${token.value}`})
    };
    
    const config = useRuntimeConfig();
    return $fetch(`${config.public.apiBase}${url}`, options);
}