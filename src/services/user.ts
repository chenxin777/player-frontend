import myAxios from '../plugins/myAxios.ts';
import {setCurrentUserState} from '../status/user.ts';

export const getCurrentUser = async () => {
	
	const res = await myAxios.get('/user/current');
	if (res.code === 0) {
		setCurrentUserState(res.data);
		return res.data;
	}
	return null;
	
	// 优先获取缓存 但有问题，缓存没更新
	// const currentUser = getCurrentUserState();
	// if (!currentUser) {
	// 	const res = await myAxios.get('/user/current');
	// 	if (res.code === 0) {
	// 		setCurrentUserState(res.data);
	// 		return res.data;
	// 	}
	// 	return null;
	// }
	// return currentUser;
};
