<script setup lang="ts">
import {useRouter} from 'vue-router';
import {onMounted, ref} from 'vue';
import {Toast} from 'vant';
import {getCurrentUser} from '../services/user.ts';
import dayjs from 'dayjs';
import {userGender} from '../constants/user.ts';

const user = ref();

onMounted(async () => {
  const res = await getCurrentUser();
  if (res) {
    user.value = res;
  } else {
    Toast.fail('获取用户信息失败');
  }
});

const router = useRouter();
const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue
    }
  });
};

</script>

<template>
  <template v-if="user">
    <van-cell title="昵称" is-link to="/user/edit" :value="user.username"
              @click="toEdit('username', '昵称', user.username)"/>
    <van-cell title="账号" :value="user.userAccount"/>
    <van-cell title="头像" to="/user/edit">
      <img :src="user.avatarUrl" width="20"/>
    </van-cell>
    <van-cell title="性别" is-link to="/user/edit" arrow-direction="down" :value="userGender[user.gender]"
              @click="toEdit('gender', '性别', user.gender)"/>
    <van-cell title="电话" is-link to="/user/edit" arrow-direction="down" :value="user.phone"
              @click="toEdit('phone', '电话', user.phone)"/>
    <van-cell title="邮箱" is-link to="/user/edit" arrow-direction="down" :value="user.email"
              @click="toEdit('email', '邮箱', user.email)"/>
    <van-cell title="星球编号" :value="user.planetCode"/>
    <van-cell title="注册时间" :value="dayjs(user.createTime).format('YYYY-MM-DD HH:mm:ss')"/>
  </template>
</template>

<style scoped>

</style>