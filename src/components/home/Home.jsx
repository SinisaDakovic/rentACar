import React,{useState, useEffect} from 'react'
import { useMutation } from "react-query";
import {getAccountData} from '../../services/account'
import '../home/home.css'

function Home() {

    const [user, setUser] = useState('')
    

 const accountDataMutation = useMutation(() => getAccountData(), {
    onSuccess: (res) => {
      setUser(res?.data?.name)     
    },
    onError: (error) => {
      console.log(error);
    },
  });


  useEffect(() => {
    try{
      accountDataMutation.mutate()

    }catch(err){
      console.log(err)
    }
  }, [])


    return (
        <div className="welcomeContainer">
          <div>
            <h2 id="welMsg">Welcome, {user}</h2>
            <p id="paragraph">Everything is ready and waiting for you.</p>        
          </div>
        </div>
    )
}

export default Home
