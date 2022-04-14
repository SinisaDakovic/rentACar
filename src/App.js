import React from 'react'
import Login from './components/login/Login'
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {


  return (
    <QueryClientProvider client={queryClient}>
    <Login/>
    </QueryClientProvider>
  );
}

export default App;
