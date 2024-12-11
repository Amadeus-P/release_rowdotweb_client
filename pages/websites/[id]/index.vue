<script setup>

// 설정
const config = useRuntimeConfig();
// const userDetails = useUserDetails();

const websiteId = useRoute().params.id;

const isLoading = ref(true);
const error = ref(null);

// 웹사이트
const website = ref(null);
// 회원
const member = ref(null);

// 댓글
const comments = ref([]);
const newComment = ref('');

// 좋아요, 싫어요, 저장
const iconItem = ref({
    bookmark: [],
    like: [],
    dislike: [],
});

try {
    const websiteResponse = await useCSRFetch(`websites/${websiteId}`);
    if (websiteResponse) {
        website.value = websiteResponse;
        console.log("websiteResponse ", websiteResponse);
        console.log("website.member.id", website.value.member.id);
    }
    const memberResponse = await useCSRFetch(`member/profile/${website.value.member.id}`, {
    });

    if (memberResponse) {
        member.value = memberResponse;
        console.log("memberResponse", memberResponse);
    }
} catch (err) {
    error.value = "데이터를 불러오는 중 오류가 발생했습니다.";
    console.error(err);
} finally {
    isLoading.value = false;
}

</script>

<template>
    <HeaderMenu />
    <main>
        <h1>상세 페이지</h1>
        <div v-if="isLoading">로딩 중...</div> <!-- 로딩 페이지 넣기 -->
        <div v-else-if="error">{{ error }}</div>
        <section style="display: flex; flex-basis: 100%; flex-wrap: wrap;" v-else="website">
            <h1>사이트 상세 정보</h1>
            <ul>
                <li>
                    <img style="width: 100vw; aspect-ratio: 16/9; object-fit: cover;"
                        :src="website.images?.length ? `${config.public.apiBase}website/${website.images[0].src}` : '/img/website/default.png'"
                        alt="대표 이미지">
                </li>
            </ul>
            <ul class="website-detail" style="margin: 5px; display: flex; flex-direction: column; flex-basis: 100%;">
                <li style="height: 50px;">
                    <span style="font-size: var(--font-size-4); font-weight: var(--font-weight-6);">{{ website.title
                        }}</span>
                </li>
                <li style="font-size: 24px; display: flex; justify-content: center;">{{ website.url }}</li>
                <li style="display: flex; align-items: center;">
                    <a class="btn btn-submit btn:round" style=" font-size: var(--font-size-3);" target="_blank"
                        :href="website.url">방문하기</a>
                </li>
            </ul>
            <nav style="overflow: hidden;">
                <h1>사용자 버튼 목록</h1>
                <ul
                    style="scrollbar-width: none; overflow-x: auto;  display: flex; flex-basis: 100%; gap: 10px; margin: 10px 10px;">
                    <li>
                        <img class="profile-img" v-if="member && member.profileImage"
                            :src="member.profileImage?.length ? `${config.public.apiBase}members/${member.profileImage}` : '/img/member/default.png'"
                            alt="프로필사진">
                            <span
                            style="margin-left: 5px; margin-right: auto; font-size: var(--font-size-3); font-weight: var(--font-weight-5);"
                            v-if="member && member.profileName">
                            {{ member.profileName }}
                        </span>
                    </li>
                    <li>
                        <span class="icon:views btn-style:round">
                            <span
                                style="margin-left: 5px; font-size: var(--font-size-3); color: var(--base-color-1);">100</span>
                        </span>
                    </li>
                    <li>
                        <!-- 좋아요 버튼 -->
                        <button type="button" class="btn icon:font-1" style="padding: 0;"
                            :class="iconItem.like && iconItem.like.includes(websiteId) ? 'icon:liked' : 'icon:like'">
                            {{ 10 }}
                        </button>
                    </li>
                        <!-- 싫어요 버튼 -->
                        <button type="button" class="btn icon:font-1" style="padding: 0;"
                            :class="iconItem.dislike && iconItem.dislike.includes(websiteId) ? 'icon:disliked' : 'icon:dislike'">
                            {{ 10 }}
                        </button>
                </ul>
            </nav>
        </section>

        <!-- 댓글 더보기 -->
        <!-- <RouterLink id="comment-more" to="#comment-more" class="btn-style:square" style="display: flex; justify-content: center; align-items: center; margin: 20px 10px; height: 48px; ">
            <data class="icon:arrow-down" value="100">댓글 100개</data>
        </RouterLink> -->

        <form>

            <!-- <textarea name="" id=""></textarea> -->
        </form>
        <!-- 광고 -->
    </main>
</template>

<style scoped>
.profile-img {
    --icon-width-4: 32px;
    --icon-height-4: 32px;
    width: var(--icon-width-4);
    height: var(--icon-height-4);
}
</style>