
const ORIGIN = window.location.origin;

const api = {
    allUsers: ORIGIN+'/users',
    addUser: ORIGIN+'/new-user',
    deletUser: ORIGIN+'/user',
    oneUser: ORIGIN+'/user',
    updateUser: ORIGIN+'/user'
}

const loader = document.getElementById('loader');
const tbody = document.getElementById('tbody');
const user_table = document.getElementById('user_table');
const message = document.getElementById('message');

// ADD USER VARIABLES
const addUserBtn = document.getElementById('addUserBtn');
const addUserModal = document.getElementById('add_user_modal');
const closeAddUserModal = document.getElementById('close_add_user_modal');

const addUserForm = document.getElementById('add_user_form');
const addUserFirstName = document.getElementById('first_name');
const addUserEmail = document.getElementById('email');
const addUserLoader = document.getElementById('addUserLoader');
const addUserError = document.getElementById('addUserError');


// UPDATE USER VARIABLES
const updateUserModal = document.getElementById('update_user_modal');
const closeUpdateUserModal = document.getElementById('close_update_user_modal');

const updateUserForm = document.getElementById('update_user_form');
const updateUserId = document.getElementById('update_user_id');
const updateFirstName = document.getElementById('update_first_name');
const updateEmail = document.getElementById('update_email');
const updateUserLoader = document.getElementById('updateUserLoader');
const updateUserError = document.getElementById('updateUserError');



// Get all User
const allUser = async () => {
    
    loader.classList.add('active');
    user_table.classList.remove('active');

    const response = await fetch(api.allUsers, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const res = await response.json();

    loader.classList.remove('active');
    user_table.classList.add('active');

    if (res.length >= 1) {

        let output = '';
        
        res?.map((val) => {

            output += `
                <tr class="bg-white border-b ">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                        ${val.id}
                    </th>
                    <td class="px-6 py-4">
                        ${val.first_name}
                    </td>
                    <td class="px-6 py-4">
                        ${val.email}
                    </td>
                    <td class="px-2 py-4">
                        <button type="button" onclick="updateUser(${val.id})">
                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#023e8a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#023e8a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </td>
                    <td class="px-2 py-4">
                        <button type="button" onclick="deleteUser(${val.id})">
                            <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4" stroke="#d90429" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M20.5001 6H3.5" stroke="#d90429" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5" stroke="#d90429" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M9.5 11L10 16" stroke="#d90429" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M14.5 11L14 16" stroke="#d90429" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
        })

        tbody.innerHTML = output
    }else{
        user_table.classList.remove('active');
        message.innerHTML = "No Records"
    }
}


allUser()


// Show Add User Form Modal
addUserBtn.addEventListener('click', () => {
    addUserModal.classList.toggle('active')
})

// Close Add User Form Modal
closeAddUserModal.addEventListener('click', () => {
    addUserModal.classList.remove('active')
})


// Add User Form
addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if(addUserFirstName.value && addUserEmail.value){

        const data = {
            first_name: addUserFirstName.value,
            email: addUserEmail.value
        }

        addUserLoader.classList.add('active');
        const response = await fetch(api.addUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const res = await response.json();

        addUserLoader.classList.remove('active');

        if (res?.error) {
            addUserError.innerHTML = res?.error;
        }

        if (res?.msg){
            addUserModal.classList.remove('active')
            addUserFirstName.value = ''
            addUserEmail.value = ''
            allUser()
        }

    }else{

        addUserError.innerHTML = 'Fields are required!'
    }
})



// Delete User
async function deleteUser(id){
    
    loader.classList.add('active');
    user_table.classList.remove('active');

    const response = await fetch(`${api.deletUser}/${id}`, {
        method: 'DELETE',
    });
    const res = await response.json();

    loader.classList.remove('active');
    user_table.classList.add('active');

    if (res.msg) {
        allUser()
    }
}



// Update autofil the data
async function updateUser(id){
    updateUserModal.classList.add('active')

    updateUserLoader.classList.add('active');

    const response = await fetch(`${api.oneUser}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const res = await response.json();

    updateUserLoader.classList.remove('active');

    if (res?.id && res?.first_name && res?.email) {
        updateUserId.value = res?.id;
        updateFirstName.value = res?.first_name;
        updateEmail.value = res?.email
    }

    if (res?.error) {
        updateUserError.innerHTML = res?.error
    }

}


// Close Update User Form Modal
closeUpdateUserModal.addEventListener('click', () => {
    updateUserModal.classList.remove('active')
})


// Update User Form
updateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if(updateUserId.value && updateFirstName.value && updateEmail.value){

        const data = {
            first_name: updateFirstName.value,
            email: updateEmail.value
        }

        updateUserLoader.classList.add('active');
        const response = await fetch(`${api.updateUser}/${Number(updateUserId.value)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const res = await response.json();

        updateUserLoader.classList.remove('active');

        if (res?.msg) {
            updateUserModal.classList.remove('active')
            allUser()
        }

        if (res?.error) {
            updateUserError.innerHTML = res?.error
        }

    }
})


