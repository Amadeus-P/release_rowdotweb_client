<template>

    <HeaderMenu/>    
    
    <main>
        <h1>검색 페이지</h1>
        <form action="" method="post" role="search">
            <label class="" style="position: relative; border-color: var(--main-color-1)">
                <input type="search" name="keyWord" placeholder="이름 또는 카테고리로 검색" autocomplete="off"
                       style="margin-left: 40px;">
            </label>
            <span class="icon:search text-hidden" style="position: absolute; left: 20px;">검색</span>
            <button type="reset" class="btn" style="margin-right: 10px;">
                <span class="btn-style:default">취소</span>
            </button>
        </form>
     
    </main>
</template>

<style>
        ul.auto-complete>li{
            margin-bottom: 10px;

            font-size: var(--font-size-2);
            font-weight: var(--font-weight-6);
        }

        ul.top-searched {
            display: flex;
            flex-wrap: wrap;

            font-size: var(--font-size-2);
            font-weight: var(--font-weight-4);
        }

        ul.top-searched>li {
            width: 48%;  /* 각 항목이 50% 대신 약간 여유를 두고 절반을 차지 */
            margin-bottom: 10px; /* 각 줄 사이 간격 */
            display: flex;
        }
        ul.top-searched>li>span.search-ranking{
            /* 검색 순위 */
            display: flex;
            width: 20px;
            margin-right: 5px;
        }

        /* 왼쪽 열: 홀수 항목 */
        ul.top-searched>li:nth-child(odd) {
            justify-content: flex-start;
        }

        /* 오른쪽 열: 짝수 항목 */
        ul.top-searched>li:nth-child(even) {
            justify-content: flex-start;
        }


    </style>