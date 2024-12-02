<script setup>

const categoryForm = ref({
    name: '',
    korName: '',
    engName: '',
    iconName: '',
    parentId: null,
    subCategories: []
});
const submitHandler = async() => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('name', categoryForm.value.name);
    formData.append('korName', categoryForm.value.korName);
    formData.append('engName', categoryForm.value.engName);
    formData.append('iconName', categoryForm.value.iconName);
    formData.append('parentId', categoryForm.value.parentId);
    formData.append('subCategories', categoryForm.value.subCategories);
};

</script>

<template>
    
    <HeaderMenu/>

    <main>
        <section class="form-box" style="display: flex; flex-wrap: wrap; width: auto; margin: 10px;">
            <h1>카테고리 등록 페이지</h1>
            <form @submit.prevent="submitHandler">
                <label>
                    <span>대분류 카테고리 <span style="color: red;" aria-label="required">*</span></span>
                    <input type="text" required>
                </label>
                <label>
                    <span>대분류 아이콘 이름(영어) <span style="color: red;" aria-label="required">*</span></span>
                    <input type="text" placeholder="영어로 적어주세요." required>
                </label>
                <label>
                    <span>대분류 한글명</span>
                    <input type="text">
                </label>
                <label>
                    <span>대분류 영문명</span>
                    <input type="text">
                </label>
                <div class="text-hidden" style="position: relative; border: none; border-top: 1px solid var(--base-color-3); margin: 30px 0 30px 0; width: 100%;">구분선</div>
                <label>
                    <span>중분류 카테고리 <span style="color: red;" aria-label="required">*</span></span>
                    <input type="text" required>
                </label>
                <div class="text-hidden" style="position: relative; border: none; border-top: 1px solid var(--base-color-3); margin: 30px 0 30px 0; width: 100%;">구분선</div>
                <label>
                    <span>소분류 카테고리 <span style="color: red;" aria-label="required">*</span></span>
                    <input type="text" required>
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