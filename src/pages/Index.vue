<script setup lang="ts">
import {useRouter} from 'vue-router';
import {ref, watchEffect} from 'vue';
import myAxios from '../plugins/myAxios.ts';
import {Toast} from 'vant';
import UserCardList from '../components/UserCardList.vue';

const router = useRouter();
const userList = ref([]);
const isMatchMode = ref<boolean>(false);
const loading = ref(true);

const loadData = async () => {
  let userListData;
  loading.value = true;
  // 心动模式
  if (isMatchMode.value) {
    const num = 10;
    userListData = await myAxios.get('/user/match', {
      params: {
        num
      },
    })
        .then(function (response) {
          console.log('/user/match succeed', response);
          return response?.data;
        })
        .catch(function (error) {
          console.log('/user/match error', error);
          Toast.fail('请求失败');
        });
  } else {
    // 普通模式
    userListData = await myAxios.get('/user/recommend', {
      params: {
        pageSize: 8,
        pageNum: 1,
      },
    })
        .then(function (response) {
          console.log('/user/recommend succeed', response);
          return response?.data?.records;
        })
        .catch(function (error) {
          console.log('/user/recommend error', error);
          Toast.fail('请求失败');
        });
  }
  if (userListData) {
    userListData.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    });
    userList.value = userListData;
  }
  loading.value = false;
};

watchEffect(() => {
  loadData();
});

</script>

<template>
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode"/>
    </template>
  </van-cell>
  <UserCardList :user-list="userList" :loading="loading"/>
  <van-empty v-if="userList?.length < 1" description="数据为空"></van-empty>
</template>

<style scoped>

</style>