<script setup>
</script>

<template>
    
    <HeaderMenu/>

    <main>
        <section class="form-edit-box" style="display: flex; flex-wrap: wrap; width: auto; margin: 10px;">
            <form>
                <label>
                    <span>대분류 카테고리</span>
                    <input type="text">
                </label>
                <label>
                    <span>대분류 카테고리 영어</span>
                    <input type="text" placeholder="예시) food, fashion, community ">
                </label>
                <label>
                    <span>중분류 카테고리</span>
                    <input type="text">
                </label>
                <label>
                    <span>소분류 카테고리</span>
                    <input type="text">
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