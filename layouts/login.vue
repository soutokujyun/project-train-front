<template>
    <div>
        <!-- <div>导航</div> -->
        <nuxt></nuxt>
        <!-- <div>底部信息</div> -->
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style>
.login-container {
    width: 100%;
    height: 100%;
}
.login-form {
    width: 100%;
    max-width: 520px;
    margin: 160px auto 0;
    overflow: hidden;
}
.captcha-container {
    width: 370px;
}
.captcha-container img {
    position: absolute;
    right: -160px;
    width: 120px;
    height: 40px;
}
.captcha-container .el-button {
    position: absolute;
    right: -120px;
}
</style>