<script setup>
    const config = useRuntimeConfig();
   const userDetails = useUserDetails();
   const profileName = ref(userDetails.profileName);
   const profileImage = ref(userDetails.profileImage);
</script>

<template>
    
    <HeaderMenu/>

    <main>
        <h1>회원 정보 변경 페이지</h1>
        <section class="link-box" style="display: flex; flex-wrap: wrap; width: auto; margin: 10px;">
            <h1></h1>
            <form>
                <label>
                    <span>프로필 이름  변경</span>
                    <input type="text" :value="`${profileName}`">
                </label>
                <label style="flex-direction: column; align-items: center;">
                    <span>프로필 사진 변경</span>
                    <span style="position: relative;">
                    <img class="profile-img" :src="`${config.public.apiBase}members/${userDetails.profileImage.value}`" alt="프로필 사진" />
                </span>
                    <span style="position: absolute; top: 0; left: 10px;">
                        <input type="file">
                        <span class="icon:add" style="display: flex; width: 100%;  border: 1px solid black;"></span>
                    </span>
                </label>
                <label>
                    <span>비밀번호 변경</span>
                    <input type="password">
                </label>
            </form>
        </section>
    </main>

    <FooterMenu/>

</template>

<style scoped>
.profile-img {
    --icon-width-4: 60px;
    --icon-height-4: 60px;
    width: var(--icon-width-4);
    height: var(--icon-height-4);
}

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
    } /* form */

</style>