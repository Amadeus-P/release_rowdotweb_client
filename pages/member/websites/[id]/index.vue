<script setup>

const websiteId = useRoute().params.id;
const config = useRuntimeConfig();
const userDetails = useUserDetails();


const isLoading = ref(true);
const error = ref(null);

const website = ref(null);
const member = ref(null);

const comments = ref([]);
const newComment = ref('');


// 좋아요, 싫어요, 저장
const iconItem = ref({
    bookmark: [],
    like: [],
    dislike: [],
});

const websiteForm = ref({
    content: '',
    categoryId: null,
    memberId: null
});

try {
    const websiteResponse = await useCSRFetch(`member/websites/${websiteId}`);
    if (websiteResponse) {
        website.value = websiteResponse;
        console.log("websiteResponse ", websiteResponse);
        console.log("website.member.id", website.value.member.id);


    }
    const memberResponse = await useCSRFetch(`member/websites/${website.value.member.id}`, {
    });
    if (memberResponse) {
        member.value = memberResponse;
        console.log("memberResponse", memberResponse);
    }
    // const commentsResponse = await useCSRFetch(`comments/${websiteId}`);
    // if (commentsResponse) {
    //     comments.value = commentsResponse;
    //     console.log("commentsResponse", commentsResponse);
    // }

} catch (err) {
    error.value = "데이터를 불러오는 중 오류가 발생했습니다.";
    console.error(err);
} finally {
    isLoading.value = false;
}
// niuw

const commentSubmitHandler = async (e) => {
    e.preventDefault();

    if (!newComment.value.trim()) return; // 빈 입력 방지

    const formData = new FormData();

    formData.append('content', websiteForm.value.content);
    formData.append('memberId', websiteForm.value.memberId);
    formData.append('categoryId', websiteForm.value.categoryId);
    try {
        const response = await $fetch(`${config.public.apiBase}/comments`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${userDetails.token.value}` // Bearer 토큰 추가
            }
        })

        // $fetch가 응답을 JSON으로 Parcing하기때문에 response는 JSON 문자열임
        const result = await response;

        // 서버 응답 메세지와 동일하지 않을 때
        if (result.message !== "댓글 등록 성공") {
            console.log(response);
            throw new Error('댓글 등록에 실패했습니다.');
        }
        console.log('사이트 등록 성공:', result);
        // 성공적으로 등록된 후 다른 페이지로 이동하거나 상태 초기화할 수 있음
        return navigateTo(`/member/websites/${websiteId}`);
    } catch (error) {
        console.error('에러 발생:', error);
    }
};

// 북마크 추천 비추천 등등
const actionHandler = async (memberId, websiteId, type) => {

let action = "";
console.log('memberId ', memberId.value);
console.log('websiteId ', websiteId);
console.log('type', type);
try {
    action = type;
    console.log("action ", action);

    let isActionApplied = false;

    // 해당 액션 배열 가져오기
    const actionArray = iconItem.value[action] || [];
    // 이미 북마크되어 있는지 확인
    const index = actionArray.indexOf(websiteId);
    console.log("iconItem ", iconItem.value);

    if (index > -1) {
        // 이미 북마크되어 있다면 제거
        actionArray.splice(index, 1);
        isActionApplied = false;
    } else {
        // 북마크되어 있지 않다면 추가
        actionArray.push(websiteId);
        isActionApplied = true;
    }

    // 업데이트된 배열을 다시 할당
    iconItem.value[action] = actionArray;

    // 서버로 좋아요 상태 전송
    const response = await useCSRFetch(`member/websites/actions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userDetails.token.value}` // Bearer 토큰 추가
        },
        body: {
            memberId: memberId.value,
            websiteId: websiteId,
            action: action,
            isAdded: isActionApplied
        },
    });

    //     if (!response.ok) {
    //          const errorText = await response.text();
    //          throw new Error(`서버 오류: ${response.status} ${response.statusText}: ${errorText}`);
    //      }
    if(type == 'like') {
        console.log(`좋아요 상태 업데이트 완료: ${websiteId}`, response.message);
    } else if(type == 'dislike') {
        console.log(`싫어요 상태 업데이트 완료: ${websiteId}`, response.message);
    }
} catch (error) {
    console.error('상태 업데이트 중 오류:', error);
}
};

onMounted(async() =>{

// 사용자의 북마크 목록 가져오기
try {
    const actionResponse = await useCSRFetch(`member/websites/actions?memberId=${userDetails.id.value}`, {
        headers: {
            Authorization: `Bearer ${userDetails.token.value}`,
        },
    });
    console.log("actionResponse ", actionResponse);

    if (actionResponse && actionResponse.actionDtos) {
        // `actionDtos`를 기반으로 `iconItem`을 업데이트
        actionResponse.actionDtos.forEach((actionDto) => {
            const { action, websiteId } = actionDto;
            if (actionDto.isAdded) {
                if (!iconItem.value[action]) {
                    iconItem.value[action] = [];
                }
                iconItem.value[action].push(websiteId);
            }
        });
        console.log('액션 목록:', iconItem.value);
    }
} catch (error) {
    console.error('액션 상태 목록 가져오기 중 오류:', error);
}

});

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
                            :class="iconItem.like && iconItem.like.includes(websiteId) ? 'icon:liked' : 'icon:like'"
                            @click="actionHandler(userDetails.id, websiteId, 'like')">
                            {{ 10 }}
                        </button>
 
                    </li>
                    <li>
                        <!-- 싫어요 버튼 -->
                        <button type="button" class="btn icon:font-1" style="padding: 0;"
                            :class="iconItem.dislike && iconItem.dislike.includes(websiteId) ? 'icon:disliked' : 'icon:dislike'"
                            @click="actionHandler(userDetails.id, websiteId, 'dislike')">
                            {{ 10 }}
                        </button>
                    </li>
                </ul>
            </nav>
        </section>

        <!-- 댓글 더보기 -->
        <!-- <RouterLink id="comment-more" to="#comment-more" class="btn-style:square"
            style="display: flex; justify-content: center; align-items: center; margin: 20px 10px; height: 48px; ">
            <data class="icon:arrow-down" value="100">댓글 100개</data>
        </RouterLink> -->

        <!-- <form @submit.prevent="commentSubmitHandler">
            <section style="display: flex; flex-wrap: wrap;">
                <h1>댓글 목록</h1>
                <div style="display: flex; align-items: center; flex-basis: 100%; gap: 10px;">
                    <img class="profile-img" v-if="member && member.profileImage"
                        :src="member.profileImage?.length ? `${config.public.apiBase}members/${member.profileImage}` : '/img/member/default.png'"
                        alt="프로필사진">
                    <span style="font-size: 18px; font-weight: 400; color: var(--base-color-2);"
                        v-if="member && member.profileName">
                        {{ member.profileName }}</span>

                </div>
                <textarea placeholder="댓글을 입력해주세요."></textarea>
            </section>

            <button>등록</button>
        </form> -->

        <!-- 광고 -->
        <!-- // niuw -->
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