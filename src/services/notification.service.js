export default {
    async request(){
        try {
            return await Notification.requestPermission()
        }catch (e) {
            throw e
        }
    },

    setNotification(capNote){

    },

    cancelAll(capNote){

    }
}