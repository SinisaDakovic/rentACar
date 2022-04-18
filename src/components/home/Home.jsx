import React,{useState, useEffect} from 'react'
import { useMutation } from "react-query";
import {getAccountData} from '../../services/account'
import '../home/home.css'
import {useTranslation} from 'react-i18next'

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


  const { t } = useTranslation()

    return (
        <div className="welcomeContainer">
          <div>
            <h2 id="welMsg">{t('wlcm.1')}, {user}</h2>
            <p id="paragraph">{t('evr.1')}</p>        
          </div>
        </div>
    )
}

export default Home
