export default async function(){
    return $.ajax({
        url:'/api/users/isSignin',
        headers:{
            'X-Access-Token':localStorage.getItem('token')
        },
        success:(res)=>{
            return res
        },
        error:()=>{
            return false
        }
    })
}