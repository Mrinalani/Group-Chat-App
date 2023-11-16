


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }
  

window.addEventListener('DOMContentLoaded', async()=>{
    const token = localStorage.getItem('token')
    const decodedtoken = parseJwt(token)
    console.log(decodedtoken)
    const userName = decodedtoken.name


    const user = document.getElementById('users')
    const li = document.createElement('li')
    li.textContent = `${userName} has joined`
    user.appendChild(li)
})

async function sendmessage(event){

    event.preventDefault();

    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    console.log("messageoutcome",message)


    const token = localStorage.getItem('token')
    const decodedtoken = parseJwt(token)
    console.log(decodedtoken)
    const userName = decodedtoken.name

    const content = {
        message:message
    }

    const response = await axios.post('http://localhost:3000/user/message', content,  { headers: { "Authorization": token } })

    const chatcontainer = document.getElementById('chats')
    const li = document.createElement('li')
    li.textContent = `${userName} : ${message}`
    chatcontainer.appendChild(li)

    event.target.reset();
}