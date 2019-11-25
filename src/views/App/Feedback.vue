<template>
    <Row type="flex" justify="center">
        <Divider><h1>Feedback</h1></Divider>
        <Col :xs="22">
            <Form>
                <FormItem>
                    <Input v-model="title" placeholder="Title of feedback" />
                </FormItem>
                <FormItem>
                    <Input type="textarea"
                           v-model="description"
                           placeholder="A little description of the feedback"
                           maxlength="300" :rows="7" show-word-limit/>
                </FormItem>
                <FormItem>
                    <Button @click="send" :disabled="!title" :loading="loading" long shape="circle" type="info">Send</Button>
                </FormItem>
            </Form>
        </Col>
    </Row>
</template>

<script>
    export default {
        name: "Feedback",
        data(){
            return {
                title: '',
                description: '',
                loading: false,
                device: {}
            }
        },
        methods:{
            send(){
                this.loading = true
                this.$firebase.firestore().collection('feedback')
                    .doc(this.$firebase.auth().currentUser.uid)
                    .collection(this.device.platform).add({
                    title: this.title,
                    description: this.description,
                    dateCreated: new Date(Date.now()),
                    device: this.device
                }).then(res=>{
                    this.$Notice.info({
                        title: 'Feedback sent',
                        desc: 'Thanks for the feedback, your information provided is valuable to us.',
                        duration: 5
                    })
                    this.$router.go(-1)
                }).catch(err=>{
                    this.$Message.error({content: err.message, duration: 5})
                }).finally(_=>this.loading = false)
            }
        },
        created() {
            this.$capacitor.Plugins.Device.getInfo()
                .then(info=>{
                    this.device = info
                    console.log(info)
                }).catch(err=>{
                    this.$Message.warning({content: "couldn't get device info"})
                    console.log(err)
            })
        }
    }
</script>

<style scoped>

</style>