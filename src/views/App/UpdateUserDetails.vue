<template>
    <div class="updateUser">
        <Row id="top">
            <Divider><h1>Profile</h1></Divider>
            <Row style="margin-top: 32px" type="flex" justify="center">
                <Row type="flex" align="bottom" justify="end" id="profile_pic">
                    <span @click="changePhoto">
                        <Badge dot>
                            <Spin v-if="loading"></Spin>
                            <img ref="avatar" :src="photo? photo : '/logo.png'" class="avatar">
                        </Badge>
                    </span>
                </Row>
            </Row>
        </Row>
        <Row type="flex" justify="center">
            <Col :xs="24" :md="14" :lg="11" :xl="7">
                <Row type="flex" justify="center" style="margin-top: 32px;">
                    <Col :xs="22">
                        <Button long shape="circle" type="warning" icon="md-lock">Change password</Button>
                    </Col>
                </Row>
                <Row type="flex" justify="center" style="margin-top: 15px">
                    <Col :xs="24">
                        <EditableField icon="md-person" @edited="setName" :value="displayName" placeholder="Full name"/>
                        <EditableField icon="md-call" @edited="setPhone" :value="phoneNumber" placeholder="Phone number"/>
                    </Col>
                </Row>
                <Row type="flex" justify="center" style="margin-top: 32px;">
                    <Col :xs="22">
                        <Button @click="save" long shape="circle" type="success">Save</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
    import EditableField from "../../components/EditableField";
    export default {
        name: "UpdateUserDetails",
        components: {EditableField},
        data(){
            return {
                user: {},
                uid: '',
                displayName: '',
                phoneNumber: '',
                photo: '',
                loading: false
            }
        },
        methods:{
            async save(){
                let user = {
                    displayName: this.displayName || '',
                    phoneNumber: this.phoneNumber || '',
                    photoURL: this.photo || ''
                }
                console.log(user)
                this.$firebase.firestore().collection('users').doc(this.user.uid).update(user).then(_=>{
                    this.$Message.success({content: 'Update successfully'})
                    this.$router.go(-1)
                }).catch(error=>{
                    this.$Message.error({content: error.message, duration: 5})
                })
            },
            async changePhoto(){
                try {
                    this.loading = true
                    let image = await this.$capacitor.Plugins.Camera.getPhoto({
                        quality: 90,
                        allowEditing: true,
                        resultType: this.$capacitor.CameraResultType.Uri,
                        height: 50,
                        width: 50,
                        source: this.$capacitor.CameraSource.Prompt
                    })
                    await this.$firebase.storage().ref(`users/${this.user.uid}`)
                        .put(await fetch(image.webPath).then(r=>r.blob()))
                    let url = await this.$firebase.storage().ref(`users/${this.user.uid}`).getDownloadURL()
                    this.photo = url
                    this.loading = false
                    console.log('photo', this.photo)
                }catch (e) {
                    console.log(e.message)
                }
            },
            setName(name){
                this.displayName = name
            },
            setPhone(phone){
                this.phoneNumber = phone
            }
        },
        created() {
            let uid = this.$firebase.auth().currentUser.uid
            this.$firebase.firestore().collection('users')
                .doc(uid).onSnapshot(ref=>{
                    this.user = {uid,  ...ref.data()}
                    this.displayName = this.user.displayName
                    this.phoneNumber = this.user.phoneNumber
                    this.photo = this.user.photoURL
                }, error => {

                })

        }
    }
</script>

<style scoped>
    #top{
        padding-bottom: 32px;
        box-shadow: 0 3px 7px #33333333;
    }

    .updateUser{
        height: 100vh;
        margin-bottom: 124px;
    }

    .avatar{
        width: 124px;
        height: 124px;
        box-shadow: 0 3px 7px #33333333;
        border-radius: 50%;
    }
</style>