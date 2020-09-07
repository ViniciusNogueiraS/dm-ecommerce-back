const express = require('express');
const jwt = require('jsonwebtoken');
const secret = "hash";
const cors = require('cors');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./src/DbConnection');
const multer = require('multer');
const port = process.env.PORT || 3000;

var cliente_controller = require('./src/modules/cliente/cliente-router');
var produto_controller = require('./src/modules/produto/produto-router');
var carrinho_controller = require('./src/modules/carrinho/carrinho-router');
var pedido_controller = require('./src/modules/pedido/pedido-router');

// ============ Middleare de Autenticação =================

var authMiddleare = function (req, res, next) {
  //endpoints que não precisam de autenticação
  if (req.path == '/public') return next();
  if (req.path == '/') return next();
  if (req.path == '/login') return next();
  if (req.path == '/cadastro') return next();
  if (req.path == '/busca') return next();
  if (req.path == '/produto') return next();
  if (req.path == '/pedido') return next();
  
  var token = req.headers['x-access-token'];
  
  if (!token) res.status(401).json({ auth: false, message: 'TOKEN NÃO EXISTENTE!' });
  
  jwt.verify(token, secret, function (err, decoded) {
    if (err) res.status(500).json({ auth: false, message: 'FALHA NO TOKEN DE AUTENTICAÇÃO!' });
    
    next();
  });
}

app.use(express.static('public'));//Diretório público
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(authMiddleare);

// =============== Upload de Arquivos ===================

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

let upload = multer({ storage });

app.post('/uploadProfile', upload.single('img'), (req, res) => {
  res.send(req.file);
});

// ======================================================

app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.listen(3000, function () {
  console.log('DIRETÓRIO DA APLICAÇÃO:', __dirname);
  console.log("servindo em localhost:3000...");
});

app.get('/', function (req, res) {
  res.send("Servindo em localhost:3000... ◙ Aplicação BackEnd");
});

//Rotas
cliente_controller(app);
produto_controller(app);
carrinho_controller(app);
pedido_controller(app);
