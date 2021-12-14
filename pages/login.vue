<template>
    <div class="login-container">
        <el-form class="login-form" label-width="100px" :model="form" :rules="rules" ref="loginForm">
            <el-form-item prop="email" label="邮箱">
                <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item prop="emailcode" label="验证码" class="captcha-container">
                <el-button @click="sendEmailCode" type="primary" :diabled="send.timer > 0">{{ sendText }}</el-button>
                <el-input v-model="form.emailcode" placeholder="请输入验证码" />
            </el-form-item>
            <el-form-item prop="passwd" label="密码">
                <el-input type="password" v-model="form.passwd" placeholder="请输入密码" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="captcha" label="验证码" class="captcha-container">
                <img @click="updateCaptcha" :src="captchaUrl" alt="验证码">
                <el-input v-model="form.captcha" placeholder="请输入验证码" />
            </el-form-item>

            <el-form-item>
                 <el-button type="primary" @click.native.prevent="handleLogin"> 登录 </el-button>
             </el-form-item>
        </el-form>
    </div>
</template>

<script>
import md5 from 'md5';
export default {
    layout: "login",
    data() {
        return {
            form: {
                email: '798795326@qq.com',
                passwd: '123456',
                captcha: '',
                emailcode: ''
            },
            rules: {
                email: [
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '邮箱格式不正确' }
                ],
                emailcode: [
                    { required: true, message: '请输入验证码' }
                ],
                captcha: [
                    { required: true, message: '请输入验证码' }
                ],
                passwd: [
                    { required: true, pattern: /^[\w_-]{6,12}$/g, message: '请输入6-12位密码' }
                ],
            },
            captchaUrl: '/api/captcha',
            send: {
                timer: 0
            }
        }
    },
    computed: {
        sendText() {
            if (this.send.timer <= 0) {
                return '发送'
            }
            return `${this.send.timer}s后发送`
        }
    },
    methods: {
        async sendEmailCode() {
            await this.$http.get('/sendcode?email='+this.form.email)
            this.send.timer = 10
            this.timer = setInterval(() => {
                this.send.timer -=1
                if (this.send.timer <= 0) {
                    clearInterval(this.timer)
                }
            }, 1000);
        },
        updateCaptcha() {
            this.captchaUrl = '/api/captcha?_t=' + new Date().getTime()
        },
        handleLogin() {
            this.$refs.loginForm.validate(async (valid) => {
                if (valid) {
                    let obj = {
                        email: this.form.email,
                        emailcode: this.form.emailcode,
                        passwd: md5(this.form.passwd),
                        captcha: this.form.captcha,
                    }
                    let ret = await this.$http.post('/user/login', obj);
                    // code == 0 成功
                    if (ret.code == 0) {
                        // 返回token,
                        this.$message.success('登录成功！！！');
                        localStorage.setItem('token', ret.data.token)
                        setTimeout(() => {
                            this.$router.push('/');
                        },500)
                        
                    } else {
                        this.$message.error(ret.message);
                    }
                } else {
                    console.log('验证失败')
                    return false
                }
            })
        }
    },
};
</script>

<style>

</style>