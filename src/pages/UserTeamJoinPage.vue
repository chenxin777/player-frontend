<script setup lang="ts">

import {useRouter} from 'vue-router';
import TeamCardList from '../components/TeamCardList.vue';
import {onMounted, ref} from 'vue';
import myAxios from '../plugins/myAxios.ts';
import {Toast} from 'vant';

const router = useRouter();
const teamList = ref([]);
const searchText = ref('');
const loading = ref(true);

// 跳转到加入队伍页
const doJoinTeam = () => {
  router.push({
    path: '/team/add'
  });
};

/**
 * 队伍查询
 * @param val
 */
const listTeam = async (val = '') => {
  const res = await myAxios.get('/team/list', {
    params: {
      searchText: val,
      pageNum: 1,
    }
  });
  if (res?.code === 0) {
    teamList.value = res.data;
  } else {
    Toast.fail('队伍加载失败,请刷新重试');
  }
};

const onSearch = async (val) => {
  await listTeam(val);
};

onMounted(async () => {
  loading.value = true;
  const res = await myAxios.get('/team/list/my/join', {
    params: {
      queryType: 1
    }
  });
  if (res?.code === 0) {
    teamList.value = res.data;
  } else {
    Toast.fail('队伍加载失败,请刷新重试');
  }
  loading.value = false;
});

</script>

<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch"/>
    <team-card-list :team-list="teamList" :loading="loading"/>
    <van-empty v-if="teamList?.length < 1" description="数据为空"></van-empty>
  </div>


</template>

<style scoped>
#teamPage {

}
</style>