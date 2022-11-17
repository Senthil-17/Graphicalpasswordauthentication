
var temp = 0;

window.onload = function() {
var oUl = document.getElementById("ul1");
var aLi = oUl.getElementsByTagName("li");
var disX = 0;
var disY = 0;
var minZindex = 1;
var aPos = [];
for (var i = 0; i < aLi.length; i++) {
var t = aLi[i].offsetTop;
var l = aLi[i].offsetLeft;
aLi[i].style.top = t + "px";
aLi[i].style.left = l + "px";
aPos[i] = {
left: l,
top: t
};
aLi[i].index = i;

}
temp = aLi[i];


for (var i = 0; i < aLi.length; i++) {
aLi[i].style.position = "absolute";
aLi[i].style.margin = 0;
setDrag(aLi[i]);
}
//Drag and drop
function setDrag(obj) {
obj.onmouseover = function() {
obj.style.cursor = "move";
}
obj.onmousedown = function(event) {
var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
obj.style.zIndex = minZindex++;
//Calculate the distance between the mouse and the dragged object when the mouse is pressed
disX = event.clientX + scrollLeft - obj.offsetLeft;
disY = event.clientY + scrollTop - obj.offsetTop;
document.onmousemove = function(event) {
//Calculate the position of the div when the mouse is dragged
var l = event.clientX - disX + scrollLeft;
var t = event.clientY - disY + scrollTop;
obj.style.left = l + "px";
obj.style.top = t + "px";
for (var i = 0; i < aLi.length; i++) {
aLi[i].className = "";
}
var oNear = findMin(obj);
if (oNear) {
oNear.className = "active";
}
}
document.onmouseup = function() {

document.onmousemove = null; //Move out the mobile event when the mouse bounces
document.onmouseup = null; //Move out the up event and clear the memory
//Check whether the general collision is in the exchange position
var oNear = findMin(obj);
if (oNear) {
oNear.className = "";
oNear.style.zIndex = minZindex++;
obj.style.zIndex = minZindex++;
startMove(oNear, aPos[obj.index]);
startMove(obj, aPos[oNear.index]);

//Exchange index
oNear.index += obj.index;
obj.index = oNear.index - obj.index;
oNear.index = oNear.index - obj.index;
} else {
 
startMove(obj, aPos[obj.index]);
}
}
clearInterval(obj.timer);
return false; //Prohibition symbol appears in lower version
}
}

//Impact checking
function colTest(obj1, obj2) {
var t1 = obj1.offsetTop;
var r1 = obj1.offsetWidth + obj1.offsetLeft;
var b1 = obj1.offsetHeight + obj1.offsetTop;
var l1 = obj1.offsetLeft;
 
var t2 = obj2.offsetTop;
var r2 = obj2.offsetWidth + obj2.offsetLeft;
var b2 = obj2.offsetHeight + obj2.offsetTop;
var l2 = obj2.offsetLeft;
 
if (t1 > b2 || r1 < l2 || b1 < t2 || l1 > r2) {
return false;
} else {
return true;
}
}

//Pythagorean theorem for distance
function getDis(obj1, obj2) {
var a = obj1.offsetLeft-obj2.offsetLeft;
var b = obj1.offsetTop-obj2.offsetTop;
return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}
//Find the closest
function findMin(obj) {
var minDis = 999999999;
var minIndex = -1;
for (var i = 0; i <aLi.length; i++) {
if (obj == aLi[i]) continue;
if (colTest(obj, aLi[i])) {
var dis = getDis(obj, aLi[i]);
if (dis <minDis) {
minDis = dis;
minIndex = i;
}
}
}
if (minIndex == -1) {
return null;
} else {
return aLi[minIndex];
}
}
}
function getClass(cls) {
var ret = [];
var els = document.getElementsByTagName("*");
for (var i = 0; i <els.length; i++) {
//Judging whether the className of cls exists in els[i]; .indexOf("cls") judges the subscript that cls exists, if the subscript >=0, it exists;
if (els[i].className === cls || els[i].className.indexOf("cls") >= 0 || els[i].className.indexOf(" cls") >= 0 || els[i].className.indexOf(" cls ")> 0) {
ret.push(els[i]);
}
}
return ret;
}
 
function getStyle(obj, attr) {//Solve the JS compatibility problem to obtain the correct attribute value
return obj.currentStyle? obj.currentStyle[attr]: getComputedStyle(obj, false)[attr];
}
 
function startMove(obj, json, fun) {
clearInterval(obj.timer);
obj.timer = setInterval(function() {
var isStop = true;
for (var attr in json) {
var iCur = 0;
// Determine whether the movement is a transparency value
if (attr == "opacity") {
iCur = parseInt(parseFloat(getStyle(obj, attr)) * 100);
} else {
iCur = parseInt(getStyle(obj, attr));
}
var ispeed = (json[attr]-iCur) / 8;
//If the movement speed is greater than 0, round down, if less than 0, round up;
ispeed = ispeed> 0? Math.ceil(ispeed): Math.floor(ispeed);
//Judge whether all exercises are completed
if (iCur != json[attr]) {
isStop = false;
}
//Start of exercise
if (attr == "opacity") {
obj.style.filter = "alpha:(opacity:" + (json[attr] + ispeed) + ")";
obj.style.opacity = (json[attr] + ispeed) / 100;
} else {
obj.style[attr] = iCur + ispeed + "px";
}
}
//Judging whether all are completed
if (isStop) {
clearInterval(obj.timer);
if (fun) {
fun();
}
}
}, 30);
}



function myFunction() {
  const liNodes = []
  const listItemsArray = document.getElementById('ul1').childNodes
  for (var i = 0; i < listItemsArray.length; i++) {
    if (listItemsArray[i].nodeName == "LI") {
      liNodes.push(listItemsArray[i]);
    }
  }
  const listIndex = []
  liNodes.forEach((listNode) => {
    listIndex.push(listNode.index)
  })
  alert(JSON.stringify(listIndex));
}