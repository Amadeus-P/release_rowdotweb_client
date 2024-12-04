export default function useWebsiteActionFetch(websiteId) {
    const likeCount = ref(0);
    const dislikeCount = ref(0);
    const userDetails = useUserDetails();

    const fetchWebsiteActionStatus = async () => {
        try {
            const config = useRuntimeConfig();

            const updatedActionResponse = await $fetch(`${config.public.apiBase}actions/website/${websiteId}`, {
                headers: {
                    Authorization: `Bearer ${userDetails.token.value}`,
                },
            });

            if (updatedActionResponse && updatedActionResponse.actionDtos) {
                console.log('updatedActionResponse.actionDtos', updatedActionResponse.actionDtos);

                const actionDto = updatedActionResponse.actionDtos;
                const likeDto = actionDto.find(dto => dto.action === 'like');
                const dislikeDto = actionDto.find(dto => dto.action === 'dislike');

                // 좋아요/싫어요 수 업데이트
                likeCount.value = likeDto ? likeDto.likeCount : 0;
                dislikeCount.value = dislikeDto ? dislikeDto.dislikeCount : 0;
            }
        } catch (error) {
            console.error('데이터 가져오기 실패:', error);
        }
    };

    return {
        likeCount,
        dislikeCount,
        fetchWebsiteActionStatus,
    };
}