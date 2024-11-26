<script setup>
// var acc = document.getElementsByClassName("accordion");
// var i;

// for (i = 0; i < acc.length; i++) {
//     acc[i].addEventListener("click", function() {
//         this.classList.toggle("active");
//         var panel = this.nextElementSibling;
//         if (panel.style.display === "block") {
//             panel.style.display = "none";
//         } else {
//             panel.style.display = "block";
//         }
//     });
// }

</script>

<template>
       <h2>다단계 아코디언 메뉴</h2>

<!-- 대분류 -->
<button class="accordion">대분류 1</button>
<div class="panel">
    <!-- 중분류 -->
    <button class="accordion">중분류 1-1</button>
    <div class="panel">
        <!-- 소분류 -->
        <p>소분류 1-1-1</p>
        <p>소분류 1-1-2</p>
    </div>
    <button class="accordion">중분류 1-2</button>
    <div class="panel">
        <p>소분류 1-2-1</p>
        <p>소분류 1-2-2</p>
    </div>
</div>

<button class="accordion">대분류 2</button>
<div class="panel">
    <button class="accordion">중분류 2-1</button>
    <div class="panel">
        <p>소분류 2-1-1</p>
        <p>소분류 2-1-2</p>
    </div>
    <button class="accordion">중분류 2-2</button>
    <div class="panel">
        <p>소분류 2-2-1</p>
        <p>소분류 2-2-2</p>
    </div>
</div>
</template>

<style scoped>
.accordion {
    background-color: #eee;
    cursor: pointer;
    padding: 10px;
    width: 100%;
    text-align: left;
    border: none;
    outline: none;
    transition: background-color 0.2s ease;
    font-size: 16px;
}

.active, .accordion:hover {
    background-color: #ccc;
}

.panel {
    display: none;
    background-color: white;
    overflow: hidden;
    padding-left: 20px;
}

</style>
