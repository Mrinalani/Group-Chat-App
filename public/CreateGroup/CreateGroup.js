

const createGroupBtn=document.getElementById('createNewGroupBtn')
createGroupBtn.addEventListener('click',()=>{
    console.log("under create group")
    const groupName=prompt('Enter your group name');
    createGroup(groupName)
})

function createGroup(groupName){
    const token=localStorage.getItem('token')
    // console.log(token)
    const data={
        groupName:groupName
    }
    axios.post('http://16.171.5.45:3000/group/createGroup',data,{headers:{'Authorization':token}}).then((res)=>{
        alert(res.data.message)
        localStorage.setItem('groupId',res.data.groupId)
    })

}

const addParticipantBtn = document.getElementById('addParticipantbtn');

addParticipantBtn.addEventListener('click', async (e) => {
    e.preventDefault();

   const token = localStorage.getItem('token')
   const groupId = localStorage.getItem('groupId')

   const isAdmin = await axios.get(`http://16.171.5.45:3000/user/isAdmin/${groupId}`,{headers:{'Authorization':token}})
      if(isAdmin.data.isAdmin === false){
         alert('Only Admin Can Add Participants')
      }
      else{
        console.log(isAdmin)
    const allusers = await axios.get('http://16.171.5.45:3000/users/getAll');
    const usersData = allusers.data.participants;
    console.log("getting all users =",usersData)

    const groupMembersResponse = await axios.get(`http://16.171.5.45:3000/groups/${groupId}/members`,);
    console.log("groupMenber:" ,groupMembersResponse)


    const participantsContainer = document.getElementById('participantsContainer');
    //const groupId = localStorage.getItem('groupId')

    participantsContainer.innerHTML = '';

    
    usersData.forEach(user => {
        const userCheckbox = document.createElement('input');
        userCheckbox.type = 'checkbox';
        userCheckbox.id = `user-${user.id}`;
        userCheckbox.value = user.id;

        const userLabel = document.createElement('label');
        userLabel.htmlFor = `user-${user.id}`;
        userLabel.textContent = `${user.id} ${user.Name} `;
 
        if (groupMembersResponse.data.some(member => member.id === user.id)) {
            userCheckbox.checked = true;
            console.log('checked:::::::');
        }
        console.log("userxheckbox",userCheckbox)

        const userDiv = document.createElement('div');
        userDiv.appendChild(userCheckbox);
        userDiv.appendChild(userLabel);

        const makeAdminButton = document.createElement('button');
        makeAdminButton.textContent = 'Make Admin';
        makeAdminButton.addEventListener('click', () => {
            makeAdmin(user.id, groupId); 
        });
    
        userDiv.appendChild(makeAdminButton);

        participantsContainer.appendChild(userDiv);
    });
    addSelectedParticipants();
}
    async function addSelectedParticipants(){
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Add Selected Participants';
    submitBtn.addEventListener('click', () => {
        const selectedParticipants = Array.from(participantsContainer.querySelectorAll('input[type=checkbox]:checked')).map(checkbox => checkbox.value);
        console.log("selectedParticipants = ",selectedParticipants)

        const uncheckedParticipants = Array.from(participantsContainer.querySelectorAll('input[type=checkbox]:not(:checked)')).map(checkbox => checkbox.value)
        console.log("unselectedParticipants", uncheckedParticipants)
        
        axios.post('http://16.171.5.45:3000/add/participants', {
            userIds: selectedParticipants,
            groupId: groupId, 
        })
        .then(response => {
            console.log("addedParticipants",response.data);
            alert('successyfully Added Participants')
            // Handle success
        })
        .catch(error => {
            console.error(error);
            //alert('error with alredy a member or some thing')
            // Handle error
        });

       const removeParticipants = axios.post('http://16.171.5.45:3000/remove/participants',{
        userIds: uncheckedParticipants,
        groupId: groupId
       }).then((response)=>{
        console.log("success")
       })

    });

    participantsContainer.appendChild(submitBtn);
}
 });




 const groupMembersButton = document.getElementById('seeAllMemberOfThisGroup');
const groupMembersContainer = document.getElementById('groupMembersContainer'); // Assuming you have an HTML element to display the group members

groupMembersButton.addEventListener('click', async () => {
    try {
        // Make a request to your server to get the group members
        const groupId = localStorage.getItem('groupId'); // Replace 'yourGroupId' with the actual group ID
        const groupMembersResponse = await axios.get(`http://16.171.5.45:3000/groups/${groupId}/members`,);
        const groupMembersData = groupMembersResponse.data;

        // Clear previous content in the container
        groupMembersContainer.innerHTML = '';

        // Display the group members' names
        groupMembersData.forEach((member) => {
            const memberName = document.createElement('p');
            memberName.textContent = member.name; // Assuming your member object has a 'name' property

            // Append the member name to the container
            groupMembersContainer.appendChild(memberName);
        });
    } catch (error) {
        console.error('Error fetching group members:', error);
    }
});

async function makeAdmin(userId,groupId){
    const Ids = {
        userId: userId,
        groupId: groupId
    }
    const adminMember = await axios.post('http://16.171.5.45:3000/user/makeAdmin',Ids)
    if(adminMember.data.message === 'Now Admin'){
        alert('successfully added admin')
    }else{
        alert('Make user Participant of group than admin')
    }

}

