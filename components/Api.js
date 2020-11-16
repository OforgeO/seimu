let base_url = 'http://153.127.14.125:5010/';
let chat_url = 'http://153.127.14.125:5011/';
//let base_url = 'http://192.168.8.55:5010/';
//let chat_url = 'http://192.168.8.55:5011/';
let _headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

function createCall(path, data = null, token = null, headers = {}, method = 'POST', type = 0) {
    const merged = {
        ..._headers,
        ...headers,
    };

    let body = {};
    if (data) {
        body = {
            ...body,
            ...data,
        };
    }
    if (token) {
        body.api_token = token;
    }
    let strData = JSON.stringify({data: body});
    if(type == 0){
        return fetch(
            `${base_url}${path}`, {
                method,
                headers: merged,
                body: strData,
            },
        ).then((resp) => resp.json());
    }else{
        return fetch(
            `${chat_url}${path}`, {
                method,
                headers: merged,
                body: JSON.stringify(data),
            },
        ).then((resp) => resp.json());
    }
    
}

export function signIn(userId, password){
    return createCall(
        'app/login',
        {userId, password}
    );
}
export function createEvent(todoList, userId){
    return createCall(
        'app/createEvent',
        {todoList, userId}
    )
}
export function getEvents(userId){
    return createCall(
        'app/getEvents',
        {userId}
    )
}
export function changePwd(userId, pwd, newPwd){
    return createCall(
        'app/changePwd',
        {userId, pwd, newPwd}
    )
}
export function deleteEvent(curTask){
    return createCall(
        'app/deleteEvent',
        curTask
    )
}
export function updateEvent(curTask){
    return createCall(
        'app/updateEvent',
        curTask
    )
}
export function getQAList(){
    return createCall(
        'app/getQAList'
    )
}
export function sendMsg(obj){
    return createCall(
        'post_msg',
        obj,
        null,
        {},
        'POST',
        1
    )
}
export function editProfile(obj){
    return createCall(
        'app/editProfile',
        obj
    ) 
}
export function signup(obj){
    return createCall(
        'app/signup',
        obj
    ) 
}
export function getUserInfo(email){
    return createCall(
        'app/getUserInfo',
        {email}
    )
}
export function getPopups(userId){
    return createCall(
        'app/getPopups',
        {userId}
    )
}
export function eventView(userId, eventId){
    return createCall(
        'app/eventView',
        {userId, eventId}
    )
}
export function forgotPwd(email){
    return createCall(
        'app/forgotPwd',
        {email}
    )
}
export function closeAccount(id, reason){
    return createCall(
        'app/closeAccount',
        {id, reason}
    )
}
export function getEventDetails(userId, eventId){
    return createCall(
        'app/getEventDetails',
        {userId, eventId}
    )
}
export function callZip(postCode){
    return fetch(
        "https://yubinbango.github.io/yubinbango-data/data/"+postCode+".js", {
            method : 'GET',
            redirect: 'follow'
        },
    ).then(response => response.text())
    .catch(error => console.log('error', error));
}

export function getNewTsurumi(){
    return fetch(
        "https://www.seimu.co.jp/bknnewtsurumi/"
    ).then(response => response.text())
    .catch(error => console.log('error', error));
}

export function getNewOsaka(){
    return fetch(
        "https://www.seimu.co.jp/bknnewosaka/"
    ).then(response => response.text())
    .catch(error => console.log('error', error));
}

export function getPopTsurumi(){
    return fetch(
        "https://www.seimu.co.jp/rankingtsurumi/"
    ).then(response => response.text())
    .catch(error => console.log('error', error));
}

export function getPopOsaka(){
    return fetch(
        "https://www.seimu.co.jp/rankingosaka/"
    ).then(response => response.text())
    .catch(error => console.log('error', error));
}
export function getQuestion(step){
    return createCall(
        'app/getQuestion',
        {step}
    )
}