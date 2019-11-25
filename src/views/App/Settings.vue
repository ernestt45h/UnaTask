<template>
    <Row type="flex" justify="center" id="settings">
        <Divider><h1>Settings</h1></Divider>
        <Col :xs="20" :md="14" :lg="11" :xl="7">
            <Form>
                <FormItem>
                    <Button shape="circle" icon="md-person" long :to="{name: 'updateUserDetails'}">Profile</Button>
                </FormItem>
                <Divider/>
                <FormItem>
                    <Row type="flex" justify="space-between">
                        <h3>Notifications</h3>
                        <i-switch @on-change="updateNotification" v-model="notification" />
                    </Row>
                </FormItem>
                <Divider/>
                <FormItem>
                    <Button shape="circle" icon="md-help" long :to="{name: 'feedback'}">Feedback</Button>
                </FormItem>
                <FormItem>
                    <Button @click="lockout" icon="md-lock"  shape="circle" long type="info">Lock out</Button>
                </FormItem>
                <FormItem>
                    <Button @click="signout" icon="md-log-out"  shape="circle" long type="warning">Sign out</Button>
                </FormItem>
            </Form>
        </Col>
    </Row>
</template>

<script>
    export default {
        name: "Settings",
        data(){
            return {
                notification: false,
            }
        },
        methods: {
            updateNotification(bool){
                let user = this.$firebase.auth().currentUser
                this.$firebase.firestore().collection('users')
                    .doc(user.uid)
                    .update({
                        notification: bool
                    })
            },
            signout(){
                this.$firebase.auth().signOut()
            },
            lockout(){
                this.$router.push({name : 'login'})
            }
        }
    }
</script>

<style scoped>
    #settings{
        padding-bottom: 72px;
    }
</style>