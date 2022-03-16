<script setup lang="ts">
interface Project {
  id: string
  title: string
  description: string
  url: string
}
const projects: Project[] = [
  {
    id: 'pinia-persists',
    title: 'Pinia Persists',
    description: 'A pinia plugin for state persist.',
    url: 'https://github.com/ouduidui/pinia-persists',
  },
  {
    id: 'ou',
    title: 'ou',
    description: 'A cli for creating an app template of initialized.',
    url: 'https://github.com/ouduidui/ou',
  },
  {
    id: 'ga-tracker',
    title: 'GA Tracker',
    description: 'Google Analytics SDK for UniApp and weixin-miniProgram',
    url: 'https://github.com/ouduidui/ga-tracker',
  },
  {
    id: 'uniapp-waterfalls-flow',
    title: 'Uniapp Waterfalls Flow',
    description: '适用于uniapp的瀑布流插件',
    url: 'https://github.com/ouduidui/uniapp-waterfalls-flow',
  },
]

const clickHandler = (post) => {
  window.open(post.url)
}
</script>

<template>
  <div class="list">
    <h1 class="header">{{ projects.length }} Projects</h1>
    <div
      v-for="project in projects"
      :key="project.id"
      class="list-item"
      @click="clickHandler(project)"
    >
      <h4 class="title">{{ project.title }}</h4>
      <p class="date">{{ project.description }}</p>
    </div>
  </div>
</template>

<style scope>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.header {
  font-weight: 200;
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--c-border);
}

.list {
  padding: 30px 0;
}

.list-item {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item .title {
  color: var(--c-brand);
  opacity: 0.8;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.list-item:hover .title {
  opacity: 1;
}

.list-item:hover {
  border-bottom: 1px solid var(--c-border);
}

.list-item .date {
  color: var(--c-text-lighter);
  transform: scale(0.8);
  transform-origin: 0 0;
}
</style>
