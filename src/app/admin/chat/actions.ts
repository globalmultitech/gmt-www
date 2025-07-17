'use server';

import { db } from '@/lib/firebase-admin';

async function deleteCollection(collectionPath: string, batchSize: number) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(query: FirebaseFirestore.Query, resolve: (value?: unknown) => void) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(query, resolve);
    });
}


export async function deleteChatSession(sessionId: string) {
  if (!sessionId) {
    return { success: false, message: 'Session ID is required.' };
  }

  try {
    const sessionRef = db.collection('chatSessions').doc(sessionId);
    
    // Delete messages subcollection first
    await deleteCollection(`chatSessions/${sessionId}/messages`, 100);

    // Then delete the session document itself
    await sessionRef.delete();

    return { success: true, message: 'Chat session deleted successfully.' };
  } catch (error) {
    console.error('Error deleting chat session:', error);
    return { success: false, message: 'Failed to delete chat session.' };
  }
}
