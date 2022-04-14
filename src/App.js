import React from 'react'
import Login from './components/login/Login'
import { QueryClient, QueryClientProvider } from "react-query";
import ErrorPage from './components/ErrorPage/ErrorPage';
import Nav from './components/nav/Nav';

const queryClient = new QueryClient();

function App() {


  return (
    <QueryClientProvider client={queryClient}>
    <Nav/>
    </QueryClientProvider>
  );
}

export default App;
