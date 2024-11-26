<script setup>
</script>

<template>
    <HeaderMenu/>
    
    <main>
        <section class="link-box">
            <ul>
                <li>
                    <NuxtLink class="icon:arrow-foward-small  icon:text-left" to="admin/websites">웹사이트 관리</NuxtLink>
                </li>
                <li>
                    <NuxtLink class="icon:arrow-foward-small  icon:text-left" to="admin/members">회원 관리</NuxtLink>
                </li>
                <li>
                    <NuxtLink class="icon:arrow-foward-small  icon:text-left" to="admin/plan">구독 관리</NuxtLink>
                </li>
                <li>
                    <NuxtLink  class="icon:arrow-foward-small  icon:text-left" to="admin/categories">카테고리 관리</NuxtLink>
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