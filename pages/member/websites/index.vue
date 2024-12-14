<script setup>
import { onBeforeMount, onBeforeUpdate, onMounted, onUpdated, ref, watchEffect } from 'vue';
import { TimeFormat } from '~/public/js/TimeFormat';

// 설정
const config = useRuntimeConfig();
const userDetails = useUserDetails();
const { iconItem, websiteActionsMap, fetchMemberActionStatus, fetchWebsiteActionStatus } = useWebsiteActionFetch();

// 동적 CSS 변수
const selectedMainCategory = ref("");

const isLoading = ref(false);
const error = ref(null);

// 웹사이트 페이지 정보
const startNum = ref(1);
const totalPages = ref(0);
const hasPreviousPage = ref(false);
const hasNextPage = ref(false);
const pageNumbers = ref([]);
const currentPage = ref(parseInt(useRoute().query.page) || 1); // 현재 페이지

// 검색
const keyWord = ref('');
const searchResults = ref([]); // 검색 결과를 저장할 배열

// 카테고리
const mainCategories = ref([]);
const subCategories = ref([]);
const detailCategories = ref([]);
const filteredWebsite = ref([]); // 화면에 나올 웹사이트 목록

//  fetch 데이터 저장용
const categories = ref([]);

// SSR {response}
const { data: categoryData } = await useSSRFetch("categories", {
    params: {
        parentId: null
    }
});
// 데이터 감시(사이드 이펙트)
watchEffect(() => {

    if (categoryData.value) {
        categories.value = categoryData.value.categoryListDtos;
        // console.log("최신 카테고리: ", categories.value);
    }
    mainCategories.value = categories.value;
    // console.log("대분류", mainCategories.value);
});

// 카테고리 목록 가져오기
const fetchCategory = async (categoryId, type) => {
    try {
        // CRS response 
        const categoryResponse = await useCSRFetch("categories", {
            params: {
                parentId: categoryId
            }
        });
        if (!categoryResponse || !categoryResponse.categoryListDtos) {
            console.error("카테고리 데이터가 비어있습니다.");
            return;
        }
        if (type === 'sub') {
            detailCategories.value = [];
            subCategories.value = categoryResponse.categoryListDtos;
            // console.log("중분류 데이터: ", subCategories.value);

        } else if (type === 'detail') {
            detailCategories.value = categoryResponse.categoryListDtos;
            // console.log("소분류 데이터: ", detailCategories.value);
        } else {
            console.error("유효하지 않은 type: ", type);
        }
    } catch (error) {
        console.error("데이터 가져오기 중 오류 발생: ", error);
    }
};

// 전체 카테고리일 때
const selectAllMainHandler = async (name) => {
    selectedMainCategory.value = name;
    // console.log('selectedMainCategory:', selectedMainCategory.value);
    if (name === "전체") {

        const websitesResponse = await useCSRFetch("member/websites");
        // console.log("websitesResponse.websiteListDtos", websitesResponse);

        await pageClickHandler();
        // 페이지 정보

        const websiteIds = websitesResponse.websiteListDtos.map((w) => w.id);
        // console.log('websitesResponse.websiteListDtos.id', websitesResponse.websiteListDtos.map(w => w.id));
        // console.log('websiteIds', websiteIds);
        await fetchWebsiteActionStatus(websiteIds);
        // console.log('rate', rate.value);

        filteredWebsite.value = websitesResponse.websiteListDtos;
        console.log("전체 웹사이트 데이터: ", filteredWebsite.value);
    }
}

// 전체가 아닐 때
const fetchWebsites = async (detailCategoryId) => {
    try {
        const websitesResponse = await useCSRFetch("member/websites", {
            params: {
                categoryId: detailCategoryId
            }
        });
        // console.log("websiteResponse", websiteResponse);

        if (!websitesResponse || !websitesResponse.websiteListDtos) {
            console.error("웹사이트 데이터가 비어있습니다.");
            return;
        }
        await pageClickHandler();

        const websiteIds = websitesResponse.websiteListDtos.map(website => website.id);
        console.log("필터링한 웹사이트 ID 목록:", websiteIds);
        await fetchWebsiteActionStatus(websiteIds);

        filteredWebsite.value = websitesResponse.websiteListDtos;
        // console.log(`소분류 ID ${detailCategoryId}의 웹사이트 데이터:`, filteredWebsite.value);

    } catch (error) {
        console.error("웹사이트 데이터 가져오기 중 오류 발생: ", error);
    }
};

// 검색 결과
const searchHandler = async () => {
    if (!keyWord.value.trim()) {
        // 빈 입력 방지
        searchResults.value = [];
        return;
    }

    try {
        isLoading.value = true;
        error.value = null;

        // 서버로 검색 요청
        const response = await useCSRFetch("member/websites", {
            method: "GET",
            params: {
                keyWord: keyWord.value,
            },
        });

        if (response && response.websiteListDtos) {
            searchResults.value = response.websiteListDtos; // 검색 결과 업데이트
        } else {
            searchResults.value = [];
            console.warn("검색 결과가 없습니다.");
        }
    } catch (err) {
        console.error("검색 중 오류 발생:", err);
        error.value = "검색 요청 중 오류가 발생했습니다.";
    } finally {
        isLoading.value = false;
    }
};

// 시간 포맷
const timeFormat = new TimeFormat()
const createdWebsite = computed(() => {
    if (Array.isArray(filteredWebsite.value)) {
        return filteredWebsite.value.map((w) => ({
            ...w,
            relativeTime: timeFormat.timeFormat(w.regDate),
        }))
    }
    if (filteredWebsite.value && typeof filteredWebsite.value === 'object') {
        return Object.values(filteredWebsite.value).map((w) => ({
            ...w,
            relativeTime: timeFormat.timeFormat(w.regDate),
        }));
    }
});
console.log('createdWebsite: ', createdWebsite);

// 북마크 추천 비추천 등등
const actionHandler = async (memberId, websiteId, type) => {

    let action = "";
    // console.log('memberId ', memberId.value);
    // console.log('websiteId ', websiteId);
    // console.log('type', type);
    try {
        action = type;
        // console.log("action 데이터 ", action);

        let isActionApplied = false;

        // 해당 액션 배열 가져오기
        const actionArray = iconItem.value[action] || [];
        // 이미 북마크되어 있는지 확인
        const index = actionArray.indexOf(websiteId);
        // console.log("iconItem ", iconItem.value);

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

        // 서버로 액션 상태 전송
        const response = await useCSRFetch(`actions`, {
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
        // console.log(`액션 상태 업데이트 완료: ${websiteId}`, response.message);
    } catch (error) {
        console.error('액션 상태 업데이트 중 오류:', error);
    }
};

// 페이지네이션
const pageClickHandler = async (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    // console.log("page", page, totalPages);

    try {
        const websitesResponse = await useCSRFetch("member/websites", {
            params: {
                page: page,
                size: 30,
                ...(selectedMainCategory.value !== "전체" && {
                    categoryId: selectedMainCategory.value, // 선택된 카테고리가 있으면 추가
                }),
            },
        });

        // 페이지 정보 갱신
        pageNumbers.value = websitesResponse.pages;
        startNum.value = websitesResponse.pages[0];
        totalPages.value = websitesResponse.totalPages;
        hasPreviousPage.value = websitesResponse.hasPreviousPage;
        hasNextPage.value = websitesResponse.hasNextPage;

        // 웹사이트 데이터 업데이트
        const websiteIds = websitesResponse.websiteListDtos.map((w) => w.id);
        await fetchWebsiteActionStatus(websiteIds);

        filteredWebsite.value = websitesResponse.websiteListDtos;

    } catch (error) {
        console.error("페이지 로드 중 오류 발생:", error);
    }
}

// favicon URL 가져오기
const getFavicon = (url) => {
    return `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
    // 또는
    // return `https://favicon.io/favicon/${url}`;
    // 서버로 보내고 이미지로 만들어서 등록함
}

// 생명주기
onBeforeMount(() => {
    // console.log("onBeforeMount");
});
onMounted(async () => {
    // console.log("onMounted");

    // 새로고침 시 상태 유지가 초기화 되기 때문에 매번 불러와야한다.
    // 호출 순서에 따라 제대로 적용되지 않을 수 있으니 
    await fetchMemberActionStatus();
    // console.log('iconItem after fetchMemberActionStatus:', iconItem.value);
    // "전체" 카테고리를 자동으로 선택하도록 설정
    // console.log('selectedMainCategory:', selectedMainCategory.value);
    if (mainCategories.value.length > 0 && selectedMainCategory.value === "") {
        selectAllMainHandler(mainCategories.value[0].name);
    }

});
onBeforeUpdate(() => {
    // console.log("onBeforeUpdate");
});
onUpdated(() => {
    // console.log("onUpdated");
});
</script>

<template>

    <Head>
        <Link rel="stylesheet" href="/css/index.css" />
    </Head>

    <form enctype="multipart/form-data"></form>
    <header class="header">
        <h1>상단 메뉴</h1>
        <section class=""
            style="margin: 10px; display: flex; align-items: center; justify-content: space-between; flex-basis: 100%;">
            <NuxtLink to="/member/websites">
                <h1 class="" style="display: flex; flex-shrink: 0;">
                    <!-- <img style="width: 60px; " src="/img/logo/watercolor-4116932_1280.png" alt="로고"> -->
                    <span style="font-size: 20px; font-weight: 600;">RAWDOTWEB</span>
                </h1>
            </NuxtLink>
            <nav>
                <h1>사이드 메뉴</h1>
                <ul style="
                        display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
                    <li>
                        <!-- <span v-else class="btn btn:round">{{ userDetails.profileName }}</span> -->
                        <button class="btn btn:round" @click="userDetails.signout()">{{ userDetails.profileName }}
                        </button>
                    </li>
                </ul>
            </nav>
        </section>
        <section style="display: flex; justify-content: end; flex-basis: 100%; margin: 0 10px 10px;">
            <h1>검색</h1>
            <div
                style="display: flex; padding: 5px 10px; width: 100%; border: 1px solid var(--base-color-1); border-radius: var(--border-radius-px-1)">

                <form role="search" @submit.prevent="searchHandler">
                    <label class="" style="width: calc(100% - 40px); position: relative;">
                        <input type="search" placeholder="검색어를 입력해주세요." style="margin-left: 40px;" v-model="keyWord">

                    </label>
                    <span class="icon:search text-hidden" style="position: absolute; left: 20px;">검색</span>
                </form>

            </div>
        </section>

    </header>

    <main>
        <header class="main-header" style="margin: 120px 0 10px; overflow: hidden;">

        </header>
        <section>
            <h1>메인 페이지</h1>

            <nav style="margin-top: 10px;">
                <h1>대분류 카테고리</h1>
                <ul class="main-category">
                    <li style="display: flex; align-items:center; justify-content: space-evenly; "
                        v-for="c in mainCategories" :key="c.id">
                        <label class="icon:font-2 icon:text-bottom"
                            :class="[`icon:${c.iconName}`, { 'activeMain': c.name === selectedMainCategory }]"
                            @click="fetchCategory(c.id, 'sub'); selectAllMainHandler(c.name);">
                            <span>{{ c.name }}</span>
                            <input type="radio" name="main-category">
                        </label>
                    </li>
                </ul>
            </nav>
            <nav style="margin: 10px 0;">
                <h1>중분류 카테고리</h1>
                <ul class="sub-category">
                    <li style="display: flex;" v-for="c in subCategories" :key="c.id">
                        <label class="btn btn:square" @click="fetchCategory(c.id, 'detail')">
                            <span>{{ c.name }}</span>
                            <input type="radio" name="sub-category">
                        </label>
                    </li>
                </ul>
            </nav>
            <nav style="margin: 10px 0;">
                <h1>소분류 카테고리</h1>
                <ul class="detail-category">
                    <li style="display: flex;" v-for="c in detailCategories" :key="c.id">
                        <label class="btn btn:round" @click="fetchWebsites(c.id)">
                            <span>{{ c.name }}</span>
                            <input type="radio" name="detail-category-languege">
                        </label>
                    </li>
                </ul>
            </nav>

            <section style="display: flex; justify-content: end; gap: 5px;">
                <h1>필터</h1>
                <ul class="vertical-bar filter-list" style="">
                    <!-- <li>
                        <label @click="showBookmarkListHandler">
                            <input type="checkbox" name="filter" value="recommend">북마크
                        </label>
                    </li> -->
                    <!-- <li>
                        <label>
                            <input type="radio" name="filter" value="recommend">인기순
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="filter" value="recommend">추천순
                        </label>
                    </li> -->
                </ul>
            </section>


            <section class="website-list" v-if="searchResults.length">
                <h1>검색 결과 목록</h1>
                <div v-for="w in searchResults" :key="w.id" class="website-card"
                    style="position: relative; overflow: hidden;">
                    <NuxtLink :to="`/member/websites/${w.id}`">
                        <img class="website-img"
                            :src="w.images?.length ? `${config.public.apiBase}website/${w.images[0].src}` : '/img/website/default.png'"
                            alt="대표 이미지" />
                    </NuxtLink>
                    <button type="button" class="btn icon:font-1 text-hidden" style="padding: 0;"
                        :class="iconItem.bookmark && iconItem.bookmark.includes(w.id) ? 'icon:bookmark-added' : 'icon:bookmark-add'"
                        @click="actionHandler(userDetails.id, w.id, 'bookmark')">
                        저장
                    </button>
                    <ul class="website-content">
                        <li style="display: flex; justify-content: space-between;">
                            <span class="text-overflow"
                                style="font-size: var(--font-size-4); font-weight: var(--font-weight-6);">
                                {{ w.title }}
                            </span>
                        </li>
                        <li style="display: flex;">
                            <div class="btn">
                                {{ w.relativeTime }}
                            </div>
                            <div class="btn icon:like" style="margin-left: 3px;">
                                <span>{{ websiteActionsMap[w.id].rate }}%</span>
                            </div>
                            <div class="btn icon:views" style="margin-left: 3px;">
                                <span>1만</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            <!-- 검색 결과 없음 -->
            <section class="website-list" v-else>
                <h1>웹사이트 목록</h1>
                <div v-for="w in createdWebsite" :key="w.id" class="website-card"
                    style="position: relative; overflow: hidden;">
                    <NuxtLink :to="`/member/websites/${w.id}`">
                        <img class="website-img"
                            :src="w.images?.length ? `${config.public.apiBase}website/${w.images[0].src}` : '/img/website/default.png'"
                            alt="대표 이미지">
                    </NuxtLink>
                    <button type="button" class="btn icon:font-1 text-hidden" style="padding: 0;"
                        :class="iconItem.bookmark && iconItem.bookmark.includes(w.id) ? 'icon:bookmark-added' : 'icon:bookmark-add'"
                        @click="actionHandler(userDetails.id, w.id, 'bookmark')">저장
                    </button>
                    <!-- <span>현재 웹사이트 ID: {{ w.id }}</span>
                    <span>iconItem 배열: {{ JSON.stringify(iconItem) }}</span>
                    <span>includes 결과: {{ iconItem.bookmark.includes(w.id) }}</span> -->
                    <ul class="website-content">
                        <li style="display: flex; justify-content: space-between;">
                            <span class="text-overflow"
                                style="font-size: var(--font-size-4); font-weight: var(--font-weight-6);">{{
                                    w.title }}</span>
                        </li>
                        <li style="display: flex;">
                            <div class="btn">
                                {{ w.relativeTime }}
                            </div>
                            <div class="btn icon:like">
                                <span style="margin-left: 3px;">{{ websiteActionsMap[w.id].rate }}%</span>
                            </div>
                            <div class="btn icon:views">
                                <span style="margin-left: 3px;">1만</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
        </section>
    </main>

    <!-- 모바일은 무한 스크롤 api로 변경-->
    <section class="" style="margin-bottom: 60px;">
        <ul class="pagination" style="display: flex; justify-content: center; align-items: center; gap: 15px;">
            <li>
                <RouterLink class="icon:arrow-back text-hidden" :class="{ 'disabled': !hasPreviousPage == false }"
                    :to="`/member/websites?page=${startNum - 1 < 1 ? 1 : startNum - 1}`"
                    @click.prevent="pageClickHandler(startNum - 1)">이전
                </RouterLink>
            </li>
            <li v-for="p in pageNumbers" :key="p">
                <RouterLink class="pager" :to="`/member/websites?page=${p}`"
                    :class="{ 'activePager': p == useRoute().query.page }" @click.prevent="pageClickHandler(p)">{{ p }}
                </RouterLink>
            </li>
            <li>
                <RouterLink class="icon:arrow-forward text-hidden"
                    :to="`/member/websites?page=${startNum + 5 >= totalPages ? totalPages : startNum + 5}`"
                    :class="{ 'disabled': !hasNextPage == false }" @click.prevent="pageClickHandler(startNum + 1)">다음
                </RouterLink>
            </li>
        </ul>
    </section>

    <FooterMenu/>

</template>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    gap: 15px;

    & .disabled {
        pointer-events: none;
        display: none;
        opacity: 0.5;
    }

    .pager {
        display: flex;
        align-items: center;
        justify-content: center;

        border: 1px solid var(--base-color-3);
        border-radius: 5px;

        width: 44px;
        height: 25px;

        &:active,
        &.activePager {
            border: none;
            color: var(--base-color-white);
            background-color: var(--base-color-1);
            transition: 0.3s;
        }
    }
}
</style>