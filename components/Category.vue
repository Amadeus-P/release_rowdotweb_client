<script setup>
    const props = defineProps({
        mainCategories: {
            type: Array,
            default: () => []
        },
        subCategories: {
            type: Array,
            default: () => []
        },
        detailCategories: {
            type: Array,
            default: () => []
        },
        websites: {
            type: Object,
            default: () => ({})
        },
        selectedMainCategoryId: {
            type: Number,
            default: 0
        },
        selectedSubCategoryId: {
            type: Number,
            default: 0
        },
        selectedDetailCategoryId: {
            type: Number,
            default: 0
        },
        isSubCategoryShow: {
            type: Boolean,
            default: false
        },
        filteredSubCategories: {
            type: Array,
            default: () => []
        },
        isDetailCategoryShow: {
            type: Boolean,
            default: false
        },
        filteredDetailCategories: {
            type: Array,
            default: () => []
        }
    });

    const emit = defineEmits([
        'selectAllMain',
        'selectAllSub',
        'showSubCategory',
        'showDetailCategory',
        'showWebsite'
    ]);



</script>
<template>
    <nav v-if="true" style="margin-top: 10px; flex-basis: 100%; justify-content: space-evenly;">
        <h1>대분류 카테고리</h1>
        <ul class="main-category">
            <li v-for="c in mainCategories" :key="c.id" 
                @click.prevent="c.name === '전체'? 
                emit('selectAllMain', c.id) 
                : emit('showSubCategory',c.id) ">
                <label
                    class="icon:font-2 icon:text-bottom"
                    v-bind:class="[`icon:${c.iconName}`, { activeMain : selectedMainCategoryId === c.id}]">
                        <input type="radio" name="main-category"  
                        v-bind:value="c.id">{{c.name}}
                </label>
            </li>
        </ul>
    </nav>
    <nav v-show="isSubCategoryShow" style="margin: 10px 0;">
        <h1>중분류 카테고리</h1>
        <ul class="sub-category">
            <li v-for="c in filteredSubCategories" :key="c.id" @click.prevent="c.name === '전체'? emit('selectAllSub', c.id) : emit('showDetailCategory', c.id)">
                <label class="btn btn:square" 
                v-bind:class="{ activeSub : selectedSubCategoryId === c.id}">
                    <input type="checkbox" name="sub-category" 
                    v-bind:value="c.id">{{ c.name }}
                </label>
            </li>
        </ul>
    </nav>
    <nav v-show="isDetailCategoryShow" style="margin: 10px 0;">
        <h1>소분류 카테고리</h1>
        <ul class="detail-category">
            <li v-for="c in filteredDetailCategories" :key="c.id" @click.prevent="emit('showWebsite', c.id)">
                <label class="btn btn:round"  
                    v-bind:class="{ activeDetail : selectedDetailCategoryId === c.id }">
                    <input type="radio" name="detail-category-languege" 
                    v-bind:value="c.id">{{ c.name }}
                </label>
            </li>
        </ul>
    </nav>
</template>