// 상대적인 시간 포맷 함수
export class FormatRelativeTime {
    formatRelativeTime (date) {
        const now = new Date();
        const diff = now - new Date(date);
      
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
      
        if (years > 0) return `${years} 년 전`;
        if (months > 0) return `${months} 달 전`;
        if (days > 0) return `${days} 일 전`;
        if (hours > 0) return `${hours} 시간 전`;
        if (minutes > 0) return `${minutes} 분 전`;
        return `${seconds} 초 전`;
      }
}