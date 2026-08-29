import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const STORES_COLLECTION = 'registered_stores';

export async function syncStoreToFirebase(store: {
  id: string;
  name: string;
  owner: string;
  plan: string;
  status: string;
  joined: string;
}) {
  try {
    await addDoc(collection(db, STORES_COLLECTION), {
      ...store,
      createdAt: serverTimestamp(),
    });
    console.log('Store synced to Firebase:', store.name);
    return true;
  } catch (error) {
    console.warn('Firebase sync failed (offline mode):', error);
    return false;
  }
}

export async function fetchStoresFromFirebase() {
  try {
    const q = query(collection(db, STORES_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ firebaseId: d.id, ...d.data() }));
  } catch (error) {
    console.warn('Firebase fetch failed (offline mode):', error);
    return null;
  }
}

export async function updateStoreInFirebase(firebaseId: string, data: Record<string, any>) {
  try {
    await updateDoc(doc(db, STORES_COLLECTION, firebaseId), data);
    return true;
  } catch (error) {
    console.warn('Firebase update failed:', error);
    return false;
  }
}

export async function deleteStoreFromFirebase(firebaseId: string) {
  try {
    await deleteDoc(doc(db, STORES_COLLECTION, firebaseId));
    return true;
  } catch (error) {
    console.warn('Firebase delete failed:', error);
    return false;
  }
}
