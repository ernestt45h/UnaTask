<template>
    <Col :xs="24">
        <DatePicker
            v-if="value"
            @on-change="dateChanged"
            @on-ok="setDate"
            @on-clear="clearDate"
            :open="isCalendarOpen"
            :value="value"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            placeholder="Reminder"
            style="width: 100%"
            :options="options"
            :start-date="new Date(Date.now())"
        >
            <Button @click="openCalendar" long icon="md-time">
                <template v-if="value === ''">Select date</template>
                <template v-else><Time type="datetime" :time="value"></Time></template>
            </Button>
        </DatePicker>
    </Col>
</template>
<script>
    export default {
        name: 'ReminderEditor',
        props: ['id', 'time'],
        watch:{
            time(val){
                this.value = val
            }
        },
        data(){
            return {
                value: typeof this.time.toDate == "function" ? this.time.toDate() : '',
                isCalendarOpen: false,
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
            }
        },methods:{
            setDate(){
                this.$emit('change', this.value)
                this.isCalendarOpen = false
            },
            clearDate(){
              this.isCalendarOpen = false
            },
            dateChanged(date){
                this.value = date
                console.log(this.value)
            },
            openCalendar(){
                this.isCalendarOpen = !this.isCalendarOpen
            }
        },
        created() {
        }
    }
</script>
<style scoped>
    .mb3 {
        margin: 7px 0;
    }
</style>