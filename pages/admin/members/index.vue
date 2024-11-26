<script setup>
</script>

<template>
    
    <HeaderMenu/>

    <main>
        <section class="link-box" style="display: flex; flex-wrap: wrap; width: auto; margin: 10px;">
            <ul>
                <li>
                    <NuxtLink class="icon:arrow-foward-small  icon:text-left" to="members/list">회원 목록</NuxtLink>
                </li>
                <li>
                    <NuxtLink class="icon:arrow-foward-small  icon:text-left" to="members/edit">회원 정보 수정</NuxtLink>
                </li>
                <li>
                    <NuxtLink class="icon:arrow-foward-small  icon:text-left" to="members/del">회원 삭제</NuxtLink>
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