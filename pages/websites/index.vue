<script setup>
import { onBeforeMount, onBeforeUpdate, onMounted, onUpdated, ref, watchEffect } from 'vue';
import { FormatRelativeTime } from '~/public/js/formatRelativeTime';

// 설정
const config = useRuntimeConfig();
const userDetails = useUserDetails();
const { rate, fetchWebsiteActionStatus } = useWebsiteActionFetch();

// 동적 CSS 변수
const selectedMainCategory = ref("");

const isLoading = ref(false);
const error = ref(null);

// 웹사이트 페이지 정보
let startNum = 0;
let totalPages = 0;
let hasPreviousPage = false;
let hasNextPage = false;
const pageNumbers = ref([1, 2, 3, 4, 5]);

// 검색
const keyWord = ref('');
const searchResults = ref([]); // 검색 결과를 저장할 배열

// 카테고리
const mainCategories = ref([]);
const subCategories = ref([]);
const detailCategories = ref([]);
const filteredWebsite = ref([]); // 화면에 나올 웹사이트 목록 변수

//  데이터 fetch 저장 객체
const websites = ref([]);
const categories = ref([]);

// SSR {response}
// 전체 카테고리로 보여주기 위해 미리 가져오는 데이터
const { data: websiteData } = await useSSRFetch("websites");
const { data: categoryData } = await useSSRFetch("categories", {
    params: {
        parentId: null
    }
});

// api 데이터 감시
watchEffect(() => {
    if (websiteData.value) {
        websites.value = websiteData.value;
        // console.log("최신 웹사이트: ", websites.value);
    }
    if (categoryData.value) {
        categories.value = categoryData.value.categoryListDtos;
        // console.log("최신 카테고리: ", categories.value);
    }
    mainCategories.value = categories.value;
    // console.log("대분류", mainCategories.value);
});

// 상대 시간으로 변환된 데이터
const formatRelativeTime = new FormatRelativeTime()
const filteredWebsiteWithTime = computed(() => {
    if (Array.isArray(filteredWebsite.value)) {
        return filteredWebsite.value.map((w) => ({
            ...w,
            relativeTime: formatRelativeTime.formatRelativeTime(w.regDate),
        }))
    }
    if (filteredWebsite.value && typeof filteredWebsite.value === 'object') {
        return Object.values(filteredWebsite.value).map((w) => ({
            ...w,
            relativeTime: formatRelativeTime.formatRelativeTime(w.regDate),
        }));
    }
});
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

// 전체일 때
const selectAllMainHandler = async (name) => {
    selectedMainCategory.value = name;
    // console.log('selectedMainCategory:', selectedMainCategory.value);
    if (name === "전체") {

 
        const websitesResponse = await useCSRFetch("member/websites");
        const websiteIds = websitesResponse.websiteListDtos.map((w) => w.id);
        // console.log('websiteIds', websiteIds);
        await fetchWebsiteActionStatus(websiteIds);

        const allWebsitesResponse = await useCSRFetch("websites");
        filteredWebsite.value = allWebsitesResponse.websiteListDtos;
        // console.log("전체 카테고리 웹사이트 데이터: ", filteredWebsite.value);
    }
}

// 전체가 아닐 때
const fetchWebsites = async (detailCategoryId, keyword) => {
    try {
        const websiteResponse = await useCSRFetch("websites", {
            params: {
                categoryId: detailCategoryId,
                keyWord: keyword
            }
        });

        if (!websiteResponse || !websiteResponse.websiteListDtos) {
            console.error("웹사이트 데이터가 비어있습니다.");
            return;
        }

 
        const websiteIds = websiteResponse.websiteListDtos.map(website => website.id);
        // console.log("필터링한 웹사이트 ID 목록:", websiteIds);
        await fetchWebsiteActionStatus(websiteIds);

        filteredWebsite.value = websiteResponse.websiteListDtos;
        // console.log(`소분류 ID ${detailCategoryId}의 웹사이트 데이터:`, filteredWebsite.value);

    } catch (error) {
        console.error("웹사이트 데이터 가져오기 중 오류 발생: ", error);
    }
};

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
        const response = await useCSRFetch("websites", {
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

const onBookmark = async () => {
    if (userDetails.isGhost()) {
        return navigateTo('/siginin');
    }
};

const pageClickHandler = (page) => {
    // console.log("page", page, totalPages);
    if (page < 1) {
        alert("이전 페이지가 없습니다.");
        return;
    }
    if (totalPages < page) {
        alert("다음 페이지가 없습니다");
        return;
    }
    // if(page == null) {
    //     delete keyword.page;
    // }
    // keyword.page = page;
}
// favicon URL 가져오기
const getFavicon = (url) => {
    return `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
    // 또는
    // return `https://favicon.io/favicon/${url}`;
}

onBeforeMount(() => {
    // console.log("onBeforeMount");
});
onMounted(async () => {
    // console.log("onMounted");
    // "전체" 카테고리를 자동으로 선택하도록 설정
    // console.log('selectedMainCategory:', selectedMainCategory.value);
    if (mainCategories.value.length > 0) {
        await selectAllMainHandler(mainCategories.value[0].name);
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
            <NuxtLink to="/websites">
                <h1 class="" style="display: flex; flex-shrink: 0;">
                    <!-- <img style="width: 60px; " src="/img/logo/watercolor-4116932_1280.png" alt="로고"> -->
                    <span style="font-size: 20px; font-weight: 600;">ROWDOTWEB</span>
                </h1>
            </NuxtLink>
            <nav>
                <h1>사이드 메뉴</h1>
                <ul style="
                        display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
                    <li>
                        <NuxtLink v-if="userDetails.isGhost()" class="btn btn:round" to="/signin">로그인</NuxtLink>
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

            <section class="website-list" v-if="searchResults.length">
                <h1>검색 결과 목록</h1>
                <div v-for="w in searchResults" :key="w.id" class="website-card"
                    style="position: relative; overflow: hidden;">
                    <NuxtLink :to="`/member/websites/${w.id}`">
                        <img class="website-img"
                            :src="w.images?.length ? `${config.public.apiBase}website/${w.images[0].src}` : '/img/website/default.png'"
                            alt="대표 이미지" />
                    </NuxtLink>
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
                            <div class="btn icon:liked">
                                <span>{{ rate }}%</span>
                            </div>
                            <div class="btn icon:views">
                                <span>1만</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            <section class="website-list" v-else>
                <h1>웹사이트 목록</h1>
                <div v-for="w in filteredWebsiteWithTime" :key="w.id" class="website-card"
                    style="position: relative; overflow: hidden;">
                    <NuxtLink :to="`/websites/${w.id}`">
                        <img class="website-img"
                            :src="w.images?.length ? `${config.public.apiBase}website/${w.images[0].src}` : '/img/website/default.png'"
                            alt="대표 이미지">
                    </NuxtLink>
                    <ul class="website-content">
                        <li style="display: flex; justify-content: space-between;">
                            <span class="text-overflow"
                                style="font-size: var(--font-size-4); font-weight: var(--font-weight-6);">{{ w.title
                                }}</span>
                            <!-- <span class="icon:more text-hidden" style="position: absolute; right: 0;">더보기</span> -->
                        </li>
                        <li style="display: flex;">
                            <div class="btn">
                                {{ w.relativeTime }}
                            </div>
                            <div class="btn icon:liked">
                                <span>{{ rate }}%</span>
                            </div>
                            <div class="btn icon:views">
                                <span>1만</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
        </section>
    </main>

    <!-- 무한 스크롤 api 호출-->
    <section class="main-footer" style="margin-bottom: 60px;">
        <ul class="pagination" style="display: flex; justify-content: center; gap: 15px;">
            <li v-for="p in pageNumbers" :key="p">
                <NuxtLink class="pager" :class="{ 'activePager': p == useRoute().query.p }" :to="`websites?page=${p}`"
                    @Click="pageClickHandler">{{ p }}</NuxtLink>
            </li>
        </ul>
    </section>

    <FooterMenu home="/websites" />

</template>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    gap: 15px;

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