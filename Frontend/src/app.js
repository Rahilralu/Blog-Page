import { getToken, setToken } from './auth.js'

export const  handleLoginSuccess = async(email,password,setCurrentPage,type) => {
  console.log("TYPE:",type);
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
    },
    credentials:'include',
    body:JSON.stringify({
      email:email,
      password:password,
      type:type
    })  
  });

  const data = await res.json();
  if(type === 'Sign-Up' && data.success === false && data.output === true){
    return true;
  }

  else if(type === 'Sign-In' && data.success === false && data.output === true){
    return true;
  }

  if(data.success){
      setToken(data.access_token)  
      setCurrentPage('dashboard');
      return false;
  }
}

export const handle_session = async (setCurrentPage) => {
    const res = await fetch('.../refresh', {
        method: 'POST',
        credentials: 'include' 
    })
    if (res.ok) {
        const data = await res.json()
        setToken(data.access_token) 
        setCurrentPage('dashboard')
    }
}