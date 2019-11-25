<template>
    <div id="app">
        <transition
                mode="out-in"
                name="zoom"
                enter-active-class="zoomInRight"
                leave-active-class="zoomOutLeft"
        >
            <router-view style="animation-duration: .7s"/>
        </transition>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                show : false
            }
        },
        beforeCreate() {

        }
    }
</script>
<style>

    .mb5{
        margin-bottom: 32px;
    }

    #app{
        height: 100vh;
    }

    .spinContainer{
        height: 100vh;
    }
</style>