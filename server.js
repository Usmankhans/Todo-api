var express = require('express');
var app= express();
var bodyParser = require('body-parser');
var _ =require('underscore');

var PORT = process.env.PORT || 3000;
var todos =[];
var todoNextId = 1;
app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('Todo API Root');
});

//Get Todos
app.get('/todos', function(req, res){
	var queryParams = req.query;
	var filteredTodos = todos;

if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true')
{
	filteredTodos = _.where(filteredTodos, {completed: true});
}
else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false' )
{
	filteredTodos = _.where(filteredTodos, {completed: false});
	
}
if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0)
{
	filteredTodos = _.filter(filteredTodos, function (filteredTodos){
		return filteredTodos.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
	});
}

res.json(filteredTodos);
});

//Get Todos by Id
app.get('/todos/:id', function(req, res){
var todoId = parseInt(req.params.id,10);
var found= _.findWhere(todos, {id: todoId});

if(found){
	res.json(found);
}
else{
	res.status(404).send();
}
});

//Post Todos

app.post('/todos', function (req,res){
var body = _.pick(req.body, 'description', 'completed', 'id') ;

if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
return res.status(404).send();	
}

body.description = body.description.trim();

body.id = todoNextId++;
todos.push(body);
res.json(body);

});


//Delete Todos by Id
app.delete('/todos/:id', function(req, res){
var todoId = parseInt(req.params.id,10);
var found= _.findWhere(todos, {id: todoId});
if(!found){
	res.status(404).json({"error": "No todo item found for delete"});
}
else{
	todos = _.without(todos, found);
res.json(found);
}
});

//PUT Todos by id

app.put('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id,10);
var found= _.findWhere(todos, {id: todoId});
var body = _.pick(req.body, 'description', 'completed', 'id') ;
var validAttributes = {};

if(!found){
	return res.status(404).send();
}


if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
validAttributes.completed = body.completed;
}
else if(body.hasOwnProperty('completed')){
	return res.status(400).send();
}
if(body.hasOwnProperty('description') && _.isString(body.description) &&  body.description.trim().length > 0){
validAttributes.description = body.description;
}
else if(body.hasOwnProperty('description')){
	return res.status(400).send();
}

//HERE update
_.extend(found, validAttributes);
res.json(found);

});

app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});