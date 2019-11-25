<template>
    <Row id="login" type="flex" justify="center" align="middle">
        <Col :xs="20" :md="14" :lg="11" :xl="7">
            <img src="../../assets/maps-and-flags.svg" height="120px">
            <h3>Let's get you started</h3>
            <h2>Sign Up</h2>
            <div>
                <Input @on-enter="signUp"  placeholder="email" v-model="email" type="email"/>
            </div>
            <div>
                <Input @on-enter="signUp" placeholder="password" v-model="password" :type="showPassword ? 'text' : 'password'">
                    <Icon @click="showPassword = !showPassword" slot="suffix" v-if="!showPassword" type="md-eye-off"></Icon>
                    <Icon @click="showPassword = !showPassword" slot="suffix" v-else type="md-eye"></Icon>
                </Input>
            </div>
            <div>
                <Input @on-enter="signUp" placeholder="confirm password" v-model="re_password" :type="showPassword ? 'text' : 'password'"/>
            </div>
            <div>
                <Button type="success" :loading="loading" @click="signUp" long shape="circle">Create Account</Button>
            </div>
            <Divider>Or</Divider>
            <div >
                <Button @click="$router.push({name: 'login'})" type="info" long shape="circle">Login</Button>
            </div>
        </Col>
    </Row>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return {
                user: {},
                email: '',
                password: '',
                re_password: '',
                loading: false,
                showPassword: false
            }
        },
        methods:{
            signUp(){
                if(this.re_password !== this.password)
                    this.$Message.warning({content: 'Password mismatch', duration: 5})
                else{
                    this.loading = true
                    this.$firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                        .then(_=>{
                            this.$Notice.success({
                                title: 'Account created successfully',
                                desc: 'Please sign in with the credentials used in the sign up form',
                                duration: 5
                            })
                            this.$router.push({name: 'login'})
                        }).catch(error=>{
                            this.$Message.error({content: error.message, duration: 5})
                        }).finally(_=>{
                            this.loading = false
                    })


                }
            }
        }
    }
</script>

<style scoped>
    div{
        margin: 7px 0;
    }
    #login{
        height: 100vh;
        padding-bottom: 32px;
        background: url('../../assets/bg2.svg');
        background-size: cover;
        background-position: center;
    }
</style>