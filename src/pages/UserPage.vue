<script setup lang="ts">
import {useRouter} from 'vue-router';
import {onMounted, ref} from 'vue';
import {getCurrentUser} from '../services/user.ts';

const router = useRouter();
const user = ref();

onMounted(async () => {
  const res = await getCurrentUser();
  if (res) {
    user.value = res;
  }
});


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
    <van-cell title="当前用户" :value="user?.username"/>
    <van-cell title="修改信息" is-link to="/user/update"/>
    <van-cell title="我创建的队伍" is-link to="/user/team/create"/>
    <van-cell title="我加入的队伍" is-link to="/user/team/join"/>
  </template>
</template>

<style scoped>

</style>