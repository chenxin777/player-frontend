<script setup lang="ts">

import {useRouter} from 'vue-router';
import TeamCardList from '../components/TeamCardList.vue';
import {onMounted, ref} from 'vue';
import myAxios from '../plugins/myAxios.ts';
import {Toast} from 'vant';

const router = useRouter();
const teamList = ref([]);
const searchText = ref('');
const myJoinTeam = ref([]);
const loading = ref(true);
const active = ref('public');
const currentPage = ref(1);
const currentUser = ref();
// 跳转到加入队伍页
const doCreateTeam = () => {
  router.push({
    path: '/team/add'
  });
};

/**
 * 队伍查询
 * @param val
 * @param status
 */
const listTeam = async (val: string, status: number) => {
  const res = await myAxios.get('/team/list', {
    params: {
      status: status,
      searchText: val,
      pageNum: 1,
      queryType: 0,
    }
  });
  if (res?.code === 0) {
    teamList.value = res.data;
  } else {
    Toast.fail('队伍加载失败,请刷新重试');
  }
};

/**
 * 查询用户已加入的队伍
 * @param val
 */
const listMyJoinTeam = async (val = '') => {
  const res = await myAxios.get('/team/list/my/join', {
    params: {
      searchText: val,
      pageNum: 1,
    }
  });
  if (res?.code === 0) {
    myJoinTeam.value = res.data;
  } else {
    Toast.fail('队伍加载失败,请刷新重试');
  }
};

/**
 * 搜索框搜索
 * @param val
 */
const onSearch = async (val) => {
  await listTeam(val, 3);
};

/**
 * 标签也切换触发查询
 * @param name
 */
const onTabChange = (name) => {
  // 查公开
  if (name === 'public') {
    listTeam(searchText.value, 0);
  } else {
    // 查加密
    listTeam(searchText.value, 2);
  }
};

const handleDataFromChild = (payload) => {
  currentUser.value = payload.message;
  console.log(currentUser.value);
};

/**
 * 页面初始加载
 */
onMounted(async () => {
  loading.value = true;
  await listTeam('', 0);
  loading.value = false;
});

</script>

<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch"/>
    <van-tabs v-model:active="active" @change="onTabChange">
      <van-tab title="公开" name="public"></van-tab>
      <van-tab title="加密" name="private"></van-tab>
    </van-tabs>
    <div style="margin-bottom: 16px">
      <van-button class="add-button" type="primary" icon="plus" @click="doCreateTeam"></van-button>
      <team-card-list :team-list="teamList" :loading="loading"/>
      <van-empty v-if="teamList?.length < 1" description="数据为空"></van-empty>
    </div>
  </div>
</template>

<style scoped>
#teamPage {

}
</style>