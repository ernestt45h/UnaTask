<template>
    <Row id="tasks">
        <Divider><h1>Tasks</h1></Divider>
        <Row v-if="tasks.length > 0" type="flex" justify="center" style="margin-bottom: 15px">
            <Col :xs="22" :md="17" :lg="13" :xl="11">
                <Progress :percent="percentageCompleted" :stroke-width="20" text-inside />    
            </Col>
        </Row>

        <Row id="task-input">
            <TaskInput @keypressed="taskKeyPressed" @createTask="createNewTask" :show-time-intervals="true"/>
        </Row>
<!--        <Row id="task-input" type="flex" justify="center" align="middle">-->
<!--            <Col :xs="24">-->
<!--                <Alert show-icon v-if="showHint">-->
<!--                    {{newTask.title}}-->
<!--                </Alert>-->
<!--            </Col>-->
<!--            <transition name="fade">-->
<!--                <Col class="suggestions" v-show="newTask.title" :xs="24" :lg="14">-->
<!--                    <Button @click="setDate('in the morning')" v-if="isMorning" class="suggestions-btn" icon="md-notifications" shape="circle">This morning</Button>-->
<!--                    <Button @click="setDate('in the afternoon')"  v-if="isAfternoon" class="suggestions-btn" icon="md-notifications" shape="circle">Later today</Button>-->
<!--                    <Button @click="setDate('in the evening')"  v-if="isEvening" class="suggestions-btn" icon="md-notifications" shape="circle">This evening</Button>-->
<!--                    <Button @click="setDate('Tomorrow morning')" class="suggestions-btn" icon="md-notifications" shape="circle">Tomorrow morning</Button>-->
<!--                    <Button @click="setDate('next week')" class="suggestions-btn" icon="md-notifications" shape="circle">Next week</Button>-->
<!--                    <Button class="suggestions-btn" icon="md-notifications" shape="circle">Someday</Button>-->
<!--                    <Button class="suggestions-btn" icon="md-notifications" shape="circle">Custom</Button>-->
<!--                </Col>-->
<!--            </transition>-->
<!--            <Col :xs="newTask.title ? 15 : 19" :md="newTask.title ? 11 : 12">-->
<!--                <input-->
<!--                        v-model="newTask.title"-->
<!--                        placeholder="I want to..."-->
<!--                        style="padding: 7px 24px; width: 100%; border: 1px solid #aaa; border-radius: 32px"/>-->
<!--            </Col>-->
<!--            <Col :xs="newTask.title ? 8 : 4" :md="newTask.title ? 3 : 2"  style="text-align: right">-->
<!--                <Row type="flex" justify="space-around">-->
<!--                    <Button v-if="!newTask.title" :loading="listening" @click="startListening"  icon="md-mic" shape="circle"></Button>-->
<!--                    <Button v-else :loading="isAddingTask" icon="md-send" @click="createNewTask" shape="circle"></Button>-->
<!--&lt;!&ndash;                    <Button v-if="!newTask.title" icon="md-add" shape="circle"></Button>&ndash;&gt;-->
<!--                    <Button @click="newTask.title = ''" v-if="newTask.title" icon="md-close" shape="circle"></Button>-->
<!--                </Row>-->
<!--            </Col>-->
<!--        </Row>-->
        <Row class="tasks" type="flex" justify="center">
            <Col :xs="22" :md="17" :lg="13" :xl="11">
                <Row type="flex" justify="center" style="margin-bottom: 32px; text-align: center">
                    <Col :xs="7">
                        <Button :type="completionFilter == 'all' ? 'primary' : 'default'"
                                @click="completionFilter = 'all'"
                                long
                                shape="circle"
                                icon="md-list"
                        >
                        </Button>
                    </Col>
                    <Col :xs="7">
                        <Button :type="completionFilter == 'ongoing' ? 'primary' : 'default'"
                                @click="completionFilter = 'ongoing'"
                                long
                                shape="circle"
                                icon="md-time"
                        >
                        </Button>
                    </Col>
                    <Col :xs="7">
                        <Button :type="completionFilter == 'completed' ? 'primary' : 'default'"
                                @click="completionFilter = 'completed'"
                                long
                                shape="circle"
                                icon="md-checkmark"
                        >
                        </Button>
                    </Col>
                </Row>

                <TodoList :todos="fiteredTasks"/>
            </Col>
        </Row>
    </Row>
</template>

<script>
    import TaskInput from "../../components/TaskInput";
    import TodoList from "../../components/TodoList";


    export default {
        name: "Home",
        components: {TodoList, TaskInput},
        watch:{
            tasks(){
                console.log('info', (this.tasks.length - this.tasks.filter(task=>!task.completed).length), this.tasks.length)
                this.percentageCompleted = Math.round(
                    (this.tasks.length - this.tasks.filter(task=>!task.completed).length) / 
                    this.tasks.length * 100)
                console.log(this.percentageCompleted)
            }
        },
        computed:{
            fiteredTasks(){
                return this.tasks.filter( task => {
                    if (this.completionFilter == 'ongoing')
                        return task.completed === false && task.isSub !== true
                    else if (this.completionFilter === 'completed')
                      return task.completed === true
                    else return true
                })
            },
        },
        data(){
            return {
                isKeyPressed: false,
                user: this.$firebase.auth().currentUser,
                completionFilter: 'ongoing',
                tasks: [],
                currentTime: new Date(Date.now()),
                timeSuggesstion: false,
                showHint: false,
                isAddingTask: false,
                listening: false,
                percentageCompleted: 0
            }
        },
        methods:{
            taskKeyPressed(isKeyPressed){
                console.log(isKeyPressed)
                this.isKeyPressed = isKeyPressed
            },
            createNewTask(task){
                if(task.title){
                    this.isAddingTask = true
                    task.createdBy = this.user.uid
                    task.dateCreated = new Date(Date.now())
                    this.$firebase.firestore().collection('tasks').add(task)
                        .then(ref => {
                            this.$Message.success({content: 'Task added', duration: 5})
                            task = this.taskTemplate
                            task.title = ''
                        }).catch(err=>{
                            task.participant = task.participant.filter(p=>{
                                return p !== this.user.uid
                            })
                            this.$Message.error({content: err.message, duration: 5})
                        }).finally(_=>{this.isAddingTask = false})
                }else{
                    this.$Message.info('Add a todo first :)')
                }
            },
        },
        created() {
            this.$Loading.start()
            this.$firebase.firestore().collection('tasks')
                .where('participant', 'array-contains', this.$firebase.auth().currentUser.uid)
                .orderBy("dateCreated", "desc")
                .onSnapshot(ref=>{
                    this.tasks = []
                    ref.docs.forEach(doc=>{
                        this.tasks.push({id:doc.id, ...doc.data()})
                    })
                    this.$Loading.finish()
                }, err=>{
                    console.log(err)
                    this.$Loading.error()
                    this.$Message.error({content: err.message, duration: 5})
                })

        }
    }
</script>

<style scoped>
    #tasks{
        height: 100%;
    }

    .tasks{
        padding-bottom: 172px;
    }

    @media screen and (min-width: 720px){
        #task-input{
            margin-bottom: 7px;
        }
    }
    @media screen and (max-width: 720px) {
        #task-input{
            position: fixed;
            bottom: 72px;
        }
    }

    #task-input{
        z-index: 20;
        background: #ffffff;
        width: 100%;
        padding: 7px 0;
    }

</style>