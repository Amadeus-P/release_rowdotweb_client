export default function useWebsiteActionFetch() {
    const config = useRuntimeConfig();
    const userDetails = useUserDetails();
    const likeCount = ref(0);
    const dislikeCount = ref(0);
    const rate = ref(0);

    // 상태유지
    const iconItem = ref({
        bookmark: [],
        like: [],
        dislike: [],
    });
    // 사용자의 북마크 목록 가져오기
    const fetchMemberBookmarkStatus = async () => {
        try {
            const actionResponse = await $fetch(`${config.public.apiBase}actions/member/${userDetails.id.value}`, {
                headers: {
                    Authorization: `Bearer ${userDetails.token.value}`,
                },
            });
            console.log("actionResponse ", actionResponse);

            if (actionResponse && actionResponse.actionDtos) {
                // `actionDtos`를 기반으로 `iconItem`을 업데이트
                actionResponse.actionDtos.forEach((actionDto) => {
                    const { action, websiteId } = actionDto;
                    if (actionDto.isAdded) {
                        if (!iconItem.value[action]) {
                            iconItem.value[action] = [];
                        }
                        iconItem.value[action].push(websiteId);
                    }
                });
                console.log('액션 목록:', iconItem.value);
            }
        } catch (error) {
            console.error('북마크 목록 가져오기 중 오류:', error);
        }
    };

    const fetchWebsiteActionStatus = async (websiteId) => {
        try {

            if (Array.isArray(websiteId)) {
                const websiteListActionResponse = await $fetch(`${config.public.apiBase}actions/website?websiteIds=${websiteId.join(",")}`, {
                    headers: {
                        Authorization: `Bearer ${userDetails.token.value}`,
                    }
                });

                console.log('websiteActionResponse.actionDtos', websiteListActionResponse);
                if (websiteListActionResponse && websiteListActionResponse.actionDtos) {

                    const actionDto = websiteListActionResponse.actionDtos;
                    const likeDto = actionDto.find(dto => dto.action === 'like');
                    const dislikeDto = actionDto.find(dto => dto.action === 'dislike');
                    const bookmarkDto = actionDto.find(dto => dto.action === 'bookmark');

                    // 좋아요/싫어요 수 업데이트
                    likeCount.value = likeDto ? likeDto.likeCount : 0;
                    dislikeCount.value = dislikeDto ? dislikeDto.dislikeCount : 0;


                    // 추천 비율
                    const total = likeCount.value + dislikeCount.value;
                    rate.value = total > 0
                        ? Math.round((likeCount.value / total) * 100) : 0;
                }
            } else {

                const websiteActionResponse = await $fetch(`${config.public.apiBase}actions/website/${websiteId}`, {
                    headers: {
                        Authorization: `Bearer ${userDetails.token.value}`,
                    },
                });

                if (websiteActionResponse && websiteActionResponse.actionDtos) {
                    console.log('websiteActionResponse.actionDtos', websiteActionResponse.actionDtos);

                    const actionDto = websiteActionResponse.actionDtos;
                    const likeDto = actionDto.find(dto => dto.action === 'like');
                    const dislikeDto = actionDto.find(dto => dto.action === 'dislike');

                    // 좋아요/싫어요 수 업데이트
                    likeCount.value = likeDto ? likeDto.likeCount : 0;
                    dislikeCount.value = dislikeDto ? dislikeDto.dislikeCount : 0;
                }
            }
        } catch (error) {
            console.error('데이터 가져오기 실패:', error);
        }
    };

    return {
        iconItem,
        likeCount,
        dislikeCount,
        rate,
        fetchMemberBookmarkStatus,
        fetchWebsiteActionStatus,
    };
}