import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCKTIXTxYflNQIV7hCu8jRxsZwk58QYq4k",
    authDomain: "shopsharer-app.firebaseapp.com",
    projectId: "shopsharer-app",
    storageBucket: "shopsharer-app.appspot.com",
    messagingSenderId: "586002125178",
    appId: "1:586002125178:web:71f29529e0cf76cb3e06c3"
  };

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export async function signInWithGoogle() {
   const provider = new firebase.auth.GoogleAuthProvider()
   await auth.signInWithPopup(provider)
   window.location.reload()
}

//Check if the user is authenticated or not
export function checkAuth(cb) {
   return auth.onAuthStateChanged(cb)
}

export async function logOut() {
    await auth.signOut()
    window.location.reload()
}

// To get our entire collection list
export async function getCollection(id) {
    const snapshot = await db.collection(id).get()
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log(data, 'collection')
}

// To get user list
export async function getUserLists(userId) {
    const snapshot = await db.collection('lists').where('author', '==', userId).get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))  
}

function uploadCoverImage(file) {
    const uploadTask = storage.ref(`images/${file.name}-${file.lastModified}`)
                            .put(file)
    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed', 
            (snapshot) => console.log("image uploading", snapshot), 
            reject,
            () => {
                storage.ref('images').child(`${file.name}-${file.lastModified}`)
                    .getDownloadURL().then(resolve)
            } 
        ) 
    })                   
    
}

export async function createList(list, user) {
    const { name, description, image } = list
    await db.collection('lists').add({
        name,
        description,
        image: image ? await uploadCoverImage(image) : null,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        author: user.uid,
        userIds: [user.uid],
        users: [ 
            {
                id: user.uid,
                name: user.displayName
            }
        ]
    })
}


export async function getList(listId) {
    try {
        const list = await db.collection('lists').doc(listId).get()
        if(!list.exists) throw Error(`List doesn't exist`)
        return list.data()
    } catch(error) {
        throw Error(error)
    }
    
}