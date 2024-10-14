export const BASE_URL = 'http://localhost:3000'

export const getAccessToken = () => localStorage.getItem("access_token")
export const setAccessToken = (token:string) => localStorage.setItem("access_token",token)
export const getRefreshToken = () => localStorage.getItem("refresh_token")
export const setRefreshToken = (token:string) => localStorage.setItem("refresh_token",token)

export const login = async function({email,password}: {email:string,password:string}) {
    try {
        const res = [await fetch(`${BASE_URL}/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email,password})
        }).then(r => r.json()),null]
        if(res[0].status != 200) return [null,res[0].description];
        setAccessToken(res[0].access_token)
        setRefreshToken(res[0].refresh_token)
        return res;
    } catch(err) {
        return [null,err]
    }
}

export const register = async function({username,email,password}: {username:string,email:string,password:string}) {
    try {
        const res = [await fetch(`${BASE_URL}/register`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username,email,password})
        }).then(r => r.json()),null]
        if(res[0].status != 200) return [null,res[0].description];
        setAccessToken(res[0].access_token)
        setRefreshToken(res[0].refresh_token)
        return res;
    } catch(err) {
        return [null,err]
    }
}

export const getUserChats = async function() {
    try {
        const res = [await fetch(`${BASE_URL}/users/chats`,{
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        }).then(r => r.json()),null]
        if(res[0].status != 200) return [null,res[0].description];
        return res;
    } catch(err) {
        return [null,err]
    }
}