import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

import { getStorage, ref, deleteObject } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBtxYrVceF3lb7CJHrahCspCiKL0nPX35I",
    authDomain: "tw-firebase-e7ee2.firebaseapp.com",
    projectId: "tw-firebase-e7ee2",
    storageBucket: "tw-firebase-e7ee2.appspot.com",
    messagingSenderId: "887056215731",
    appId: "1:887056215731:web:e871b7786c5c1ea1898ac6"
};

initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()
const storage = getStorage();


const deleteImage = async (file) => {
    let r = ref(storage, file)
    await deleteObject(r)
}


export {db, auth, deleteImage}


