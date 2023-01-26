
convertToSecs = (millisec) => millisec/1000;
convertToMinutes = (millisec) => millisec/60000;
convertToHours = (millisec) => millisec/3600000;
convertToDays = (millisec) => millisec/(3600000*24);

let howManyDays = (millisec) => {
    let time = millisec;
    let Days = Math.floor(convertToDays(time));
    time -= Days*1000*60*60*24;
    let Hours = Math.floor(convertToHours(time));
    time -= Hours*1000*60*60;
    let Minutes = Math.floor(convertToMinutes(time));
    time -= Minutes*1000*60;
    let Secs = Math.floor(convertToSecs(time));
    time -= Secs*1000;
    tempOutput = `${Days} Days ${Hours} Hours ${Minutes} Minutes ${Secs} Seconds ${time} Milliseconds`;
    return tempOutput;
}

function myFunc(){
    const myBday = new Date(2001, 4, 2);
    const myLoveDay = new Date(2022, 10, 30, 23, 0);
    const nowDate = Date.now();
    let alive =  nowDate - myBday;
    let myLove = nowDate - myLoveDay;
    document.getElementById('time1').innerHTML = `How long am I alive: ${howManyDays(alive)}`;
    document.getElementById('time2').innerHTML = `How long since my love: ${howManyDays(myLove)}`;
}

const myInterval = setInterval(myFunc,50);

function myStopFunc(){
    clearInterval(myInterval);
}