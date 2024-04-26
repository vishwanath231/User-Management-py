const ORIGIN = window.location.origin;

const api = {
    allUsers: ORIGIN+'/users',
    allMsg: ORIGIN+'/msg',
    newMsg: ORIGIN+'/new-msg'
}

let FROM_EMAIL;
let TO_EMAIL;
let NAME;
let USER;

const selectFromEmail = document.getElementById('select_from_email');
const chatArea = document.getElementById('chat_area');
const userList = document.getElementById('user_list');
const chatingArea = document.getElementById('chating_area');
const chatHintMsg = document.getElementById('chat_hint_msg');
const msgArea = document.getElementById('msg_area');
const msgSendForm = document.getElementById('msg_sendForm');
const msgInput = document.getElementById('msg_input');
const refreshMsgBtn = document.getElementById('refresh_msg_btn');
const toUserName = document.getElementById('toUserName');



const allUser = async (email) => {
    
    const response = await fetch(api.allUsers, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const res = await response.json();

    USER = res;


    const filterUser = res?.filter((val) =>  val.email !== email);


    if (filterUser.length >= 1) {

        let output = '';
        
        filterUser?.map((val) => {

            output += `
            <div class="flex flex-row py-2 px-2 items-center border-b-2 hover:bg-gray-100 cursor-pointer" onclick="toUserId('${val.email}', '${NAME}')">
                <div class="w-10 h-10 bg-gray-300 rounded-full p-3 font-bold text-lg flex items-center justify-center mr-3">
                    ${val?.first_name.charAt(0)}
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



const selectFromUser = async () => {
    
    const response = await fetch(api.allUsers, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const res = await response.json();


    if (res.length >= 1) {

        let output = `<option value=''>Select From User</option>`;
        
        res?.map((val) => {

            output += `
            <option value='${val.email}'>${val.email}</option>
            `;
        })

        selectFromEmail.innerHTML = output
    }
}

selectFromUser()



selectFromEmail.addEventListener('change', async (e) => {

    if(e.target.value){
        chatArea.classList.add('active');
        FROM_EMAIL = e.target.value;

        const response = await fetch(api.allUsers, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const res = await response.json();

        const filterFromUser = res?.find((val) => val.email === e.target.value)

        NAME = filterFromUser.first_name
         
        allUser(e.target.value)

    }else{
        chatArea.classList.remove('active');

    }
})




async function toUserId(toEmail, name) {

    if (toEmail) {

        TO_EMAIL = toEmail;
        NAME = name;

        
        chatingArea.classList.add('active')
        chatHintMsg.classList.add('active')

        const data = {
            from_email: FROM_EMAIL,
            to_email: toEmail
        }

        const response = await fetch(api.allMsg, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const res = await response.json();

        const filterUser = USER?.find((val) =>  val.email === toEmail);

        toUserName.innerHTML = `${filterUser.first_name} - Chat`

        
        
        if (res.length >= 1) {
            
            let output = '';
            
            res?.map((val) => {
                console.log(NAME === val.name);
    
                output += `
                ${
                    val.name ===  NAME ? 
                    `
                        <div class="flex justify-end mb-4 mr-4">
                            <div>
                                <div class='text-sm mb-1 capitalize'>Me</div>
                                <div class="py-1.5 px-4 rounded shadow-sm bg-[#D9FDD3] text-black text-sm font-bold">
                                    ${val.message}
                                </div>
                                <div class='text-xs text-gray-700'>${timeAgo(val.timestamp)}</div>
                            </div>
                        </div>
                    `:
                    `
                        <div class="flex  justify-start mb-4 mr-4">
                            <div>
                                <div class='text-sm mb-1 capitalize'>${val.name}</div>
                                <div class="py-1.5 px-4 rounded shadow-sm bg-white text-black text-sm font-bold">
                                    ${val.message}
                                </div>
                                <div class='text-xs text-gray-700'>${timeAgo(val.timestamp)}</div>
                            </div>
                        </div>
                    `
                }
                
                `;
            })
    
            msgArea.innerHTML = output;

        }

        if (res?.error) {
            console.log(res?.error);
            msgArea.innerHTML = ''
        }


    }
}



msgSendForm.addEventListener('submit', async(e) => {
    e.preventDefault();


    const data = {
        name: NAME,
        from_email: FROM_EMAIL,
        to_email: TO_EMAIL,
        message: msgInput.value
    }

    const response = await fetch(api.newMsg, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const res = await response.json();

    if (res?.msg) {
        toUserId(data.to_email, NAME)
        msgInput.value = '';
    }
})




refreshMsgBtn.addEventListener('click', () => {
    toUserId(TO_EMAIL, NAME)
})












function timeAgo(timestamp) {
    // Convert the provided timestamp string to a Date object
    const pastDate = new Date(timestamp);

    // Get the current time
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const difference = currentDate - pastDate;

    // Define time intervals in milliseconds
    const intervals = {
        year: 1000 * 60 * 60 * 24 * 365,
        month: 1000 * 60 * 60 * 24 * 30,
        day: 1000 * 60 * 60 * 24,
        hour: 1000 * 60 * 60,
        minute: 1000 * 60,
        second: 1000
    };

    // Calculate the elapsed time in different intervals
    const elapsed = {
        year: Math.floor(difference / intervals.year),
        month: Math.floor(difference / intervals.month),
        day: Math.floor(difference / intervals.day),
        hour: Math.floor(difference / intervals.hour),
        minute: Math.floor(difference / intervals.minute),
        second: Math.floor(difference / intervals.second)
    };

    // Determine the appropriate time unit
    let unit = 'second';
    let value = elapsed.second;
    if (elapsed.minute > 0) {
        unit = 'minute';
        value = elapsed.minute;
    }
    if (elapsed.hour > 0) {
        unit = 'hour';
        value = elapsed.hour;
    }
    if (elapsed.day > 0) {
        unit = 'day';
        value = elapsed.day;
    }
    if (elapsed.month > 0) {
        unit = 'month';
        value = elapsed.month;
    }
    if (elapsed.year > 0) {
        unit = 'year';
        value = elapsed.year;
    }

    // Return the formatted string
    return `${value} ${unit}${value !== 1 ? 's' : ''} ago`;
}