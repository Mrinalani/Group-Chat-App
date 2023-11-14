async function login(event){
const Email = event.target.Email;
const Password = event.targrt.Password;

const LoggedInUserDetail = {
    Email:Email,
    Password: Password
}

 const loginuser = await axios.post('http://localhost:3000/login/loginuser',LoggedInUserDetail);
  if(loginuser.status === 201){
    alert("user logged in successfully")
  }else{
    alert("user not present please signup")
  }
}