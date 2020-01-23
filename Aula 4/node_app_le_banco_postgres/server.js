//Config Express
var PORT = process.env.PORT || 3000;
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require('request')
var fs = require('fs');
require('dotenv').config()
const {Client} = require("pg");
const client = new Client({
	"user": "postgres",
	"password": "postgres",
	"host": "localhost",
	"port": 5432,
	"database": "universidade"
});

var http = require('http');

//App init
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors()); 

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/static', express.static('public'));

//Serviços da API
app.get('/', function (req, res){
  var dados = {status: "ok", app: "running"};

  res.send(JSON.stringify(dados));
});

app.get('/db',  async function(req,res){
	var result = await start();	
	await sleep(3000);
    res.send(result);
    console.log(result);
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   


async function start(){
	await connect();
	var out;
	client.query('SELECT * from public."Aluno"', (err, res) => {
	  if (err) {
	    console.log(err.stack)
	    out = "erro";
	  } else {
	    console.log(res.rows[0])
	    out = res.rows[0];   
	  }
	});
	return out;
}




async function connect(){
	try{
		await client.connect();
		console.log("conectado com sucesso");
	} catch(e){
		//console.log(`erroe de conexao com banco: \n ${e}`);
		console.log("erroe de conexao com banco: \n "+e);
	}
}

//Porta padrão da aplicação
app.listen(PORT, function (){
	console.log('Second server listening on port 3000!');
});
