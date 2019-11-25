<template>
    <Row type="flex" justify="center">
        <Divider><h2>{{$route.query.date ? `Tasks for ${$route.query.date}` : 'Event'}}</h2></Divider>
        <Col :xs="22">
            <Timeline>
                <TimelineItem
                        :color="!todo.priority || todo.priority == 'low' ? 'green' : todo.priority == 'normal' ? 'blue' : 'red'"
                        v-show="events" v-for="todo of events" :key="todo.id"  style="animation-duration: .15s">
                    <TodoItem :todo="todo"/>
                </TimelineItem>

            </Timeline>
        </Col>
    </Row>
</template>

<script>
    import TodoItem from "../../components/TodoItem";
    export default {
        name: "Event",
        components: {TodoItem},
        data(){
            return {
                events: []
            }
        },
        created() {
            let date = this.$route.query.date
            date = new Date(date)
            if(date){
                let startDate = new Date(date)
                let endDate = new Date(date.setDate(date.getDate() + 1))
                this.$firebase.firestore().collection('tasks')
                    .where('participant', 'array-contains', this.$firebase.auth().currentUser.uid)
                    .where('reminder.start', '>=', startDate)
                    .where('reminder.start', '<=', endDate)
                    .get().then(refs =>{
                        refs.forEach(ref=>{
                            this.events.push({id: ref.id, ...ref.data()})
                        })
                })
                    .catch(err=>console.error(err))
            }else{
                this.$Message.error({content: 'Date not specified'})
            }

        }
    }
</script>

<style scoped>

</style>