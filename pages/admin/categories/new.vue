<script setup>
const userDetails = useUserDetails();
const config = useRuntimeConfig();

const categoryForm = ref({
    name: '',
    korName: '',
    engName: '',
    iconName: '',
    parentId: null,
    subCategories: []
});

const addSubCategory = () => {
    categoryForm.value.subCategories.push({
        name: '',
        korName: '',
        engName: ''
    });
};

const submitHandler = async(e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('name', categoryForm.value.name);
    formData.append('korName', categoryForm.value.korName);
    formData.append('engName', categoryForm.value.engName);
    formData.append('iconName', categoryForm.value.iconName);
    formData.append('parentId', categoryForm.value.parentId);
    formData.append('subCategories', categoryForm.value.subCategories);


    try {
        const response = await useCSRFetch(`${config.public.apiBase}categories`, categoryForm.value);
        console.log('카테고리 등록 성공:', response.data);
    } catch (error) {
        console.error('카테고리 등록 실패:', error.response.data);
    }
};

</script>

<template>
    
    <HeaderMenu/>

    <main>
        <section class="form-box" style="display: flex; flex-wrap: wrap; width: auto; margin: 10px;">
            <h1>카테고리 등록 페이지</h1>
            <form @submit.prevent="submitHandler">
                <label>
                    <span>대분류 아이콘 이름(영어) <span style="color: red;" aria-label="required">*</span></span>
                    <input type="text" placeholder="영어로 적어주세요." required
                    v-model="categoryForm.iconName">
                </label>
                <label>
                    <span>대분류 명 <span style="color: red;" aria-label="required">*</span></span>
                    <input type="text" placeholder="실제로 사용할 이름을 입력하세요." required 
                    v-model="categoryForm.name">
                </label>
                <div class="text-hidden" style="position: relative; border: none; border-top: 1px solid var(--base-color-3); margin: 30px 0 30px 0; width: 100%;">구분선</div>
                <label>
                    <span>중분류 명 <span style="color: red;" aria-label="required">*</span></span>
                    <input type="text" placeholder="실제로 사용할 이름을 입력하세요." required>
                </label>
                <div class="text-hidden" style="position: relative; border: none; border-top: 1px solid var(--base-color-3); margin: 30px 0 30px 0; width: 100%;">구분선</div>
                <label>
                    <span>소분류 명 <span style="color: red;" aria-label="required">*</span></span>
                    <input type="text" placeholder="실제로 사용할 이름을 입력하세요." required>
                </label>
                <div style="display: flex; margin-top: 50px;">
                    <button class="btn btn:round btn-submit">카테고리 등록하기</button>
                </div>
            </form>
        </section>
    </main>
</template>

<style scoped>
</style>