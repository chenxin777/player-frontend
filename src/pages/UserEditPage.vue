<script setup lang="ts">

import {useRoute, useRouter} from 'vue-router';
import {ref} from 'vue';
import myAxios from '../plugins/myAxios.ts';
import {Toast} from 'vant';
import {getCurrentUser} from '../services/user.ts';

const route = useRoute();
const router = useRouter();

const editUser = ref({
  editKey: route.query.editKey,
  editName: route.query.editName,
  currentValue: route.query.currentValue
});

const onSubmit = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    Toast.fail('用户未登录');
    return;
  }
  console.log(currentUser);

  const res = await myAxios.post('/user/update', {
    'id': currentUser.id,
    [editUser.value.editKey as string]: editUser.value.currentValue,
  });
  console.log(res);
  if (res.code === 0 && res.data > 0) {
    Toast.success('修改成功');
    router.back();
  } else {
    Toast.fail('修改失败');
  }
};
</script>

<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-if="editUser.editKey !== 'gender'"
          v-model="editUser.currentValue"
          :name="editUser.editKey"
          :label="editUser.editName"
          :placeholder="`请输入${editUser.editName}`"
      />
      <van-radio-group v-if="editUser.editKey === 'gender'" v-model="editUser.currentValue" direction="horizontal">
        <van-radio name=0>女</van-radio>
        <van-radio name=1>男</van-radio>
      </van-radio-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-cell-group>
  </van-form>
</template>

<style scoped>

</style>