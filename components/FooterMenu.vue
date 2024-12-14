<script setup>

</script>

<template>
    <footer class="footer">
        <nav class="footer-card">
            <h1>하단메뉴</h1>
            <ul class="footer-menu">
                <li>
                    <NuxtLink to="/" class="icon:home icon:text-bottom icon:font-1">
                        <span class="text">홈</span>
                    </NuxtLink>
                </li>
                <li>
                    <!-- 미들웨어에서 설정한 경로라면 알아서 미들웨어에서 가로채니까 굳이 v-if로 로그인 확인 하는거 아님  -->
                    <!-- <NuxtLink v-if="userDetails.isGhost()" to="/signin" class="icon:add icon:text-bottom icon:font-1" >
                        <span class="">사이트 등록</span>
                    </NuxtLink> -->
                    <NuxtLink to="/member/websites/new" class="icon:add icon:text-bottom icon:font-1" >
                        <span class="">사이트 등록</span>
                    </NuxtLink>
                    
                </li>
                <li>
                    <NuxtLink to="/member/mypage/" class="icon:profile icon:text-bottom icon:font-1">
                        <span>내 페이지</span>
                    </NuxtLink>
                </li>
            </ul>
        </nav>
    </footer>
</template>