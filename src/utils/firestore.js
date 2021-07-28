import firestore from '@react-native-firebase/firestore'

async function init() {
    await firestore().settings({
            persistence: false, // disable offline persistence
        });
}
init()

export default firestore
