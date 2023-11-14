
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

 const loginuser = await axios.post('http://localhost:3000/login/loginuser',LoggedInUserDetail);
  if(loginuser.status === 201){
    console.log(loginuser)
    console.log(loginuser.data.token)
    alert("user logged in successfully")
  }
}catch(err){
    document.body.innerHTML += 'Error:wrong email or password'
    console.log(err)
}
}