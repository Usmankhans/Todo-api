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
	res.json(todos);
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
todos.push(body)
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


app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});