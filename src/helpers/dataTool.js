function dataNow(){
    var today = new Date();
    var day = today.getDate();
    var month = (today.getMonth() + 1);
    var year = today.getFullYear();

    return ""+year+"-"+month+"-"+day;
}
module.exports = dataNow;