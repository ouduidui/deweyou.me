import{o as a,c as i,b as c}from"./app.39fe5b0d.js";import{_ as r}from"./plugin-vue_export-helper.21dcd24c.js";const s={name:"Comment",mounted(){let t=document.querySelector(".gitalk-container"),e=document.createElement("script");e.src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js",t.appendChild(e),e.onload=()=>{const n={clientID:"1daa9f4e8f56a41ad290",clientSecret:"4911e29768e3e738681806015a84ef96525b38e1",repo:"blogs",owner:"OUDUIDUI",admin:["OUDUIDUI"],id:location.pathname,distractionFreeMode:!1};new Gitalk(n).render("gitalk-container")}}},d={class:"gitalk-container",style:{"padding-top":"100px"}},l=c("div",{id:"gitalk-container"},null,-1),p=[l];function m(t,e,n,o,_,f){return a(),i("div",d,p)}var k=r(s,[["render",m]]);export{k as default};