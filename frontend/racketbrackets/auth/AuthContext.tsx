import React from "react";
import firebase from "firebase";

//Creates an AuthContext React Context
//This will be used by the AuthProvider to check if the user has passed firebase authorization
export const AuthContext = React.createContext<firebase.User | null>(null);