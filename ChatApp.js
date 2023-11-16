


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

   const activateusers = async()=>{
    const activeusers = await axios.get('http://localhost:3000/get/activeusers')
    console.log(activeusers)
    
    const active = activeusers.data.activeusers
    console.log(active)
    for(var i =0; i<active.length; i++){
    const user = document.getElementById('users')
    const li = document.createElement('li')
    li.textContent = `${active[i].Name} has joined`
    user.appendChild(li)
    }
   }
    


   const updateactiveusers = async()=>{
    const updateactive = await axios.put(`http://localhost:3000/user/active/${decodedtoken.id}`)
      if(updateactive.status === 201){
        const allmessagesofpartiuser = await axios.get('http://localhost:3000/user/getmessage', { headers: { "Authorization": token } })
        const data = allmessagesofpartiuser.data.retrievedvalue
        console.log("retrieved message = ",data)
        console.log("username", allmessagesofpartiuser.data.message)
    
        for(var i =0; i<data.length; i++){
            const user = document.getElementById('chats')
        const li = document.createElement('li')
        li.textContent = `${data[i].message}`
        user.appendChild(li)
        }
      }

   }

   const updateChatMessages = async () => {
    const allmessagesofpartiuser = await axios.get('http://localhost:3000/user/getmessage', { headers: { "Authorization": token } });
    const data = allmessagesofpartiuser.data.retrievedvalue;
    console.log('Response from getmessage API:', data);

    // Update the chat messages on the screen
    const user = document.getElementById('chats');
    user.innerHTML = ''; // Clear previous messages

    for (var i = 0; i < data.length; i++) {
        const li = document.createElement('li');
        li.textContent = `${data[i].message}`;
        user.appendChild(li);
    }
};

// Call functions on initial load
await activateusers();
await updateactiveusers();
await updateChatMessages();

// Set up a timeout to update the chat messages every second
setInterval(async () => {
    await updateactiveusers();
    await updateChatMessages();
}, 1000);
      
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
    console.log("*",response.data.Name)

    const chatcontainer = document.getElementById('chats')
    const li = document.createElement('li')
    li.textContent = response.data.Name
    chatcontainer.appendChild(li)

    event.target.reset();
}