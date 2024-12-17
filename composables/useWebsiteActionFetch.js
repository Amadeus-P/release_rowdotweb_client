export default function useWebsiteActionFetch() {
    const config = useRuntimeConfig();
    const userDetails = useUserDetails();
    const likeCount = ref(0);
    const dislikeCount = ref(0);
    const bookmarkCount = ref(0);
    const rate = ref(0);
    // const websiteActionsMap = ref({});
    const websiteActionsMap = {};
    // 상태유지
    const iconItem = ref({
        bookmark: [],
        like: [],
        dislike: [],
    });
    // 사용자의 액션 상태 가져오기
    const fetchMemberActionStatus = async () => {
        try {
            const actionResponse = await $fetch(`${config.public.apiBase}actions/member`, {
                headers: {
                    Authorization: `Bearer ${userDetails.token.value}`,
                },
            });
            // console.log("actionResponse ", actionResponse);

            // 아이콘 상태 초기화
            iconItem.value.bookmark = [];

            // console.log('actionResponse.memberActionDtos', actionResponse.memberActionDtos);

            if (actionResponse && actionResponse.memberActionDtos) {
                // 각 actionDto를 순회하며 isAdded=true인 경우 해당 액션 배열에 websiteId 추가
                actionResponse.memberActionDtos.forEach((actionDto) => {
                    const { action, websiteId, isAdded } = actionDto;
                    if (isAdded) {
                        if (!iconItem.value[action]) {
                            iconItem.value[action] = [];
                        }
                        // websiteId가 숫자 타입인지 확인 후 push
                        iconItem.value[action].push(Number(websiteId));
                    }
                });

                // console.log('업데이트된 액션 목록:', iconItem.value);
            }
        } catch (error) {
            console.error('북마크 목록 가져오기 중 오류:', error);
        }
    };

    // 웹사이트의 액션 상태 가져오기
    const fetchWebsiteActionStatus = async (websiteId) => {
        try {
            // console.log('websiteId', websiteId);
            if (Array.isArray(websiteId)) {
                const websiteListActionResponse = await $fetch(`${config.public.apiBase}actions/website`, {
                    headers: {
                        Authorization: `Bearer ${userDetails.token.value}`,
                    },
                    params: {
                        websiteIds: websiteId
                    }
                });

                // console.log("websiteListActionResponse: ", websiteListActionResponse);
                if (websiteListActionResponse && websiteListActionResponse.websiteActionDtos) {

                    const actionDtoArray = websiteListActionResponse.websiteActionDtos;

                    // console.log('목록 페이지: ', websiteListActionResponse.websiteActionDtos);
                    

                    websiteId.forEach(id => {
                        // 하나의 웹사이트 객체 안에 추천, 비추천, 북마크 정보가 각각 배열임
                        const websiteActions = actionDtoArray.filter(dto => dto.websiteId === id);

                        // console.log('websiteActions', websiteActions);
                        
                        const likeDto = websiteActions.find(dto => dto.action === 'like');
                        const dislikeDto = websiteActions.find(dto => dto.action === 'dislike');
                        const bookmarkDto = websiteActions.find(dto => dto.action === 'bookmark');

                        // console.log('likeDto: ', likeDto);
                        // console.log('dislikeDto: ', dislikeDto);
                        // console.log('bookmarkDto: ', bookmarkDto);

                        // 좋아요/싫어요 수 업데이트
                        likeCount.value = likeDto ? likeDto.likeCount : 0;
                        dislikeCount.value = dislikeDto ? dislikeDto.dislikeCount : 0;
                        bookmarkCount.value = bookmarkDto ? bookmarkDto.bookmarkCount : 0;

                        // console.log('========actionDtoArray: ', actionDtoArray[id].websiteId);
                        
                        // console.log('likeCount.value: ', likeCount.value);
                        // console.log('dislikeCount.value: ', dislikeCount.value);
                        // console.log('bookmarkCount.value: ', bookmarkCount.value);
                        
                        const total = likeCount.value + dislikeCount.value;
                        rate.value = total > 0 ? Math.round((likeCount.value / total) * 100) : 0;
                        // console.log('rate', rate.value);
                        
                        websiteActionsMap[id] = {
                            id: id,
                            like: likeCount.value,
                            dislike: dislikeCount.value,
                            bookmark: bookmarkCount.value,
                            rate: rate.value
                        };
                    });

                    // console.log('조회 페이지: ', websiteActionsMap);
                    // console.log('조회 페이지: ', websiteActionsMap[1]);
                
                }
            } else { // 상세 페이지
                // console.log('websiteId', websiteId);
                const websiteActionResponse = await $fetch(`${config.public.apiBase}actions/website/${websiteId}`, {
                    headers: {
                        Authorization: `Bearer ${userDetails.token.value}`,
                    },
                });
                
                // console.log('상세페이지 ', websiteActionResponse);
                if (websiteActionResponse) {
                    // 추천, 비추천 업데이트
                    likeCount.value = websiteActionResponse.likeCount
                    dislikeCount.value = websiteActionResponse.dislikeCount;
                    bookmarkCount.value = websiteActionResponse.bookmarkCount;

                    // console.log('likeCount.value: ', likeCount.value);
                    // console.log('dislikeCount.value: ', dislikeCount.value);
                    // console.log('bookmarkCount.value: ', bookmarkCount.value);
                    
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
        websiteActionsMap,
        fetchMemberActionStatus,
        fetchWebsiteActionStatus,
    };
}