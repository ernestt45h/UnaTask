<template>
    <Row type="flex" justify="space-between" align="middle" style="padding: 0 0 15px 0  ">
        <Col :xs="24">
            <span :style="{textDecoration: todo.completed ? 'line-through' : 'none'}">
                <div style="cursor: pointer" @click="goToTask">
                    <span>
                        <Row type="flex" justify="space-between" align="middle">
                            <Col :xs="21">{{todo.title | capitalize}}</Col>
                            <Col :xs="2"><slot></slot></Col>
                        </Row>
                        <template v-if="todo.reminder">
                            <Tag  v-if="todo.reminder.start"
                                color="primary">
                                <Time style="color: #fff" :time="todo.reminder.start.toDate()" /></Tag>
                            <Tag  v-if="todo.reminder.start"
                                color="default">
                                <Time type="datetime"  :time="todo.reminder.start.toDate()" />
                            </Tag>
                        </template>
                    </span>
                    <Row v-if="todo.participant">
                        <Tag v-if="todo.participant.length > 1" color="blue"><Icon type="md-people"></Icon> {{todo.participant.length}}</Tag>
                    </Row>
                </div>
            </span>
        </Col>
    </Row>
</template>
<script>
    export default {
        name: 'TodoItem',
        props: ['todo'],
        watch: {
          'todo.completed'(val){
            this.$firebase.firestore().collection('tasks').doc(this.todo.id)
                .update({
                    completed : val
                })
          }
        },
        data(){
          return {
              loading: false
          }
        },
        methods:{
            goToTask(){
                if(this.todo.id)
                    this.$router.push({ name: 'task', query: {id: this.todo.id}, params: {id: this.todo.id}})
            }
        }
    }
</script>
<style scoped>
    span{
        font-size: 16px;
        color: #515a6e;
    }
</style>