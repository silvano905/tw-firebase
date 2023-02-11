import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage, ref, deleteObject } from "firebase/storage";
const { initializeAppCheck, ReCaptchaV3Provider } = require("firebase/app-check");

const firebaseConfig = {
    apiKey: "AIzaSyBtxYrVceF3lb7CJHrahCspCiKL0nPX35I",
    authDomain: "tw-firebase-e7ee2.firebaseapp.com",
    projectId: "tw-firebase-e7ee2",
    storageBucket: "tw-firebase-e7ee2.appspot.com",
    messagingSenderId: "887056215731",
    appId: "1:887056215731:web:e871b7786c5c1ea1898ac6"
};


const app = initializeApp(firebaseConfig)

const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LfrUSkkAAAAAACmgDVka_HCSpYrxRUuWjD_j_gP'),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true
});

// init services
const db = getFirestore()
const auth = getAuth()
const storage = getStorage();


const deleteImage = async (file) => {
    let r = ref(storage, file)
    await deleteObject(r)
}


export {db, auth, deleteImage}


