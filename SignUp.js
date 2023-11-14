async function UsersInfo(event){
    event.preventDefault();
     try{
    const Name = event.target.name.value;
    const Email = event.target.email.value;
    const Phone = event.target.phone.value;
    const Password = event.target.password.value;

const SignupDetail = {
    Name: Name,
    Email: Email,
    Phone: Phone,
    Password: Password
}
console.log(SignupDetail)
const response = await axios.post('http://localhost:3000/user/signup',SignupDetail)
    if(response.status == 201){
        console.log("sign up successfull")
    }else{
        throw new Error("failed to sign up")
    }
}catch(err){
    console.log("error in sign up", err)
}
}