export default () => {
    const id = useState('id', ()=>null);
    const username = useState('username', ()=>null);
    const profileName = useState('profileName', ()=>null);
    const profileImage = useState('profileImage', ()=>null);
    const regDate = useState('regDate', ()=>null);
    const roles = useState('roles', ()=>[]);
    const token = useState('token', ()=>null);

    const isGhost = ()=> {
        return username.value === null;
    };

    const signin = (loginInfo) => {
        id.value = loginInfo.id;
        username.value = loginInfo.username;
        profileName.value = loginInfo.profileName;
        profileImage.value = loginInfo.profileImage;
        regDate.value = loginInfo.regDate;
        roles.value = loginInfo.roles;
        token.value = loginInfo.token;

        if(!import.meta.env.SSR){
            localStorage.setItem('id', loginInfo.id);
            localStorage.setItem('username', loginInfo.username);
            localStorage.setItem('profileName', loginInfo.profileName);
            localStorage.setItem('profileImage', loginInfo.profileImage);
            localStorage.setItem('regDate', loginInfo.regDate);
            localStorage.setItem('roles', JSON.stringify(loginInfo.roles)); //[]->"[]"
            localStorage.setItem('token', loginInfo.token);
        }
    };

    const signout = () => {
        id.value = null;
        username.value = null;
        profileName.value = null;
        profileImage.value = null;
        regDate.value = null;
        roles.value = [];
        token.value = null;

        if (!import.meta.env.SSR) {
            // localStorage 초기화
            localStorage.removeItem('id');
            localStorage.removeItem('username');
            localStorage.removeItem('profileName');
            localStorage.removeItem('profileImage');
            localStorage.removeItem('regDate');
            localStorage.removeItem('roles');
            localStorage.removeItem('token');
        }
        // 강제 새로고침(캐시데이터 삭제)
        navigateTo('/').then(() => {
            if (!import.meta.env.SSR) {
                window.location.reload();
            }
        });
    }
        const loadUserFromStorage = () => {
            if(!import.meta.env.SSR) {
                if(!localStorage.getItem('username')) return;
                id.value = localStorage.getItem('id');
                username.value = localStorage.getItem('username');
                profileName.value = localStorage.getItem('profileName');
                profileImage.value = localStorage.getItem('profileImage');
                regDate.value = localStorage.getItem('regDate');
                roles.value = JSON.parse(localStorage.getItem('roles')); // 배열로 변환
                token.value = localStorage.getItem('token');
            }
        }
    

    // includes 배열이 가지고 있는 함수, 인자를 포함하는지
    const hasRole = (role) =>  roles.value.includes(role);

    return {id, username, profileName, profileImage,regDate, roles,token, isGhost, signin, signout, hasRole, loadUserFromStorage };


}