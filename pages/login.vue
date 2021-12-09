<template>
    <div class="login-container">
        <el-form class="login-form" :model="form" :rules="rules">
            <el-form-item props="user">
                <span>
                    <i class="el-icon-user"></i>
                </span>
                <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item props="password">
                <span>
                    <i class="el-icon-lock"></i>
                </span>
                <el-input type="password" v-model="form.passwd" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item props="captcha">
                <img @click="updateCaptcha" :src="captchaUrl" alt="验证码">
                <el-input v-model="form.code" placeholder="请输入验证码" />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    layout: "login",
    data() {
        return {
            form: {
                username: '',
                passwd: '',
                code: ''
            },
            rules: {},
            captchaUrl: '/api/captcha'
        }
    },
    methods: {
        updateCaptcha() {
            this.captchaUrl = '/api/captcha?_t=' + new Date().getTime()
        }
    },
};
</script>

<style>

</style>