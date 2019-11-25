<template>
    <Row type="flex" v-if="user" justify="space-between" align="middle" class="mb5">
        <Col :xs="14">
            <Row type="flex" align="middle" justify="space-between">
                <Col :xs="5">
                    <Avatar>{{displayName}}</Avatar>
                </Col>
                <Col :xs="18">
                    <h3>{{user.displayName}}</h3>
                    <p>{{user.email}}</p>
                </Col>
            </Row>
        </Col>
        <Col>
            <ButtonGroup long shape="circle" vertical>
                <slot></slot>
            </ButtonGroup>
        </Col>
        <Col :xs="24">
            <div slot="extra"></div>
        </Col>
    </Row>
</template>
<script>
    export default {
        name: 'UserPlaceholder',
        computed:{
            displayName(){
                return this.user.displayName ?
                    this.changeCaseFirstLetter(this.user.displayName) :
                    this.changeCaseFirstLetter(this.user.email)
            }
        },
        methods:{
            changeCaseFirstLetter(params) {
                if(typeof params === 'string') {
                    return params.charAt(0).toUpperCase()
                }
                return null
            }
        },
        props: {
            user: {
                type: Object
            }
        }
    }
</script>
