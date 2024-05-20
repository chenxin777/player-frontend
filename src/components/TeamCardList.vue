<script setup lang="ts">
import dayjs from 'dayjs';
import {TeamType} from '../models/team.ts';
import myAxios from '../plugins/myAxios.ts';
import {Toast} from 'vant';
import {onMounted, ref} from 'vue';
import {getCurrentUser} from '../services/user.ts';
import {useRouter} from 'vue-router';
import {teamStatusEnum} from '../constants/team.ts';

interface TeamCardListProps {
  loading: boolean,
  teamList: TeamType[];
}

const currentUser = ref();
const router = useRouter();
const showPasswordDialog = ref(false);
const password = ref('');
const joinTeamId = ref();

const props = withDefaults(defineProps<TeamCardListProps>(), {
  teamList: [],
  loading: true,
});

/**
 * 加入队伍
 * @param id
 */
const doJoinTeam = async () => {
  if (!joinTeamId.value) {
    return;
  }
  const res = await myAxios.post('/team/join', {
    teamId: joinTeamId.value,
    password: password.value,
  });
  if (res?.code === 0) {
    Toast.success('加入成功');
    doJoinCancel();
  } else {
    Toast.fail('加入失败' + (res.description ? `, ${res.description}` : ``));
    doJoinCancel();
  }
};

/**
 * 更新队伍，跳转到更新队伍页
 * @param id
 */
const doUpdateTeam = (id: number) => {
  router.push({
    path: '/team/update',
    query: {
      id
    }
  });
};

/**
 * 退出队伍
 * @param id
 */
const doQuitTeam = async (id: number) => {
  const res = await myAxios.post('/team/quit', {
    teamId: id
  });
  if (res?.code === 0) {
    Toast.success('退出队伍成功');
  } else {
    Toast.fail('退出队伍失败' + (res.description ? `, ${res.description}` : ``));
  }
};

/**
 * 解散队伍
 * @param id
 */
const doDeleteTeam = async (id: number) => {
  const res = await myAxios.post('/team/delete', {
    id: id
  });
  if (res?.code === 0) {
    Toast.success('解散队伍成功');
  } else {
    Toast.fail('解散队伍失败' + (res.description ? `, ${res.description}` : ``));
  }
};

const preJoinTeam = (team) => {
  joinTeamId.value = team.id;
  if (team.status === 0) {
    doJoinTeam();
  } else {
    showPasswordDialog.value = true;
  }
};

const doJoinCancel = () => {
  password.value = '';
  joinTeamId.value = 0;
};
/**
 * 页面加载时触发
 */
onMounted(async () => {
  currentUser.value = await getCurrentUser();
});
</script>

<template>
  <div id="teamCardList">
    <van-skeleton title avatar :row="3" :loading="props.loading" v-for="team in props.teamList">
      <van-card
          :desc="team.description"
          :title="`${team.name}`"
          thumb="https://trademark.zbjimg.com/pattern-prod/2017/image_61/27681655.jpg"
      >
        <template #tags>
          <van-tag color="#7232dd" style="margin-right: 8px; margin-top: 8px">
            {{ teamStatusEnum[team.status] }}
          </van-tag>
        </template>
        <template #bottom>
          <div>
            {{ `队长: ${team.createUser.username}` }}
          </div>
          <div>
            {{ `队伍人数: ${team.hasJoinNum} / ${team.maxNum}` }}
          </div>
          <div v-if="team.expireTime">
            {{ '过期时间: ' + dayjs(team.expireTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div>
            {{ '创建时间: ' + dayjs(team.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </template>
        <template #footer>
          <!-- 非创建人可见 -->
          <van-button v-if="team.createUser.id !== currentUser?.id && !team.hasJoin" size="small" type="success" plain
                      @click="preJoinTeam(team)">加入队伍
          </van-button>
          <!--  仅创建人可见 -->
          <van-button v-if="team.createUser.id === currentUser?.id" size="small" plain type="primary"
                      @click="doUpdateTeam(team.id)">更新队伍
          </van-button>
          <!--  仅加入队伍可见  -->
          <van-button v-if="team.createUser.id !== currentUser?.id && team.hasJoin" size="small" plain type="warning"
                      @click="doQuitTeam(team.id)">退出队伍
          </van-button>
          <!--  仅创建人可见 -->
          <van-button v-if="team.createUser.id === currentUser?.id" size="small" type="danger" plain
                      @click="doDeleteTeam(team.id)">解散队伍
          </van-button>
        </template>
      </van-card>
    </van-skeleton>
    <van-dialog v-model:show="showPasswordDialog" title="请输入密码" show-cancel-button @confirm="doJoinTeam"
                @cancel="doJoinCancel">
      <van-field
          v-model="password"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
      />
    </van-dialog>
  </div>
</template>

<style scoped>
#teamCardList :deep(.van-image__img) {
  height: 100px;
  object-fit: unset;
}

</style>