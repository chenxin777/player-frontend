import {UserType} from './user.ts';

/**
 * 队伍类型
 */
export type TeamType = {
	id: number;
	description: string;
	expireTime: Date;
	maxNum: number;
	name: string;
	status: number;
	password: string;
	createTime: Date;
	updateTime: Date;
	createUser: UserType;
	hasJoin: Boolean;
	hasJoinNum: number;
};