import { Capacitor, CameraResultType, CameraSource } from '@capacitor/core';

export default {
    install: function (Vue, options) {
        Capacitor.CameraResultType = CameraResultType
        Capacitor.CameraSource = CameraSource
        Vue.prototype.$capacitor = Capacitor
    }
}