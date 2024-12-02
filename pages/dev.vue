<script setup>

import { ref } from 'vue';
import draggable from 'vuedraggable';

const categories = ref([]);

const {data: categoryResponse} = await useSSRFetch("categories", {
    params: {
        parentId: null
    }
});
    watchEffect(()=>{

        if(categoryResponse.value) {
            
            categories.value = categoryResponse.value.categoryListDtos;
            console.log(categoryResponse.value.categoryListDtos);
            
            console.log('categories', categories.value);
        }
    });


// export default defineComponent({
//     components: { draggable },
//     setup() {

        // dataFetch
        const items = ref(['Item 1', 'Item 2', 'Item 3']);

        const onEnd = (event) => {
            console.log('Drag ended:', event);

            // 서버에 데이터 저장
        };

        // return { items, onEnd };
//     },
// });
</script>

<template>
    <div>
        <draggable v-model="categories" group="items" @end="onEnd">
            <template #item="{ element, index }">
                <div :key="element">
                    {{ index + 1 }}.
                    {{ element.name }}
                </div>
            </template>
        </draggable>
    </div>


    <h1 class="" style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; height: 100vh;">
                    <!-- <img style="width: 60px; " src="/img/logo/watercolor-4116932_1280.png" alt="로고"> -->
                     <span style="font-size: 20px; font-weight: 600;">ROWDOTWEB</span>
                </h1>
</template>
