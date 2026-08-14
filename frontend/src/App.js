import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import { authenticate } from "./store/session";
import HomePage from "./components/Pages/HomePage";
import LoginModal from "./components/forms/LoginModal";
import Oops from "./components/Pages/Oops";
import JournalDashboard from "./components/Pages/HomePage/JournalDashboard";
import SpotPage from "./components/Pages/SpotPage";
import AccountPage from "./components/Pages/AccountPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
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
        <Route path="/" exact={true}><HomePage /></Route>
        <ProtectedRoute path="/places" exact={true}><JournalDashboard view="places" /></ProtectedRoute>
        <ProtectedRoute path="/places/:placeId" exact={true}><SpotPage /></ProtectedRoute>
        <ProtectedRoute path="/timeline" exact={true}><JournalDashboard view="timeline" /></ProtectedRoute>
        <ProtectedRoute path="/collections" exact={true}><JournalDashboard view="collections" /></ProtectedRoute>
        <ProtectedRoute path="/account" exact={true}><AccountPage /></ProtectedRoute>
        <Route>
          <Oops />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
