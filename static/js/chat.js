const ORIGIN = window.location.origin;

const api = {
    allUsers: ORIGIN+'/users',
    addUser: ORIGIN+'/new-user',
    deletUser: ORIGIN+'/user',
    oneUser: ORIGIN+'/user',
    updateUser: ORIGIN+'/user'
}


const userList = document.getElementById('user_list');


const allUser = async () => {
    
    const response = await fetch(api.allUsers, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const res = await response.json();


    if (res.length >= 1) {

        let output = '';
        
        res?.map((val) => {

            output += `
            <div class="flex flex-row py-2 px-2 items-center border-b-2 hover:bg-gray-100 cursor-pointer" onclick="toUserId(${val.id})">
                <div class="w-10 h-10 bg-gray-300 rounded-full p-3 text-sm flex items-center justify-center mr-3">
                    V
                </div>
                <div class="w-full">
                    <div class="text-lg font-semibold">${val?.first_name}</div>
                    <span class="text-gray-500 text-sm">${val?.email}</span>
                </div>
            </div>
            `;
        })

        userList.innerHTML = output
    }
}


allUser()


function toUserId(id) {
    console.log(id);
}