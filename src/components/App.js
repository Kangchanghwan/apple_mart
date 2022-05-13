import AppRouter from "./AppRouter";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { authService } from "../utils/api/fbInstance";
import Loading from "./layout/write/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../modules/user";
import axios from "axios";

function App() {
  axios.defaults.baseURL = "https://applemt.click/api";
  //axios.defaults.baseURL = "http://localhost:8080/api";

  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newName, setNewName] = useState("");
  const { userObj } = useSelector(({ user }) => ({
    userObj: user.currentUser,
  }));
  const dispatch = useDispatch();
  useEffect(() => {
    authService.currentUser
      ?.getIdToken(true)
      .then((result) => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + result;
      })
      .catch((reason) => {
        console.log(reason);
      });

    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);

        if (user.displayName === null) {
          user.displayName = "";
        }
        dispatch(setUser(user));
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + user.accessToken;
      } else {
        dispatch(setUser(null));
        setIsLoggedIn(false);
      }
      setInit(true);
      console.log(user);
    });
  }, []);
  const refreshUser = (args) => {
    const user = authService.currentUser;
    if (user) {
      setNewName(user.displayName);
      dispatch(setUser(user));
    }
    if (args === "logout") {
      setInit(false);
      setIsLoggedIn(false);
      setInit(true);
      dispatch(setUser(null));
    }
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        <Loading />
      )}
    </>
  );
}

export default App;
