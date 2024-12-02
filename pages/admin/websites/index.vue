<script setup>
</script>

<template>
    
    <HeaderMenu/>

    <main>
        <section class="link-box" style="display: flex; flex-wrap: wrap; width: auto; margin: 10px;">
            <ul>
                <li>
                    <NuxtLink class="icon:arrow-forward  icon:text-left" to="websites/list">웹사이트 목록</NuxtLink>
                </li>
                <li>
                    <NuxtLink class="icon:arrow-forward  icon:text-left" to="websites/edit">웹사이트 수정</NuxtLink>
                </li>
                <li>
                    <NuxtLink class="icon:arrow-forward  icon:text-left" to="websites/del">웹사이트 삭제</NuxtLink>
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