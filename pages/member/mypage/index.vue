<script setup>
    const config = useRuntimeConfig();
    const userDetails = useUserDetails();

    console.log(userDetails.profileImage.value);
    
</script>

<template>
    
    <HeaderMenu/>

    <main>
        <section class="link-box" style="display: flex; flex-wrap: wrap; justify-content: center; margin: 10px;">
            <div class="user-card" style="width: 100%;">
                <img :src="`${config.public.apiBase}members/${userDetails.profileImage.value}`" alt="프로필 사진" />
                <div class="user-details">
                    <p>{{ userDetails.username}}</p>
                    <p>{{ userDetails.profileName }}</p>
                    <p>{{userDetails.regDate }}</p>
                </div>
            </div>
            <ul>
                <li>
                    <NuxtLink class="icon:arrow-foward-small  icon:text-left" :to="`/member/mypage/${userDetails.id.value}`">
                        회원 정보 변경
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink class="icon:arrow-foward-small  icon:text-left" to="">내 기록</NuxtLink>
                </li>
            </ul>
        </section>
    </main>

    <FooterMenu/>

</template>

<style scoped>
.icon\:arrow-foward-small::before{
    background-color: var(--base-color-3);
}

.profile-img {
    --icon-width-4: 60px;
    --icon-height-4: 60px;
    width: var(--icon-width-4);
    height: var(--icon-height-4);
}
</style>