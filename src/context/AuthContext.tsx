import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface AuthState {
  user: User | null;
  displayName: string | null;
  avatarSeed: string;
  loading: boolean;
  signIn: (name: string, avatarSeed: string) => Promise<void>;
  updateAvatarSeed: (seed: string) => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  displayName: null,
  avatarSeed: '',
  loading: true,
  signIn: async () => {},
  updateAvatarSeed: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarSeed, setAvatarSeed] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, 'users', u.uid));
        if (snap.exists()) {
          setDisplayName(snap.data().displayName);
          setAvatarSeed(snap.data().avatarSeed ?? u.uid);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async (name: string, seed: string) => {
    let currentUser = auth.currentUser;
    if (!currentUser) {
      const cred = await signInAnonymously(auth);
      currentUser = cred.user;
    }
    const finalSeed = seed || currentUser.uid;
    await setDoc(doc(db, 'users', currentUser.uid), {
      displayName: name,
      avatarSeed: finalSeed,
      createdAt: serverTimestamp(),
    });
    setDisplayName(name);
    setAvatarSeed(finalSeed);
    setUser(currentUser);
  };

  const updateAvatarSeed = async (seed: string) => {
    setAvatarSeed(seed);
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { avatarSeed: seed }, { merge: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, displayName, avatarSeed, loading, signIn, updateAvatarSeed }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
