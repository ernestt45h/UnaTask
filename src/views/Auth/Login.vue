<template>
    <Row id="login" type="flex" justify="center" align="middle">
        <Col :xs="20" :md="14" :lg="11" :xl="7">
                <img src="../../assets/maps-and-flags.svg" height="120px">
                <h3>Welcome</h3>
                <h2>Login</h2>
                <div v-if="!user.uid">
                    <Input placeholder="email" v-model="email" type="email"/>
                </div>
                <div v-else>
                    <h2>{{user.displayName || user.email }}</h2>
                </div>
                <div>
                    <Input
                            @on-enter.prevent="login"
                            placeholder="password"
                            v-model="password"
                            :type="!showPassword ? 'password' : 'text'"
                    >
                        <Icon @click="showPassword = !showPassword" slot="suffix" v-if="!showPassword" type="md-eye-off"></Icon>
                        <Icon @click="showPassword = !showPassword" slot="suffix" v-else type="md-eye"></Icon>
                    </Input>
                </div>
                <div>
                    <Button type="info" :loading="loading" @click="login" long shape="circle">Login</Button>
                </div>
                <Divider>Or</Divider>
                <div v-if="user.uid">
                    <Button type="warning" @click="$firebase.auth().signOut()" long shape="circle">Sign out</Button>
                </div>
                <div v-else>
                    <Button @click="$router.push({name: 'signUp'})" type="success" long shape="circle">Create Account</Button>
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
                loading: false,
                showPassword: false
            }
        },
        methods:{
            login(){
                this.loading = true
                this.$firebase.auth().setPersistence(this.$firebase.auth.Auth.Persistence.LOCAL)
                    .then(()=>{
                        let email = this.email || this.user.email
                        console.log(email, this.password)
                        return this.$firebase.auth().signInWithEmailAndPassword(email , this.password)
                            .then(res=>{
                                this.$Message.success({content: `Welcome back ${res.user.displayName || res.user.email}`})
                                this.$router.push({name: 'home'})
                            })
                    })
                    .catch((error)=>{
                        this.$Message.error({content: error.message, duration: 5})
                    })
                    .finally(_=>{
                        this.loading = false
                    })
            }
        },
        created() {
            this.$firebase.auth().onAuthStateChanged(user=>{
                this.user = user || {}
            })
        }
    }
</script>

<style scoped>
    div{
        margin: 7px 0;
    }

    #login{
        /*text-align: center;*/
        height: 100vh;
        padding-bottom: 32px;
        background: url('../../assets/bg2.svg');
        background-size: cover;
        background-position: center;
    }
</style>