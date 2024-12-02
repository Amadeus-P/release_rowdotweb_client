<script setup>
</script>

<template>
    
    <HeaderMenu/>

    <main>
        <section class="link-box" style="display: flex; flex-wrap: wrap; width: auto; margin: 10px;">
            <ul>
                <li>
                    <NuxtLink class="icon:arrow-forward icon:text-left" to="categories/list">카테고리 목록</NuxtLink>
                </li>
                <li>
                    <NuxtLink class="icon:arrow-forward icon:text-left" to="categories/new">새 카테고리 등록하기</NuxtLink>
                </li>
                <li>
                    <NuxtLink class="icon:arrow-forward icon:text-left" to="categories/edit">카테고리 수정하기</NuxtLink>
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