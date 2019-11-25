<template>
    <div id="app">
        <Row v-if="loading" class="spinContainer" type="flex" justify="center" align="middle">
            <Spin></Spin>
            <h3>Loading...</h3>
        </Row>
        <div v-else>
            <transition
            name="fade"
            mode="out-in"
            >
                <keep-alive :exclude="['SubTask', 'Event']">
                    <router-view style="animation-duration: .15s" id="routes"/>
                </keep-alive>
            </transition>
            <AppNav id="app-nav"/>
        </div>
    </div>
</template>
<script>
    import AppNav from "../../components/AppNav";

    export default {
        components: {AppNav},
        data(){
            return {
                loading : true
            }
        },
        created() {
            this.$firebase.auth().onAuthStateChanged( user=>{
                if(user == null){
                    this.$router.push({name: 'login'})
                }else{
                    this.$firebase.firestore().collection('users').doc(user.uid)
                        .onSnapshot(user=>{
                            if(!user.data()){
                                this.$router.push({name: 'updateUserDetails'})
                            }else{
                                user = user.data()
                                if(user.notification){
                                   Notification.requestPermission()
                                }
                                this.$store.commit('setUser', user)
                            }
                            this.loading = false
                        },error=>{
                            this.$Message.error(error.message)
                        })
                }
            })
        }
    }
</script>
<style>
    #app{
        height: 100vh;
    }

    #app-nav{
        z-index: 1;
        position: fixed;
        bottom: 0;
        width: 100vw;
    }

    #routes{
        height: calc(100vh - 72px);
        padding-bottom: 72px;
    }

    .spinContainer{
        height: 100vh;
    }

    @media screen and (min-width: 720px) {
        #app-nav{
            /*z-index: 9;*/
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            width: 72px;
        }


        #routes{
            position: absolute;
            width: calc(100vw - 72px);
            margin-left: 72px;
        }
    }

    input{
        display: inline-block;
        width: 100%;
        line-height: 1.5;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        color: #515a6e;
        background-color: #fff;
        background-image: none;
        position: relative;
        cursor: text;
        transition: border .2s;
        font-size: 16px;
        padding: 6px 7px;
        height: 40px;
    }

    input:focus, input:active{
        outline: none;
    }
</style>