<script setup>
import { useRouter } from 'vue-router'
import { posts } from '@temp/data'

const router = useRouter()
const postList = posts.filter((post) => {
  return /^\/posts[\S]*\.html$/.test(post.path)
}).sort((a, b) => +new Date(b.date) - +new Date(a.date))

const clickHandler = (post) => {
  router.push(post.path)
}
</script>


<template>
  <div class="list">
    <h1 class="header">{{postList.length}}  Posts</h1>
    <div v-for="post in postList" :key="post.name" class="list-item" @click="clickHandler(post)">
      <h4 class="title">{{post.title}}</h4>
      <p class="date">{{post.date}}</p>
    </div>
  </div>
</template>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.header {
  font-weight: 200;
  padding-bottom:10px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--c-border);
}

.list {
  padding: 30px 0;
}

.list-item {
  padding-top: 1.5rem;
  padding-bottom:1.5rem;
  
}

.list-item:last-child {
  border-bottom: none;
}

.list-item .title {
  color: var(--c-brand);
  opacity: .8;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.list-item:hover .title {
  opacity: 1
}

.list-item:hover {
  border-bottom: 1px solid var(--c-border);
}

.list-item .date{
  color: var(--c-text-lighter);
  transform: scale(.8);
  transform-origin: 0 0;
}


</style>