<template>
    <nav>
        <Row type="flex" justify="space-around" style="text-align: center">
            <router-link class="link" tag="li" :to="{name: 'home'}">
                <h1>
                    <Icon type="md-checkmark-circle-outline"/>
                </h1>
                Tasks
            </router-link>
            <router-link class="link" tag="li" :to="{name: 'calendar'}">
                <h1>
                    <Icon type="md-calendar"/>
                </h1>
                Calendar
            </router-link>
            <router-link class="link" tag="li" :to="{name: 'settings'}">
                <h1>
                    <Icon type="md-settings"/>
                </h1>
                Settings
            </router-link>
        </Row>
    </nav>
</template>
<script>
    export default {
        name: 'AppNav'
    }
</script>
<style scoped>
    li{
        text-decoration: none;
        list-style: none;
    }

    .link{
        cursor: pointer;
        transition: all .3s;
        /*padding: 7px 32px;*/
        margin-left: 15px;
    }


    @media screen and (min-width: 720px){
        .link {
            width: 100%;
            padding: 7px 0px;
            margin: 15px 0;
        }

        .link:hover{
            background: #eee
        }
    }

    nav{
        background-color: #ffffff;
        height: 72px;
        box-shadow: 0 -1px 3px #33333333;
    }

    .router-link-exact-active{
        color: #2d8cf0;
    }
</style>