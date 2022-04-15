import React from 'react'
import Login from './components/login/Login'
import { QueryClient, QueryClientProvider } from "react-query";
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Home from './components/home/Home';

const queryClient = new QueryClient();

function App() {


  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
        path="/"
        element={
          <PrivateRoute>
            <Login/>
          </PrivateRoute>
        }
        />
        <Route
        path="/home"
        element={
          <PrivateRoute isPrivate={true}>
            <Home/>
          </PrivateRoute>
        }
        />
        <Route
        path="*"
        element={<ErrorPage error="404" errorMessage="Sorry, this page could not be found."/>}
        />

        
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
