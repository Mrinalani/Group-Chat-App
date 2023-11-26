
async function Login(event){
try{
    event.preventDefault();
   console.log("inside login")
const Email = event.target.email.value;
const Password = event.target.password.value;

const LoggedInUserDetail = {
    Email:Email,
    Password: Password
}

 const loginuser = await axios.post('http://16.171.5.45:3000/login/loginuser',LoggedInUserDetail);
  if(loginuser.status === 201){
    console.log(loginuser)
    console.log(loginuser.data.token)
    localStorage.setItem('token',loginuser.data.token);
    alert("user logged in successfully")
    window.location.href = '../ChatApp/chatApp.html'
  }
}catch(err){
    document.body.innerHTML += 'Error:wrong email or password'
    console.log(err)
}
}