// 最简代码，也就是这些字段必须有
export default {
  path: "/relationship_graph",
  meta: {
    title: "关联关系图谱"
  },
  children: [
    {
      path: "/relationship_graph/index",
      name: "relationship_graph",
      component: () => import("@/views/relationship_graph/index.vue"),
      meta: {
        title: "关联关系图谱"
      }
    }
  ]
};
