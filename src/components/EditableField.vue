<template>
    <Card>
        <Row type="flex" align="middle">
            <Col :xs="3">
                <Icon size="24" :type="icon"></Icon>
            </Col>
            <Col :xs="20">
                <h3 v-if="!edit" @click="edit = !edit">{{ val || placeholder}}</h3>
                <Input v-else v-model="val" :placeholder="placeholder">
                    <slot slot="prefix"></slot>
                    <Button @click="done" shape="circle" type="success" slot="suffix" ><Icon color="#fff" type="md-checkmark"></Icon></Button>
                </Input>
            </Col>
        </Row>
    </Card>
</template>
<script>
    export default {
        name: 'EditableField',
        props: {
            icon: String,
            value: String,
            placeholder: String,
        },methods: {
            done(){
                this.$emit('edited', this.val)
                this.edit = false
            }
        },
        data(){
            return {
                val : '',
                edit: false
            }
        },
        watch:{
          value(val){this.val = val}
        },
        created() {
            this.val = this.value
        }
    }
</script>
