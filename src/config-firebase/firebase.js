import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, updateProfile, signInWithPopup } from 'firebase/auth'

import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

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

const imageUploadPost = async (file) => {
    const fileRef = ref(storage, file.name+ '.png');

    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    return photoURL
}

const imageUploadUser = async (file, user, displayName) => {
    const fileRef = ref(storage, user.user.uid + '.png');

    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    await updateProfile(user.user, {photoURL: photoURL, displayName: displayName})
    return photoURL
}

const deleteImage = async (file) => {
    let r = ref(storage, file)
    await deleteObject(r)
}


export {db, auth, imageUploadUser, imageUploadPost, deleteImage}


