<template>
    <Row type="flex" justify="center" align="middle">
        <Col :xs="24">
            <Alert show-icon  v-if="showHint">
                {{newTask.title}}
            </Alert>
        </Col>
        <transition name="fade">
            <Col class="suggestions" v-if="showTimeIntervals"  v-show="newTask.title" :xs="24" :sm="20">
                <Button @click="setDate('in the morning')" v-if="isMorning" class="suggestions-btn" icon="md-notifications" shape="circle">This morning</Button>
                <Button @click="setDate('in the afternoon')"  v-if="isAfternoon" class="suggestions-btn" icon="md-notifications" shape="circle">Later today</Button>
                <Button @click="setDate('in the evening')"  v-if="isEvening" class="suggestions-btn" icon="md-notifications" shape="circle">This evening</Button>
                <Button @click="setDate('Tomorrow morning')" class="suggestions-btn" icon="md-notifications" shape="circle">Tomorrow morning</Button>
                <Button @click="setDate('next week')" class="suggestions-btn" icon="md-notifications" shape="circle">Next week</Button>
                <!-- <Button class="suggestions-btn" icon="md-notifications" shape="circle">Someday</Button>
                <Button class="suggestions-btn" icon="md-notifications" shape="circle">Custom</Button> -->
            </Col>
        </transition>
        <Col :xs="newTask.title ? 15 : 19" :md="newTask.title ? 11 : 12">
            <input
                    @input="keyPressed"
                    v-model="newTask.title"
                    placeholder="I want to..."
                    style="padding: 7px 24px; width: 100%; border: 1px solid #aaa; border-radius: 32px"/>
        </Col>
        <Col :xs="newTask.title ? 8 : 4" :md="newTask.title ? 3 : 2"  style="text-align: right">
            <Row type="flex" justify="space-around">
                <Button v-if="!newTask.title" :loading="listening" @click="startListening"  icon="md-mic" shape="circle"></Button>
                <Button v-else :loading="isAddingTask" icon="md-send" @click="createNewTask" shape="circle"></Button>
                <Button @click="setNewTask" v-if="newTask.title" icon="md-close" shape="circle"></Button>
            </Row>
        </Col>
    </Row>
</template>

<script>
    import SpeechToText from 'speech-to-text'
    import Chrono from 'chrono-node'

    export default {
        name: "TaskInput",
        props: {
            showTimeIntervals:{
                type: Boolean,
                default: false
            }
        },
        computed:{
            isMorning(){
                return new Date(Date.now()).getHours() < 11
            },
            isAfternoon(){
                let hour = new Date(Date.now()).getHours()
                return hour < 16
            },
            isEvening(){
                let hour = new Date(Date.now()).getHours()
                return hour < 20
            },
        },
        data(){
            return {
                s2t : '',
                nlp: new Chrono.Chrono(),


                taskTemplate: {
                    title: '',
                    note: '',
                    tags: [],
                    type: 'todo',
                    reminder: '',
                    priority: 'normal',
                    location: '',
                    subTasks: [],
                    participant: [this.$firebase.auth().currentUser.uid],
                    attachments: [],
                    dateCreated: '',
                    completed: false
                },
                newTask: {},
                showHint: false,
                listening: false,
                isAddingTask: false,

            }
        },
        methods: {
            setNewTask(){
                this.newTask = {...this.taskTemplate}
                this.newTask.title = ''
            },
            setReminder(
                day = new Date(Date.now()).getDate(),
                month = new Date(Date.now()).getMonth(),
                year = new Date(Date.now()).getFullYear(),
                hours = 6,
                minutes = 0
            ){
                let date = new Date(Date.now())
                date.setMilliseconds(0)
                date.setSeconds(0)
                date.setDate(day)
                date.setHours(hours)
                date.setMinutes(minutes)
                this.newTask.reminder.start = date
            },
            createNewTask(){
                console.log('emit create task')
                this.$emit('createTask', {...this.newTask})
                this.setNewTask()
            },
            onAnythingSaid(text){
                this.showHint = true
                this.newTask.title = text
            },
            onFinallySaid(text){
                this.newTask.title = text
                setTimeout(()=>{
                    this.showHint = false
                },3000)
                let date = this.nlpParser(text)
                console.log(date)
                if(typeof this.newTask.reminder == 'string') this.newTask.reminder = {}
                this.newTask.reminder.start = date || ''
            },
            onEndEvent() {
                if (this.s2t.listening) {
                    this.s2t.startListening();
                }else{
                    this.listening = false
                }
            },
            startListening(){
                try{
                    this.s2t.startListening()
                    this.listening = true
                }catch (e) {
                    console.log(e)
                    this.listening = false
                }
            },
            nlpParser(text){
                return this.nlp.parseDate(text)
            },
            setDate(text){
                typeof this.newTask.reminder == 'string' ? this.newTask.reminder = {} : null 
                this.newTask.reminder.start = this.nlpParser(text)
                this.timeSuggesstion = false
            },
            keyPressed(){
                this.newTask.title ?
                    this.$emit('keypressed', true) :
                    this.$emit('keypressed', false)
                // console.log(this.newTask) : null
            }
        },
        created() {
            let refiner = new Chrono.Refiner()
            refiner.refine = function(text, results, opt){
                results.forEach(function (result) {
                    if (!result.start.isCertain('meridiem') &&
                        result.start.get('hour') >= 1 && result.start.get('hour') < 4) {

                        result.start.assign('meridiem', 1);
                        result.start.assign('hour', result.start.get('hour') + 12);
                    }
                });
                return results;
            }
            this.nlp.refiners.push(refiner)

            //Todo clear all pending notifications then set ones for tasks reminders to keep up with updates

            //Setup
            this.newTask = {...this.taskTemplate}
            this.s2t = new SpeechToText(this.onFinallySaid, this.onEndEvent, this.onAnythingSaid)
        }
    }
</script>

<style scoped>
    .suggestions{
        padding: 7px;
        animation-duration: .15s;
        overflow: auto;
        white-space: nowrap;
    }

    .suggestions-btn{
        display: inline-block;
    }

</style>