<template>
  <div>
    <div class="search-box">
      <input
        type="text"
        v-model="searchTerm"
        @input="handleInputChange"
        @focus="showAllSuggestions"
        placeholder="搜索公司"
      />
    </div>
    <ul class="dropdown suggestions" v-if="showSuggestions">
      <li v-for="(company, index) in filteredCompanies" :key="index">
        <button @click="sendNameToParent(company)">{{ company }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchTerm: "",
      companies: ["公司1", "公司2", "公司3" /* 在这里添加更多公司 */],
      showAll: false
    };
  },
  computed: {
    filteredCompanies() {
      return this.companies.filter(
        company =>
          this.showAll ||
          company.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    showSuggestions() {
      return this.searchTerm.length > 0 && this.filteredCompanies.length > 0;
    }
  },
  methods: {
    getallname() {
      const url = this.$api_url + `getallnode`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.companies = data;
          // console.log(this.companies);
        });
    },
    sendNameToParent(name) {
      this.$emit("child-event", name);
    },
    handleInputChange() {
      // 在这里可以执行搜索操作或触发其他逻辑
      this.showAll = false; // 当用户开始输入时，重置showAll状态
    },
    showAllSuggestions() {
      this.showAll = true;
    }
  },
  created() {
    // 在组件创建后立即调用 getallname() 方法
    this.getallname();
  }
};
</script>

<style scoped>
.search-box {
  position: relative;
  width: 300px;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px; /* 限制下拉框高度 */
  overflow-y: auto; /* 添加滚动条 */
  background-color: #fff;
  border: 1px solid #ccc;
}

ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

li {
  padding: 10px;
  cursor: pointer;
}

li:hover {
  background-color: #f0f0f0;
}
</style>
