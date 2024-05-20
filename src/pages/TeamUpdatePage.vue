<script setup lang="ts">

import {useRoute, useRouter} from 'vue-router';
import {onMounted, ref} from 'vue';
import myAxios from '../plugins/myAxios.ts';
import {Toast} from 'vant';
import {TeamType} from '../models/team.ts';
import dayjs from 'dayjs';

const router = useRouter();
const route = useRoute();
// 用户填写的表单数据
const addTeamData = ref<TeamType>({});
// 展示日期选择器
const showPicker = ref(false);
// 最小时间
const minDate = new Date();
const teamId = route.query.id;
const date = new Date();

const onSubmit = async () => {
  // todo 前端参数校验
  const res = await myAxios.post('/team/update', addTeamData.value);
  if (res?.code === 0 && res.data) {
    Toast.success('更新成功');
    router.push({
      path: '/team',
      replace: true,
    });
  } else {
    Toast.fail('更新失败');
  }
};

// 查询所选队伍信息
onMounted(async () => {
  if (teamId <= 0) {
    Toast.fail('队伍加载失败');
    return;
  }
  const res = await myAxios.get('/team/get', {
    params: {
      id: teamId
    }
  });
  if (res?.code === 0) {
    addTeamData.value = res.data;
  } else {
    Toast.fail('队伍加载失败,请刷新重试');
  }
});
</script>

<template>
  <div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="addTeamData.name"
            name="name"
            label="队伍名"
            placeholder="请输入队伍名"
            :rules="[{ required: true, message: '请输入队伍名' }]"
        />
        <van-field
            v-model="addTeamData.description"
            rows="4"
            autosize
            label="描述"
            type="textarea"
            placeholder="请输入队伍描述"
        />
        <van-field
            is-link
            readonly
            name="datetimePicker"
            label="过期时间"
            :placeholder="addTeamData.expireTime ? dayjs(addTeamData.expireTime).format('YYYY-MM-DD HH:mm:ss') : '点击选择过期时间'"
            @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-datetime-picker
              v-model="addTeamData.expireTime"
              type="datetime"
              title="请选择过期时间"
              :min-date="minDate"
              @confirm="showPicker = false"
              @cancel="showPicker = false"
              :formatter="formatter"
          />
        </van-popup>
        <van-field name="status" label="队伍状态">
          <template #input>
            <van-radio-group v-model="addTeamData.status" direction="horizontal">
              <van-radio name=0>公开</van-radio>
              <van-radio name=1>私有</van-radio>
              <van-radio name=2>加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
            v-if="Number(addTeamData.status) === 2"
            v-model="addTeamData.password"
            type="password"
            name="密码"
            label="密码"
            placeholder="请输入队伍密码"
            :rules="[{ required: true, message: '请输入队伍密码' }]"
        />
      </van-cell-group>

      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped>

</style>