<template>
    <Timeline>
        <transition-group
                mode="out-in"
                name="fade"
        >

            <TimelineItem
                    :color="!todo.priority || todo.priority == 'low' ? 
                    'green' : todo.priority == 'normal' ? 'blue' : 'red'"
                    v-show="todos" v-for="(todo, index) of todos" :key="todo.id || index" style="animation-duration: .15s">
                <Icon v-if="todo.completed" type="md-checkmark" slot="dot"></Icon>
                <Icon v-else-if="isDue(todo.reminder)" type="md-warning" slot="dot"></Icon>
                <!-- <Icon v-else-if="todo.priority == 'normal'" type="md-information-circle" slot="dot"></Icon> -->
                <TodoItem :todo="todo">
                    <Icon @click="removeItem(index)" type="md-close"></Icon>
                </TodoItem>
            </TimelineItem>
        </transition-group>
    </Timeline>
</template>
<script>
    import TodoItem from "./TodoItem"

    export default {
        name: 'TodoList',
        components: {TodoItem},
        props: {
            todos: {type: Array, default: []},
        },
        methods:{
            removeItem(index){
                this.$emit('remove', index)
            },
            isDue(reminder){
                if(reminder){
                    return new Date(reminder.start.toDate()) < new Date(Date.now())
                }
            }
        }
    }
</script>
<style scoped>

    @media screen and (min-width: 720px) {
    }

    @media screen and (max-width: 720px) {
    }

</style>