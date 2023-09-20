<script setup lang="ts">
import { reactive, ref, toRefs, watch } from "vue";
import * as vNG from "v-network-graph";
import {
  ForceLayout
  // ForceNodeDatum,
  // ForceEdgeDatum,
} from "v-network-graph/lib/force-layout";

const mynodes = ref<vNG.Nodes>();
const myedges = ref<vNG.Edges>();
const props = withDefaults(
  defineProps<{
    name: string;
  }>(),
  {
    // arr: () => [6, 6, 6]
  }
);
const { name } = toRefs(props);
// const edges = ref(null);
fetch("http://127.0.0.1:5000/getghbyname?name=" + name.value)
  .then(response => response.json())
  .then(data => {
    mynodes.value = data.nodes;
    myedges.value = data.edges;
    // console.log(myedges.value);
  });

const configs = reactive(
  vNG.defineConfigs({
    view: {
      layoutHandler: new ForceLayout({
        positionFixedByDrag: false,
        positionFixedByClickWithAltKey: true
        // * The following are the default parameters for the simulation.
        // * You can customize it by uncommenting below.
        // createSimulation: (d3, nodes, edges) => {
        //   const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
        //   return d3
        //     .forceSimulation(nodes)
        //     .force("edge", forceLink.distance(100))
        //     .force("charge", d3.forceManyBody())
        //     .force("collide", d3.forceCollide(50).strength(0.2))
        //     .force("center", d3.forceCenter().strength(0.05))
        //     .alphaMin(0.001)
        // }
      })
    },
    node: {
      label: {
        visible: true,
        fontFamily: undefined,
        fontSize: 11,
        lineHeight: 1.1,
        color: "#000000",
        margin: 4,
        text: "name",
        directionAutoAdjustment: true
      },
      normal: {
        color: "#4466cc88"
      }
    },
    edge: {
      selectable: true,
      normal: {
        width: 3,
        // color: "#4466cc",
        color: (edge: vNG.Edge) => edge.data.color,
        dasharray: "0",
        linecap: "butt",
        animate: false,
        animationSpeed: 50
      },
      hover: {
        width: 4,
        color: "#3355bb",
        dasharray: "0",
        linecap: "butt",
        animate: false,
        animationSpeed: 50
      },
      selected: {
        width: 3,
        color: "#dd8800",
        dasharray: "6",
        linecap: "round",
        animate: false,
        animationSpeed: 50
      },
      gap: 5,
      type: "straight",
      margin: 2,
      marker: {
        source: {
          type: "none",
          width: 4,
          height: 4,
          margin: -1,
          units: "strokeWidth",
          color: null
        },
        target: {
          type: "arrow",
          width: 4,
          height: 4,
          margin: -1,
          units: "strokeWidth",
          color: null
        }
      }
    }
  })
);

const callback = (newVal: any, oldVal: any) => {
  console.log(newVal, oldVal);
  fetch("http://127.0.0.1:5000/getghbyname?name=" + name.value)
    .then(response => response.json())
    .then(data => {
      mynodes.value = data.nodes;
      myedges.value = data.edges;
      // console.log(myedges.value);
    });
};

watch([name], callback, {
  deep: true, // 深度监听，ref默认false,reactive默认true
  immediate: true, // 先执行一次callback，默认false
  flush: "pre" //pre组件更新之前调用 sync 同步执行，post 更新后执行
});

//传给父组件
// const msg = defineEmits(['on-click'])
const msg = defineEmits<{
  (e: "on-click", name: string): void;
  (e: "on-click", name: string, msg: string): void;
}>();

const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node }) => {
    // console.log(node);
    msg("on-click", node);
  }
};
</script>
<template>
  <el-row>
    <el-col :span="24">
      <v-network-graph
        :nodes="mynodes"
        :edges="myedges"
        :configs="configs"
        :event-handlers="eventHandlers"
        :zoom-level="2"
      >
        <template #edge-label="{ edgeId, edge, scale, ...slotProps }">
          <v-edge-label
            :text="edge.data.describe"
            align="center"
            vertical-align="below"
            fill="#ff5500"
            v-bind="slotProps"
          />
        </template>
      </v-network-graph>
    </el-col>
  </el-row>
</template>

<style scoped>
.v-network-graph {
  width: 900px;
  height: 650px;
}
</style>
