import React from 'react'
import Login from './components/login/Login'
import { QueryClient, QueryClientProvider } from "react-query";
import ErrorPage from './components/ErrorPage/ErrorPage';

const queryClient = new QueryClient();

function App() {


  return (
    <QueryClientProvider client={queryClient}>
    <ErrorPage error="404" errorMessage="Sorry, this page could not be found."/>
    </QueryClientProvider>
  );
}

export default App;
