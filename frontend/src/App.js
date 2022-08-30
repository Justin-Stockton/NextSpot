import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { authenticate } from "./store/session";
import { thunkGetSpots } from "./store/spots";
import HomePage from "./components/Pages/HomePage";
import SpotPage from "./components/Pages/SpotPage";
import UserPage from "./components/Pages/UserPage";
import LoginModal from "./components/forms/LoginModal";
import Oops from "./components/Pages/Oops";
import Wishlists from "./components/Pages/Wishlists";
import WishlistPage from "./components/Pages/WishlistPage";

export const useClickOutside = (handler) => {
  let domNode = useRef();

  useEffect(() => {
    let checkHandler = (e) => {
      if (!domNode.current?.contains(e.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", checkHandler);

    return () => {
      document.removeEventListener("mousedown", checkHandler);
    };
  });
  return domNode;
};

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      await dispatch(thunkGetSpots());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/login" exact={true}>
          <LoginModal />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route>
        <Route path="/spots/:spotId" exact={true}>
          <SpotPage />
        </Route>
        <Route path="/" exact={true}>
          <HomePage />
        </Route>
        <ProtectedRoute path="/user/:username" exact={true}>
          <UserPage />
        </ProtectedRoute>
        <ProtectedRoute path="/user/:username/host" exact={true}>
          It looks like this feature isnt quite done yet
        </ProtectedRoute>
        <ProtectedRoute path="/my-wishlists" exact={true}>
          <Wishlists />
        </ProtectedRoute>
        <ProtectedRoute path="/:username/:wishlistname" exact={true}>
          <WishlistPage />
        </ProtectedRoute>
        <Route>
          <Oops />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
