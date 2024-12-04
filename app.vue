<script setup>
    const userDetails = useUserDetails();

    // 사용자가 이미 로그인된 상태라면 localStorage에서 불러오기
    onMounted(() => {
        userDetails.loadUserFromStorage();
    });
</script>
<template>
        <Head>
            <Meta charset="UTF-8"/>
            <Link rel="icon" href="/favicon.ico"/>
            <Meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <Title>로우닷웹</Title>

            <Link rel="stylesheet" href="/css/reset.css"/>
            <Link rel="stylesheet" href="/css/root.css"/>
            <Link rel="stylesheet" href="/css/font.css"/>
            <Link rel="stylesheet" href="/css/inc/header.css"/>
            <Link rel="stylesheet" href="/css/inc/footer.css"/>
            <Link rel="stylesheet" href="/css/cards.css"/>
            <Link rel="stylesheet" href="/css/icon.css"/>
            <Link rel="stylesheet" href="/css/my-icon.css"/>
            <Link rel="stylesheet" href="/css/button.css"/>
            <Link rel="stylesheet" href="/css/input.css"/>
    </Head>
    <div>
        <NuxtPage/>
    </div>
</template>

<style>
</style>
