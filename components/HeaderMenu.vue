
<script setup>
    const router = useRouter();
    const back = () => {
        router.back();
    };
</script>
<template>
    <header>
        <h1>헤더</h1>
        <section style="margin: 20px 10px; display: flex; justify-content: space-between;">
            <h1>상단 메뉴</h1>
            <NuxtLink class="icon:arrow-back text-hidden btn" to="" @click="back">뒤로가기</NuxtLink>
        </section>
    </header>
</template>