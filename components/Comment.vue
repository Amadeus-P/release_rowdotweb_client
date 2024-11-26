<script setup>
</script>
<template>
    <!-- 모달 시트 -->
    <!--<lazy-list>지연로딩: 데이터가 필요할 때 불러옴</lazy-list>-->
    <section style="margin: 10px; display:flex;">
        <h1>등록한 댓글</h1>
        <div style="display:flex; height: 100px;">
            <img class="profile-img" src="/img/member/ico_ep2_01.png" alt="프로필사진">
        </div>
        <div style="display: flex; flex-wrap: wrap; flex-basis: 100%; align-items: center;">
            <span style="
                      font-size: var(--font-size-1);
                      color: var(--base-color-3); padding: 2px;">회원명
            </span>

            <span style="font-size: var(--font-size-1); color: var(--base-color-3); padding: 2px;">등록일</span>

            <div class="icon:more-small"
                style="position: relative; margin-left: auto; display: flex; flex-direction: column;">
                <div
                    style="position: absolute; top: -4px; right: 20px; display: flex; flex-direction: column; gap: 5px;">
                    <button type="button" class="btn-style:small">수정</button>
                    <button class="btn-accent:small">삭제</button>
                </div>
            </div>
            <textarea name="reply" class="text-overflow" placeholder="등록한 댓글" style="
                    resize:none;
                    font-size: var(--font-size-2);
                    font-weight: var(--font-weight-6);
                    border: none;
                    width: 100%;
                    height: 20px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                    ">
            </textarea>

            <ul style="display: flex; gap: 20px; margin-right: auto;">
                <li>
                    <button type="button" class="icon:recommended btn">
                        <data style="margin-left: 5px; font-size: var(--font-size-1);">1천</data>
                    </button>

                </li>
                <li>
                    <button type="button" class="icon:dislike text-hidden btn">아니오</button>
                </li>
            </ul>
            <div style="display: flex; flex-basis: 100%;">
                <span style="
            font-size: var(--font-size-1);
            color: var(--base-color-3)">10명이 이 리뷰가 유용하다고 평가함</span>
                <RouterLink to="" class="icon:comment icon:text-left" style="margin-left: auto; ">
                    <data style="margin-right: 5px; font-size: var(--font-size-1);">17</data>
                </RouterLink>
            </div>
        </div>
    </section>

    <form action="detail" method="post">
        <section style="
          margin: 10px;
          display:flex;">
            <h1>수정할 댓글</h1>
            <div style="display:flex; height: 100px;">
                <img class="profile-img" src="/img/member/ico_ep2_01.png" alt="프로필사진">
            </div>
            <div style="display: flex; flex-wrap: wrap; flex-basis: 100%; align-items: center;">
                <span style="
                      font-size: var(--font-size-1);
                      color: var(--base-color-3); padding: 2px;
                      ">회원명</span>
                <textarea name="reply" class="text-overflow" placeholder="내가 수정할 댓글" style="
                        resize:none;
                        font-size: var(--font-size-2);
                        font-weight: var(--font-weight-6);
                        border: none;
                        width: 100%;
                        height: 20px;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 3;
                        overflow: hidden;
                      "></textarea>
                <ul style="display: flex; gap: 5px; margin-left: auto;">
                    <li>
                        <button type="reset" class="btn-style:small">취소</button>
                    </li>
                    <li>
                        <button class="btn-submit:small">저장</button>
                    </li>
                </ul>
            </div>
        </section>
    </form>

    <section style="
          margin: 10px;
          display:flex;">
        <h1>희원이 등록한 댓글</h1>
        <div style="display:flex; height: 100px;">
            <img class="profile-img" src="/img/member/ico_ep2_01.png" alt="프로필사진">
        </div>
        <div style="display: flex; flex-wrap: wrap; flex-basis: 100%; align-items: center;">
            <span style="
                      font-size: var(--font-size-1);
                      color: var(--base-color-3); padding: 2px;
                      ">회원명</span>
            <span style="
                          font-size: var(--font-size-1);
                          color: var(--base-color-3); padding: 2px;">등록일</span>
            <div class="icon:more-small"
                style="position: relative; margin-left: auto; display: flex; flex-direction: column;">
                <div style="position: absolute; top: -4px; right: 20px; z-index: var(--z-index-middle)">
                    <RouterLink to="report" class="btn-style:small">부적절한 리뷰로 신고</RouterLink>
                </div>
            </div>

            <textarea name="reply" class="text-overflow" placeholder="회원이 등록한 댓글" style="
                        resize:none;
                        font-size: var(--font-size-2);
                        font-weight: var(--font-weight-6);
                        border: none;
                        width: 100%;
                        height: 20px;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 3;
                        overflow: hidden;">
            </textarea>
            <div style="">
                <button type="button" class="icon:arrow-down icon:text-left btn">자세히 보기</button>
            </div>
            <ul style="display: flex; flex-wrap: wrap; flex-basis: 100%; gap: 20px;">
                <li>
                    <span>리뷰가 유용했나요?</span>
                </li>
                <li>
                    <button type="button" class="icon:recommended text-hidden btn">네</button>
                </li>
                <li>
                    <button type="button" class="icon:dislike text-hidden btn">아니오</button>
                </li>
            </ul>
            <div style="display: flex; flex-basis: 100%;">
                <span style="
                  font-size: var(--font-size-1);
                  color: var(--base-color-3)">10명이 이 리뷰가 유용하다고 평가함</span>
                <RouterLink to="" class="icon:comment icon:text-left" style="margin-left: auto; ">
                    <data style="margin-right: 5px; font-size: var(--font-size-1);">17</data>
                </RouterLink>
            </div>
        </div>
    </section>


    <form action="detail" method="post">
        <section style="
          margin: 10px;
          display:flex;">
            <h1>수정할 댓글</h1>
            <div style="display:flex; height: 100px;">
                <img class="profile-img" src="/img/member/ico_ep2_01.png" alt="프로필사진">
            </div>
            <div style="display: flex; flex-wrap: wrap; flex-basis: 100%; align-items: center;">
                <span style="
                      font-size: var(--font-size-1);
                      color: var(--base-color-3); padding: 2px;
                      ">회원명</span>
                <textarea name="reply" class="text-overflow" placeholder="리뷰를 작성해주세요." style="
                        resize:none;
                        font-size: var(--font-size-2);
                        font-weight: var(--font-weight-6);
                        border: none;
                        width: 100%;
                        height: 20px;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 3;
                        overflow: hidden;
                      "></textarea>
                <ul style="display: flex; gap: 5px; margin-left: auto;">
                    <li>
                        <button type="reset" class="btn-style:small">취소</button>
                    </li>
                    <li>

                        <button class="btn-submit:small">등록</button>
                    </li>
                </ul>
            </div>
        </section>
    </form>
</template>