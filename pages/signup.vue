<script setup>

    const username = ref("");
    const password = ref("");
    const passwordCheck = ref("");
    const errorMessage = ref("");

    // 비밀번호 일치 여부를 확인하는 computed 속성
    const passwordMatch = computed(() => password.value === passwordCheck.value);

    // watchEffect(()=>{
    //     if(password.value !== passwordCheck.value){
    //         console.log("비밀번호가 일치하지 않습니다.");
    //         return;
    //     }
    // });

    const signupHandler = async() => {

        if (!passwordMatch.value) {
            errorMessage.value = "비밀번호가 일치하지 않습니다.";
            return;
        }

        try {
            let response = await useCSRFetch("auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    username: username.value,
                    password: password.value,
                },
            });
            if(response.status === 201){
                // 회원가입 성공 후 로그인 페이지로 이동
                console.log("회원가입 성공");
                return navigateTo('/signin');
            } else if (response.status === 409) {
                // 이미 존재하는 회원일 경우
                errorMessage.value = "이미 존재하는 이메일입니다.";
            }else if (response.status === 400) {
                // 400 Bad Request일 경우 백엔드에서 전달한 에러 메시지를 표시
                errorMessage.value = response._data || "잘못된 요청입니다.";
            } else if (response.status === 500) {
                // 서버 내부 오류
                errorMessage.value = "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
            } else{
                console.log("회원가입 성공: ", response);
                return navigateTo("/signin");
            }
        } catch(error){
            console.log(error);
        }
    }

    // 비밀번호 숨기기/보이기
    const isShowPassword = ref(false);
    const showPassword = () => {
        isShowPassword.value = !isShowPassword.value;
    };

    // 비밀번호 확인  숨기기/보이기
    const isShowPasswordCheck = ref(false);
    const showPasswordCheck = () => {
        isShowPasswordCheck.value = !isShowPasswordCheck.value;
    };

</script>

<template>

    <HeaderMenu/>

    <main>
        <section style="display: flex; flex-wrap: wrap; width: auto; margin: 10px;">
            <h1>회원가입 페이지</h1>
            <form @submit.prevent="signupHandler">
                <label style="">
                    <span>이메일</span>
                    <input type="email" name="username" v-model="username" placeholder="예시) wiwst@gmail.com" autofocus autocomplete="off" required/>
                </label>
                
                <label style="position: relative;">
                    <span>비밀번호</span>
                    <input :type="isShowPassword ? 'text' : 'password'" 
                        v-model="password" name="password" pattern="^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,20}$"
                        placeholder="12~20자의 영어, 숫자, 특수문자 포함" autocomplete="off" required/>
                    <button type="button" 
                        :class="isShowPassword? ['icon:hide', 'text-hidden'] : ['icon:show', 'text-hidden']" 
                        style="z-index: 100; position: absolute; right: 10px; top: 50px; transform: translateY(-25%);" 
                        @click="showPassword">
                        {{ isShowPassword ? '숨기기' : '보이기' }}
                    </button>
                </label>
                
                <label style="position: relative;">
                    <span>비밀번호 확인</span>
                    <input class="passwordCheck" 
                        :type="isShowPasswordCheck? 'text' : 'password'" 
                        v-model="passwordCheck" name="password" autocomplete="off" required/>
                    <button type="button" 
                        :class="isShowPasswordCheck? ['icon:hide', 'text-hidden'] : ['icon:show', 'text-hidden']" 
                        style="z-index: 100; position: absolute; right: 10px; top: 50px;  transform: translateY(-25%);"
                        @click="showPasswordCheck">
                        {{ isShowPasswordCheck ? '숨기기' : '보이기' }}
                    </button>
                </label>
                
                <div style="display: flex; margin-top: 50px;">
                    <button class="btn btn-submit btn:round" style="">회원가입하기</button>
                </div>
    
            </form>
            <div style="position: relative; border: none; border-top: 1px solid var(--base-color-3); margin: 50px 0 10px 0; width: 100%;">
                <div style="position: absolute; top: -0.7em; left: 50%; transform: translateX(-50%); background: white; padding: 0 5px;">다른 계정으로 회원가입</div>
                
            </div>
            <div style="display: flex; justify-content: center; margin-top: 20px; width: 100%;">
                <NuxtLink class="" style="font-size: var(--font-size-3); font-weight: var(--font-weight-6);" to="/signin">이미 회원이라면</NuxtLink>
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
    label:has(input[type="email"]:user-valid){
        >input[type="email"]{
            border: 1px solid var(--accent\:green);
        }
        &::after{
                content: "";
                display: flex;
                height: auto;
                color: var(--accent\:green);
        }
    }
    label:has(
        input[type="password"]:user-valid, 
        input[type="text"]:user-valid){
            >input[type="password"], >input[type="text"]{
                border: 1px solid var(--accent\:green);
            }
            &::after{
                    content: "";
                    display: flex;
                    height: auto;
                    color: var(--accent\:green);
            }
    }

    label:has(input[type="email"]:user-invalid){
        >input[type="email"]{
            border: 1px solid var(--accent\:red);
        }
        &::after{
                content: "유효하지 않은 이메일입니다.";
                display: flex;
                height: auto;
                color: var(--accent\:red);
        }
    }
    label:has(
        input[type="password"]:user-invalid, 
        input[type="text"]:user-invalid){
            >input[type="password"], >input[type="text"]{
                border: 1px solid var(--accent\:red);
            }
            &::after{
                    content: "12~20자의 영어, 숫자, 특수문자 포함";
                    display: flex;
                    height: auto;
                    color: var(--accent\:red);
            }
    }
    label:has(
        input[type="password"]:user-valid.passwordCheck,
        input[type="text"]:user-valid.passwordCheck
    ){
        
        >input[type="password"], >input[type="text"]{
            border: 1px solid var(--accent\:green);
        }
        &::after{
            content: "";
            display: flex;
            height: auto;
            color: var(--accent\:green);
        }
    }
    label:has(
        input[type="password"]:user-invalid.passwordCheck,
        input[type="text"]:user-invalid.passwordCheck
    ){
        >input[type="password"], >input[type="text"]{
            border: 1px solid var(--accent\:red);
        }
        &::after{
            content: "비밀번호가 일치하지 않습니다";
            display: flex;
            height: auto;
            color: var(--accent\:red);
        }
    }
}/* form */
.submit-btn{
    display: flex;
    justify-content: center;
    flex-basis: 100%;
    width: 300px;
    height: 40px;
    margin: 10px;
    font-size: var(--font-size-4);
    font-weight: var(--font-weight-6);
    color: var(--base-color-white);
    background-color: var(--base-color-1);
}

.icon\:hide::before{
    mask-image: url("../img/icon/hide.svg");
}
.icon\:show::before{
    mask-image: url("../img/icon/show.svg");
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
