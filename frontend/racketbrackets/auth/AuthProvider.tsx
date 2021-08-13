import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import firebase from "firebase";
import { auth } from "../config/firebaseConfig";

//Creates an Authentication Provider, a React functional component used to check the user's authentication state
//This is run on every page via the Header Component
//If a user is logged in, that authentication state will be persistent until they hit sign out
//authentication state will persist through window closing
export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};