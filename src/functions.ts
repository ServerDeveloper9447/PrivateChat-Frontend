export const BASE_URL = 'http://localhost:3000'

export const getAccessToken = () => localStorage.getItem("access_token")
export const setAccessToken = (token:string) => localStorage.setItem("access_token",token)
export const getRefreshToken = () => localStorage.getItem("refresh_token")
export const setRefreshToken = (token:string) => localStorage.setItem("refresh_token",token)

/**
 * @description Fetches from backend with authentication
 */
export const bkFetch = async function(url:string,options?:undefined | {}) {
    return await fetch(`${BASE_URL}${url}`,{
        ...options,
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            'Content-Type': 'application/json'
        }
    })
}

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
        console.log(res)
        if(res[0].status != 201) return [null,res[0].description];
        setAccessToken(res[0].access_token)
        setRefreshToken(res[0].refresh_token)
        return res;
    } catch(err) {
        return [null,err]
    }
}

export const getCurrentUser = async function() {
    return await bkFetch('/users/',{
        method: 'POST'
    })
}

export const getUserChats = async function() {
    try {
        const res = [await bkFetch(`/users/chats`).then(r => r.json()),null]
        if(res[0].status != 200) return [null,res[0].description];
        return res;
    } catch(err) {
        return [null,err]
    }
}

export const getChat = async function(id:string) {
    try {
        const res = [await bkFetch(`/chats/${id}`).then(res => res.json()),null]
        if(res[0].status != 200) return [null,res[0].description];
        return res;
    } catch (error) {
        return [null,error]
    }
}

export const createChat = async function({id}: {id:string}) {
    try {
        const curr = await getCurrentUser().then(res => res.json())
        const res = [await bkFetch(`/chats/create`,{
            method: 'POST',
            body: JSON.stringify({
                memberIds: [id,curr._id],
                direct: true,
                name: curr.username,
                createdBy: curr._id
            })
        }).then(res => res.json()),null]
        if(res[0].status != 201) return [null,res[0].description];
        return res;
    } catch (error) {
        return [null,error]
    }
}

export const searchUser = async function(username:string): Promise<[null | { _id: string, username: string, avatar?: string, about?: string, createdAt?: string, banned?: boolean, public_key: string },null | any]> {
    try {
        const res: [null | { status: number, description?: string, user: {_id: string, username: string, avatar?: string, about?: string, createdAt?: string, banned?: boolean, public_key: string }}&{},null | any] = [await bkFetch(`${BASE_URL}/users/search?username=${encodeURIComponent(username)}`).then(res => res.json()),null]
        if(res[0]?.status != 200) return [null,res[0]?.description];
        return [res[0].user,null];
    } catch(err) {
        return [null,err]
    }
}