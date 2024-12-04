<script setup>
        const userDetails = useUserDetails();
</script>

<template>
    
    <HeaderMenu/>

    <main>
        <section class="link-box" style="display: flex; flex-wrap: wrap; width: auto; margin: 10px;">
            <ul>
                <li>
                    <NuxtLink class="icon:arrow-forward icon:text-left" :to="`/member/mypage/${userDetails.id.value}/edit`">
                        회원명
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink class="icon:arrow-forward icon:text-left" to="">내 기록</NuxtLink>
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
</style>