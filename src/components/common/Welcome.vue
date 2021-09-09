<template>
    <div class="welcome">欢迎来到后台管理系统</div>
</template>
<script>
export default {
    created() {
        // 从state动态拼接路由
        this.$router.options.routes[1].children = this.$router.options.routes[1].children.concat(this.$store.getters.menuRouters)
        this.$router.addRoutes(this.$router.options.routes)
    }
}
</script>
<style scoped>
    .welcome {
        font-size: 32px;
        color: #666;
        padding: 20px;
    }
</style>