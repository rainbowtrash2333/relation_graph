<script setup lang="ts">
import { ref } from "vue";
import Graph from "@/components/Graph.vue";
import CompanySearch from "@/components/CompanySearch.vue";
defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
  name: "relationship_graph"
});
const companyName = ref("镇雄县镇果公路建设开发投资有限公司");

const handleChildEvent = data => {
  companyName.value = data;
  console.log(data);
};

const node = ref({
  name: "",
  bank: "",
  loan_balance: ""
});

function getname(name: string) {
  const url = `http://127.0.0.1:5000/getnodebyname?name=${name}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      node.value = data;
    });
}

const isDragging = ref(false);
const initialX = ref(0);
const initialY = ref(0);
const offsetX = ref(0);
let offsetX_old = 0;
let offsetY_old = 0;
const offsetY = ref(0);
const draggableDiv = ref();
const startDragging = event => {
  isDragging.value = true;
  initialX.value = event.clientX;
  initialY.value = event.clientY;

  // 添加mousemove和mouseup事件监听器
  window.addEventListener("mousemove", drag);
  window.addEventListener("mouseup", stopDragging);
};

const drag = event => {
  if (isDragging.value) {
    offsetX.value = event.clientX - initialX.value + offsetX_old;
    offsetY.value = event.clientY - initialY.value + offsetY_old;
    // 更新div的位置
    draggableDiv.value.style.transform = `translate(${offsetX.value}px, ${offsetY.value}px)`;
  }
};

const stopDragging = () => {
  if (isDragging.value) {
    isDragging.value = false;
    // 移除mousemove和mouseup事件监听器
    offsetX_old = offsetX.value;
    offsetY_old = offsetY.value;

    window.removeEventListener("mousemove", drag);
    window.removeEventListener("mouseup", stopDragging);
  }
};
</script>

<template>
  <div class="container">
    <div class="fixed-div">
      <!-- 这里放你的内容 -->
      <h1>公司搜索</h1>
      <CompanySearch @child-event="handleChildEvent" />
    </div>
    <article>
      <Graph :name="companyName" @on-click="getname" />
    </article>
    <div class="draggable" @mousedown="startDragging" ref="draggableDiv">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{ node.name }}</span>
          </div>
        </template>
        <div>贷款银行：{{ node.bank }}</div>
        <div>贷款余额：{{ node.loan_balance }}万元</div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
}

.fixed-div {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 0 5px rgb(0 0 0 / 20%);
}

.draggable {
  position: absolute;
  right: 10px; /* 初始位置在右侧 */
  bottom: 10px; /* 初始位置在底部 */
  z-index: 999;
  width: 300px;
  height: 150px;
  cursor: move;
}
</style>
