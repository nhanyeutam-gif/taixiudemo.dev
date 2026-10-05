// ==================================================
//  NGUYỄN NGỌC VĂN — Chủ Hệ Thống
// ==================================================
const bcrypt = require('bcryptjs');
const htmlspecialchars = require('htmlspecialchars');

function int(str){return parseInt(str)||0}
function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function makeid(l=6){let r='';for(let i=0;i<l;i++)r+=String.fromCharCode(65+Math.floor(Math.random()*26));return r}
function numberWithCommas(x){return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}
function thoigianget(){process.env.TZ='Asia/Ho_Chi_Minh';const d=new Date();return{ngay:d.getDate(),thang:d.getMonth()+1,nam:d.getFullYear(),ngaythangnam:`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`,thoigian:Date.now()}}
function generateHash(p){return bcrypt.hashSync(p,10)}
function validPassword(p,h){return bcrypt.compareSync(p,h)}

module.exports = {
    int, rand, az:makeid, time:thoigianget, html:htmlspecialchars,
    password:generateHash, checkpassword:validPassword, number_format:numberWithCommas
};
