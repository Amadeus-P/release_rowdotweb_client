<script setup>
// 카테고리
const mainCategories = ref([]);
const subCategories = ref([]);
const detailCategories = ref([]);

const userDetails = useUserDetails();
const config = useRuntimeConfig();

const websiteForm = ref({
    title: '',
    url: '',
    categoryId: null,
    img: null,
    memberId: null
});

const { data: categoryData } = await useSSRFetch("categories", {
    params: {
        parentId: null
    }
});

// api 데이터 감시
watchEffect(() => {
    if (categoryData.value) {
        mainCategories.value = categoryData.value.categoryListDtos;
        console.log("대분류", mainCategories.value);
        subCategories.value = [];
        detailCategories.value = [];
    }
});

const fetchSubCategories = async (mainCategoryId) => {
    subCategories.value = [];
    detailCategories.value = [];

    const data = await useCSRFetch("categories", {
        params: {
            parentId: mainCategoryId
        }
    });
    console.log(data);
    if (data && data.categoryListDtos) {
        subCategories.value[mainCategoryId] = data.categoryListDtos;
    }
};

const fetchDetailCategories = async (subCategoryId) => {
    detailCategories.value = [];
    const data = await useCSRFetch("categories", {
        params: {
            parentId: subCategoryId
        }
    });
    console.log(data);
    if (data && data.categoryListDtos) {
        detailCategories.value[subCategoryId] = data.categoryListDtos;
    }
};

// 이미지
const handleFileChange = (event) => {
    websiteForm.value.img = event.target.files[0];
    console.log('선택한 이미지 파일:', websiteForm.value.img);
};

const submitHandler = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!websiteForm.value.title || websiteForm.value.title.trim() === "") {
        console.error("제목을 입력해주세요.");
        return;
    }

    if (!websiteForm.value.url || !/^https:\/\/.+$/.test(websiteForm.value.url)) {
        console.error("'https://'로 시작해야 합니다.");
        return;
    }

    if (!websiteForm.value.categoryId) {
        console.error("카테고리를 선택해주세요.");
        return;
    }

    if (!websiteForm.value.img) {
        console.error("이미지를 업로드해주세요.");
        return;
    }

    // console.log("이미지", websiteForm.value.img.name);
    // console.log('title', websiteForm.value.title);
    // console.log('url', websiteForm.value.url);
    // console.log('categoryId', websiteForm.value.categoryId);


    const formData = new FormData();

    formData.append('title', websiteForm.value.title);
    formData.append('url', websiteForm.value.url);
    formData.append('categoryId', websiteForm.value.categoryId);
    formData.append('img', websiteForm.value.img);
    try {
        // 데이터 전송 (Fetch API 사용)
        // const response = await useCSRFetch(`member/websites`, formData, {
        // method: 'POST'
        // });

        const response = await $fetch(`${config.public.apiBase}member/websites`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${userDetails.token.value}` // Bearer 토큰 추가
            }
        })

        // $fetch가 응답을 JSON으로 Parcing하기때문에 response는 JSON 문자열임
        const result = await response;

        // 서버 응답 메세지와 동일하지 않을 때
        if (result.message !== "웹사이트 등록 성공") {
            console.log(response);
            throw new Error('사이트 등록에 실패했습니다.');
        }
        console.log('사이트 등록 성공:', result);
        // 성공적으로 등록된 후 다른 페이지로 이동하거나 상태 초기화할 수 있음
        return navigateTo("/member/websites");
    } catch (error) {
        console.error('에러 발생:', error);
    }
}

const addHttpsPrefix = () => {
  if (!websiteForm.value.url.startsWith('https://')) {
    websiteForm.value.url = 'https://';
  }
};
</script>
<template>

    <HeaderMenu />

    <main>
        <h1>웹사이트 등록 페이지</h1>
        <section style="display: flex; justify-content: space-evenly;">
            <h1>사이트 정보 입력</h1>
            <!-- ajax사용시 form은 사용 안함 -->
            <form @submit.prevent="submitHandler">
                <fieldset>
                    <legend class="legend">사이트 정보 입력</legend>
                    <section>
                        <h2>카테고리 선택</h2>
                        <ul>
                            <li class="main" v-for="main in mainCategories.filter(item => item.name !== '전체')"
                                :key="main.id">
                                <label @click="fetchSubCategories(main.id)">
                                    <span>{{ main.name }} </span>
                                    <input type="radio" name="main" />
                                </label>
                                <ul>
                                    <li class="sub" v-for="sub in subCategories[main.id]" :key="sub.id">
                                        <label @click="fetchDetailCategories(sub.id)">

                                            <span>{{ sub.name }}</span>
                                            <input type="radio" name="sub" />
                                        </label>
                                        <ul>
                                            <li class="detail" v-for="detail in detailCategories[sub.id]"
                                                :key="detail.id">
                                                <label>
                                                    <span>{{ detail.name }}</span>
                                                    <input type="radio" name="detail" :value="detail.id"
                                                        v-model="websiteForm.categoryId" />
                                                </label>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </section>
                    <!-- 사이트 정보 입력하기 -->
                    <section class="" style="margin-top: 50px; display: flex; gap: 10px; flex-direction: column;">
                        <h2>사이트 정보 입력</h2>
                        <label class="">
                            <span>대표 URL</span>
                            <strong><span style="color: var(--accent-color-1);" aria-label="필수입력">*</span></strong>
                            <input type="url" id="url-prefix" name="url" pattern="https:(//)?.*" placeholder="https://" autofocus required 
                            v-model="websiteForm.url"
                            @focus="addHttpsPrefix" />
                        </label>
                        <label class="">
                            <span>홈페이지 타이틀</span>
                            <strong><span style="color: var(--accent-color-1);" aria-label="필수입력">*</span></strong>
                            <input type="text" name="title" placeholder="" required v-model="websiteForm.title" />
                        </label>
                        <label>
                            <span>이미지 업로드</span>
                            <span
                                style="font-size: var(--font-size-2); font-weight: var(--font-weight-6);  color: var(--base-color-3);">
                                웹사이트와 관련된 이미지나 스크린샷을 올려주세요. 16: 9 비율 최대 1장 업로드
                            </span>
                            <input type="file" @change="handleFileChange" />
                            <span class="icon:add"
                                style="display: flex; width: 100%; height: 100%;  border: 1px solid black;"></span>
                        </label>
                    </section>

                </fieldset>
                <div style="margin: 100px 0;">
                    <button class="btn btn-submit btn:round">사이트 등록하기</button>
                </div>
            </form>
        </section>
    </main>
</template>

<style scoped>
* {
    box-sizing: border-box;
    font-size: var(--font-size-4);
    font-weight: var(--font-weight-6);
}

/* 아코디언 로직 */
.sub ul,
.detail ul {
    height: 0;
    overflow: hidden;
}

.main:has(input[type="radio"]:checked) .sub ul {
    display: flex;
    flex-direction: column;
    height: auto;
}

.sub:has(input[type="radio"]:checked) .detail ul {
    display: flex;
    flex-direction: column;
    height: auto;

}

/* 아코디언 스타일 */
.main,
.sub,
.detail {
    padding-top: 5px;
    padding-bottom: 10px;
    padding-left: 20px;

    >label {
        display: block;
        /* not inline */
        width: 100%;
        height: 100%;
    }
}

.main {
    border-top: 3px solid var(--base-color-1);
    padding-left: 0;
}

/* 마지막 줄 */
.main li:has(.detail:last-child) {
    border-bottom: 2px solid var(--base-color-1);
    padding-bottom: 0;
}

label:has(input[type="radio"]:checked) {
    color: var(--main-color-1);
}

/* 폼 스타일 */
form {

    /* width: 100%; */
    span {
        font-size: var(--font-size-4);
        font-weight: var(--font-weight-6);
    }

    label {
        display: flex;
        width: auto;
        flex-wrap: wrap;
        margin: 0 10px 10px;

        >input {
            line-height: 20px;
            border: 1px solid var(--base-color-4);
            border-radius: 5px;
            width: 100%;
            height: 40px;
            padding: 5px 10px;
            font-size: var(--font-size-3);
            font-weight: var(--font-weight-4);

            &:focus {
                border: 1px solid var(--base-color-1);
            }
        }
    }
}

/* form */

.icon\:arrow-down::before {
    width: 36px;
    height: 36px;
    mask-size: 36px 36px;
    background-color: var(--base-color-1);
    transition: transform 0.3s ease;
}

.icon\:arrow-down:has(input[type="radio"]:checked)::before {
    transition: transform 0.3s ease;
    transform: rotate(180deg);
}
</style>