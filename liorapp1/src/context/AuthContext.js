import { createContext, useReducer } from "react";

const defaultAuthState = { user: null, logged: false, window: false, aKey: '' };

const authReducer = (state, action) => {
  if (action.type === "ADD") {
    return { user: action.user, logged: true, window: false, aKey: state.aKey };
  } else if (action.type === "SHOW") {
    return { user: state.user, logged: state.logged, window: action.window, aKey: state.aKey };
  } else if (action.type === 'AUTHORIZATION') {
    return { user: state.user, logged: state.logged, window: state.window, aKey: action.aKey }
  }

};

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [authState, dispacthAuth] = useReducer(authReducer, defaultAuthState);
  const addUser = async (userInfo) => {
    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: { "Content-Type": "application/json" }, // add authorization if works
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log('failed to create user')
        return errorData;
      } else {
        dispacthAuth({ type: "ADD", user: userInfo });
        console.log("User added successfully");
        try{
          const signResponse = await signUserIn(userInfo);
          console.log(signResponse)
        } catch (err) {
          console.log('Error in signing in user right after signing up', err)
        }
      }
    } catch (err) {
      console.log("error adding user", err);
    }
  };
  const signUserIn = async (userInfo) => {
    try {
      const response = await fetch("http://localhost:8080/auth/signin", {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: { "Content-Type": "application/json" }, // add authorization if works
      });
      if(!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message)
      } else {
        const data = await response.json()
        console.log('this is in the sign in method: ', data)
        dispacthAuth({type: 'AUTHORIZATION', aKey: data})
        return data;
      }
    } catch (err) {
      console.log('Signing in error, possibly in fetching', err)
    }
  }
  const showWindow = (window) => {
    dispacthAuth({ type: "SHOW", window: window });
  };
  const authContext = {
    user: authState.user,
    logged: authState.logged,
    window: authState.window,
    aKey: authState.aKey,
    showWindow: showWindow,
    addUser: addUser,
    signUserIn: signUserIn,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  );
};
