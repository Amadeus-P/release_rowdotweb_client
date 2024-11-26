export default function useSSRFetch(url, options={}) { // 사용자가 전달한URL, 옵션이 없을 땐 빈 객체
    
    // 중괄호로 원하는 속성만 가져왔다. 아래 코드와 같은 기능
    // const userDetails = useUserDetails();
    // const token = userDetails.token;
    const { token } = useUserDetails();

    options.headers = {
        ...options.headers,
        ...(token.value && {Authorization: `Bearer ${token.value}`})
    };

    const config = useRuntimeConfig();
    return useFetch(`${config.public.apiBase}${url}`, options);
    // useFetch()는 서버 데이터를 가져오는 유일한 함수, 나머지는 CSR 함수
}