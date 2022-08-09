import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { authenticate } from "./store/session";
import { thunkGetSpots } from "./store/spots";
import HomePage from "./components/Pages/HomePage";
import SpotPage from "./components/Pages/SpotPage";
import UserPage from "./components/Pages/UserPage";
import LoginModal from "./components/forms/LoginModal";

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
        <ProtectedRoute path="/:username" exact={true}>
          <UserPage />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
