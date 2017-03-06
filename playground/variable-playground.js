// var person = {
// 	name : 'andrew',
// 	age: 21
// };

// function updatePerson (obj){
// 	obj.age =24
// }
// updatePerson(person);
// console.log(person);

//Array example
var grades = [15,37];
function addgrade(Array){
	Array = [12,13];
}
function addgradepush(Array){
	Array.push(12);
}
addgrade(grades);
console.log(grades);

addgradepush(grades);
console.log('With push ' + grades);