<template>
  <div class="home">
    <img
        class="avatar"
        src="https://cdn.ouduidui.cn/avatar/avatar.jpeg?imageView2/2/h/400/format/webp/q/80"
        alt="OUDUIDUI">

    <p class="title">嗨, 我是<a class="link" href="https://ouduidui.cn" target="_blank">欧怼怼</a></p>
    <p>我是一名前端小学生🧑🏽‍💻，请多指教</p>
    <p>平时还喜欢看看书、看电影，或者玩玩<a class="link" href="https://cubing.com/results/person/2014OUSH01" target="_blank">魔方</a>
    </p>
    <p class="other">
      <a href="https://github.com/OUDUIDUI" target="_blank" class="link">Github</a>
      \
      <a href="https://juejin.cn/user/4309700183594366" target="_blank" class="link">掘金</a>
    </p>
  </div>
</template>

<script>
export default {
  name: "Home"
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a {
  color: inherit;
  text-decoration: none;
  font-weight: normal;
}

.home {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home .avatar {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 30px;
  position: relative;
}

.home .avatar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

@media screen and (max-width: 765px) {
  .home .avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 30px;
  }
}

.home p {
  font-size: 20px;
  letter-spacing: 2px;
  margin-left: -2px;
  line-height: 1.5;
  padding-bottom: 20px;
  text-align: center;
}

.home .title {
  font-size: 28px;
  padding-bottom: 30px;
}

.home .link {
  display: inline-block;
  position: relative;
  background: transparent;
  z-index: 1;
  cursor: pointer;
}

.home .link::after {
  content: '';
  position: absolute;
  top: 70%;
  left: -1px;
  right: 1px;
  bottom: 5%;
  transition: top .3s ease-in-out;
  background-color: #185ADB;
  opacity: .5;
  z-index: -1;
}

.home .link:hover::after {
  top: 7%;
}

.home .other {
  padding-top: 20px;
}
</style>
