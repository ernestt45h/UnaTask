<template>
    <Row type="flex" justify="center">
        <Divider>
            <h1>Calendar</h1>
        </Divider>
        <Col :xs="22" :md="14" >
            <Alert><Avatar size="small" color="#333" icon="md-information"/> Under construction</Alert>
            <v-calendar style="margin-bottom: 120px"
                    locale="en"
                    @dayclick="viewEvents"
                    transition="slide-v"
                    :attributes="attributes"
                    :min-date="new Date()"
                    is-expanded
                    is-inline
                    :columns="$screens({ default: 1, lg: 2})"
                    :rows="$screens({lg: 1}, 2)"
            >
            </v-calendar>
        </Col>
    </Row>
</template>

<script>
    //TODO use vue-cal
    import Event from "./Event";
    export default {
        name: "Calendar",
        components: {Event},
        data(){
            return {
                tasks: '',
                attributes: [
                    {
                        key: 'today',
                        dot: true,
                        dates: new Date()
                    }
                ]
            }
        },methods:{
            viewEvents(day){
                this.$router.push({name: 'events', query: { date: day.id }})
            }
        },created() {
            this.attributes.dates = []
            this.$firebase.firestore().collection('tasks')
                .where('participant', 'array-contains', this.$firebase.auth().currentUser.uid)
                .orderBy("dateCreated", "desc")
                .onSnapshot(ref=>{
                    this.tasks = []
                    ref.docs.forEach(doc=>{
                        let task = doc.data()
                        if(task.reminder.start){
                            this.attributes.push({
                                dates: task.reminder.start.toDate(),
                                key: 'today',
                                highlight: true,
                            })
                        }
                    })
                }, err=>this.$Message.error({content: err.message, duration: 5}))
        }
    }
</script>

<style scoped>

</style>