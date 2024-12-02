<script setup>
    import { jwtDecode } from 'jwt-decode';
    import { decodeCredential, googleTokenLogin } from 'vue3-google-login';

    // model 변수
    const username = ref("");
    const password = ref("");

    // 여기서 query가 담겨져 와야함(쿼리 스트링인 returnURL을 담아와야하기 때문에)
    const query = useRoute();
    const userDetails = useUserDetails();

        // 비밀번호 숨기기/보이기
    const isShowPassword = ref(false);
    const showPassword = () => {
        isShowPassword.value = !isShowPassword.value;
    };


    const localLoginHandler = async() => {
        try{

            // 서버로 보내기
            let response = await useCSRFetch("auth/signin", {
                // usePost()
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    // 로그인 정보 보내기
                    username: username.value,
                    password: password.value,
                }
            });
    
            if (!response || !response.token) {
                console.log("응답 확인", response);
                return;
            }
            
            // JWT 디코드
            let userInfo = jwtDecode(response.token);
            userDetails.signin({
                id: userInfo.id,
                username: userInfo.username,
                profileName: userInfo.profileName,
                profileImage: userInfo.profileImage,
                roles: userInfo.roles.map(role => role.authority),
                token: response.token
            });

            userInfo.roles.map(role=>{console.log(role, role.authority)});
            console.log("로그인 완료", userInfo);
            console.log("로그인 완료", userDetails);
            console.log("query.returnURL", query.returnURL);

            // 미들웨어에서 returnURL에 값이 담겨오는지 확인
            const returnURL = useRoute().query.returnURL || (userInfo.roles.includes('ROLE_MEMBER') ? '/websites' : '/member/websites');
            console.log("returnURL", returnURL);
            return navigateTo(returnURL);
        } catch(error){
            console.log(error);
        }
    }


    const googleLoginHandler = async() => {
        let token;
        {
            // googleTokenLogin.then();
            let response = await googleTokenLogin(); // JWT 토큰?
            console.log(response);
            token = response.access_token;
        }
        {
            let response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`); // 사용자 정보를 얻어옴
            let userInfo = await response.json();
            console.log(userInfo);
        }
        const returnURL = useRoute().query.returnURL || "/";
        
        return navigateTo(returnURL);
    }

</script>

<template>

    <HeaderMenu/>

    <main>
        <section style="display: flex; flex-wrap: wrap; width: auto; margin: 10px;">
            <h1>로그인 페이지</h1>
            <form @submit.prevent="localLoginHandler">
                <label style="">
                    <span>이메일 <span style="color: red;" aria-label="required">*</span></span>
                    <input type="email" v-model="username" autofocus required/>
                </label>
                
                <label style="position: relative;">
                    <span>비밀번호 <span style="color: red;" aria-label="required">*</span></span>
                    <input :type="isShowPassword ? 'text' : 'password'" 
                        v-model="password"
                        autocomplete="off" required/>
                        <!-- pattern="^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,20}$" -->
                    <button type="button" 
                        :class="isShowPassword? ['icon:hide', 'text-hidden'] : ['icon:show', 'text-hidden']" 
                        style="z-index: 100; position: absolute; right: 10px; top: 50px; transform: translateY(-25%);" 
                        @click="showPassword">
                        {{ isShowPassword ? '숨기기' : '보이기' }}
                    </button>
                </label>
                
                <div style="display: flex; margin-top: 50px;">
                    <!-- 
                    이벤트를 버튼에 주지 않은 이유. 이벤트를 넣는 순간  내가 버튼의 기본 기능까지 직접 설정해야함
                    대신 form에 이벤트를 주면 됨
                      -->
                    <button class="btn btn-submit btn:round" style="">로그인하기</button>
                </div>
            </form>
            <!-- <div style="position: relative; border: none; border-top: 1px solid var(--base-color-3); margin: 50px 0 10px 0; width: 100%;">
                <div style="position: absolute; top: -0.7em; left: 50%; transform: translateX(-50%); background: white; padding: 0 5px;">다른 계정으로 로그인</div>
            </div>
            <div class="btn btn-submit btn:round" style="background-color: var(--base-color-white); color: var(--base-color-black); margin-top: 20px;">
                <NuxtLink @click.prevent="googleLoginHandler" class="submit-btn btn-style:round" style="font-size: var(--font-size-3); font-weight: var(--font-weight-6);" to="">구글 로그인</NuxtLink>
            </div> -->
            <div class="text-hidden" style="position: relative; border: none; border-top: 1px solid var(--base-color-3); margin: 50px 0 10px 0; width: 100%;">구분선</div>
            <div style="display: flex; justify-content: center; margin-top: 20px; width: 100%;">
                <NuxtLink class="" style="font-size: var(--font-size-3); font-weight: var(--font-weight-6); cursor: pointer;" to="/signup">회원이 아니라면</NuxtLink>
            </div>
        </section>
    </main>
</template>

<style scoped>
form{
    width: 100%;
    span{
        font-size: var(--font-size-4);
        font-weight: var(--font-weight-6);
        color: var(--base-color-black);
    }
    label{
        display: flex;
        width: auto;
        flex-wrap: wrap;
        margin: 0 10px 10px;
        >input{
            line-height: 20px;
            border: 1px solid var(--base-color-4);
            border-radius: 5px;
            width: 100%;
            height: 40px;
            padding: 5px 10px;
            font-size: var(--font-size-3);
            font-weight: var(--font-weight-4);
            &:focus{
                border: 1px solid var(--base-color-1);
            }
        }
    }
    label:has(input[type="email"]:user-invalid){
        >input[type="email"]{
            border: 1px solid var(--accent\:red);
        }
        &::after{
                content: "올바른 이메일 형식을 입력하세요.";
                display: flex;
                height: auto;
                color: var(--accent\:red);
        }
    }
}

.icon\:hide::before{
    mask-image: url("/public/img/icon/hide.svg");
}
.icon\:show::before{
    mask-image: url("/public/img/icon/show.svg");
}
:is(
    .icon\:show,
    .icon\:hide
)::before{
    content: "";
    display: flex;
    width: var(--icon-width-3);
    height: var(--icon-height-3);
    mask-repeat: no-repeat;

    mask-size: var(--icon-width-3) var(--icon-height-3);
    background-color: var(--base-color-black);
}
:is(
    .icon\:show,
    .icon\:hide
    ){
    background-color: var(--base-color-white);
    border: none;
}

</style>
