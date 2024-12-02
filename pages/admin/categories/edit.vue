<script setup>

import { ref } from 'vue';
import draggable from 'vuedraggable';

const categories = ref([]);

const { data: categoryResponse }= await useSSRFetch("categories", {
    params: {
        parentId: null
    }
});
watchEffect(() => {

    if (categoryResponse.value.categoryListDtos) {

        categories.value = categoryResponse.value.categoryListDtos;
        console.log(categoryResponse.value.categoryListDtos);

        console.log('categories', categories.value);
    }
});
const items = ref(['Item 1', 'Item 2', 'Item 3']);

const onEnd = (event) => {
    console.log('Drag ended:', event);

    // 서버에 데이터 저장
};
</script>

<template>

    <HeaderMenu />
    <template>
        <nav style="margin-top: 10px;">
            <h1>대분류 카테고리</h1>
            <draggable v-model="categories" group="categories" @start="onStart" @end="onEnd" item-key="id">
                <template #item="{ element, index }">
                    <ul  class="main-category">
                        <li style="display: flex; align-items:center; justify-content: center;">
                            <label class="icon:font-2 icon:text-bottom" :class="`icon:${element.iconName}`">
                            <span>{{ index + 1 }}</span>
                                <span>{{ element.name }}</span>
                                <input type="radio" name="main-category" />
                            </label>
                        </li>
                    </ul>
                </template>
            </draggable>
        </nav>
    </template>



    <FooterMenu />

</template>

<style scoped></style>
