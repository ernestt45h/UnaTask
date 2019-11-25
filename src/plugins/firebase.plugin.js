import * as firebase from 'firebase/app'
import "firebase/analytics"
import "firebase/auth"
import "firebase/firestore"
import 'firebase/storage'

export default {
    install: function (Vue, options) {
        firebase.initializeApp(options)
        firebase.firestore().enablePersistence()
        Vue.prototype.$firebase = firebase
    }
}