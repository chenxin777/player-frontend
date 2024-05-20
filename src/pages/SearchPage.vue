<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();
// 初始化搜索框
const searchText = ref('');
// 原始标签
const originTagList = [
  {
    text: '性别',
    children: [
      {text: '男', id: '男'},
      {text: '女', id: '女'},
    ],
  },
  {
    text: '方向',
    children: [
      {text: 'Java', id: 'Java'},
      {text: 'C++', id: 'C++'},
      {text: 'Python', id: 'Python'},
      {text: 'Go', id: 'Go'},
      {text: 'Php', id: 'Php'},
      {text: 'C', id: 'C'},
      {text: '嵌入式', id: '嵌入式'},
    ],
  },
];

/**
 * 搜索过滤
 * @param val
 */
const onSearch = (val) => {
  tagList.value = originTagList.map(parentTag => {
    const tempChildren = [...parentTag.children];
    const tempParentTag = {...parentTag};
    tempParentTag.children = tempChildren.filter(item => item.text.includes(searchText.value));
    return tempParentTag;
  });
};

/**
 * 取消搜索
 */
const onCancel = () => {
  searchText.value = '';
  tagList.value = originTagList;
};

// 已选中的标签
const activeIds = ref([]);
const activeIndex = ref(0);
// 标签列表
const tagList = ref(originTagList);
// 移除标签
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter((item) => {
    return item !== tag;
  });
};

/**
 * 执行搜索后
 */
const doSearchResult = () => {
  router.push({
    path: '/user/list',
    query: {
      tags: activeIds.value
    }
  });
};
</script>

<template>
  <form action="/">
    <van-search
        v-model="searchText"
        show-action
        placeholder="请输入要搜索的标签"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>
  <van-divider content-position="left">已选标签</van-divider>
  <van-row gutter="16" style="padding: 16px;">
    <van-col v-for="tag in activeIds">
      <van-tag closeable size="small" type="primary" @close="doClose(tag)">
        {{ tag }}
      </van-tag>
    </van-col>
  </van-row>
  <van-divider content-position="left">选择标签</van-divider>
  <div v-if="activeIds.length === 0">请选择标签</div>
  <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
  />
  <div style="padding: 12px">
    <van-button type="primary" block @click="doSearchResult">
      搜索
    </van-button>
  </div>

</template>

<style scoped>

</style>