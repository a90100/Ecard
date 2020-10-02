function getTime() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let date = new Date().getDate();
    let hours = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
    let minutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
    let time = year + '年' + month + '月' + date + '日 ' + hours + ':' + minutes;
    return time;
}

module.exports = { getTime };