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

//model
const Endereco = require('./src/model/Endereco');
const Cliente = require('./src/model/Cliente');
const Produto = require('./src/model/Produto');
const Pedido = require('./src/model/Pedido');
const Visitante = require('./src/model/Visitante');

//dao
const LoginDao = require('./src/dao/LoginDao');
const VisitanteDao = require('./src/dao/VisitanteDao');
const ClienteDao = require('./src/dao/ClienteDao');
const ProdutoDao = require('./src/dao/ProdutoDao');
const CarrinhoDao = require('./src/dao/CarrinhoDao');
const PedidoDao = require('./src/dao/PedidoDao');
const VisitanteDao = require('./src/dao/VisitanteDao');
const EnderecoDao = require('./src/dao/EnderecoDao');

// ============ Middleare de Autenticação =================

var authMiddleare = function (req, res, next) {
  //endpoints que não precisam de autenticação
  if (req.path == '/public') return next();
  if (req.path == '/') return next();
  if (req.path == '/login') return next();
  if (req.path == '/cadastro') return next();
  if (req.path == '/produto') return next();
  if (req.path == '/pedido') return next();

  var token = req.headers['x-access-token'];

  if (!token) res.status(401).json({ auth: false, message: 'TOKEN NÃO EXISTENTE!' });

  jwt.verify(token, secret, function (err, decoded) {
    if (err) res.status(500).json({ auth: false, message: 'FALHA NO TOKEN DE AUTENTICAÇÃO!' });

    next();
  });
}

// ======================================================

app.use(express.static('public'));//Diretório público
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(authMiddleare);

// Upload de arquivos

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
  next()
});

app.listen(3000, function () {
  console.log('DIRETÓRIO DA APLICAÇÃO:', __dirname);
  console.log("servindo em localhost:3000...");
  //SERVIDOR OUVINDO A APLICAÇÃO
});

//--------------------endpoints-------------------------

app.get('/', function (req, res) {
  res.send("Servindo em localhost:3000... ◙ Aplicação BackEnd");
});

app.post('/login', function (req, res) {//Pode logar Cliente ou Administrador
  let loginDao = new LoginDao();

  loginDao.login(res, req.body.email, req.body.senha);
});

app.post('/logout', function (req, res) {
  res.json({ auth: false, token: null });
});

app.post('/cadastro', function (req, res) {

  if(
    req.body.nome != '' && req.body.nome != undefined ||
    req.body.email != '' && req.body.email != undefined ||
    req.body.senha != '' && req.body.senha != undefined ||
    req.body.telefone != '' && req.body.telefone != undefined ||
    req.body.cpf != '' && req.body.cpf != undefined ||
    req.body.num_cartao != '' && req.body.num_cartao != undefined ||
    req.body.data_validade != '' && req.body.data_validade != undefined ||
    req.body.codigo_seguranca != '' && req.body.codigo_seguranca != undefined ||
    req.body.endereco.rua != '' && req.body.endereco.rua != undefined ||
    req.body.endereco.numero != '' && req.body.endereco.numero != undefined ||
    req.body.endereco.bairro != '' && req.body.endereco.bairro != undefined ||
    req.body.endereco.cidade != '' && req.body.endereco.cidade != undefined ||
    req.body.endereco.uf != '' && req.body.endereco.uf != undefined){
    
    let endereco = new Endereco(req.body.endereco);
    
    let clienteDao = new ClienteDao();
    let cliente = new Cliente({
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      telefone: req.body.telefone,
      cpf: req.body.cpf,
      endereco
    });

    clienteDao.persistCliente(res, cliente);
  }else{
    res.status(401).json({ auth: false, message: "POR FAVOR, PREENCHA TODOS OS CAMPOS!"});
  }
});


//CLIENTE
app.get('/cliente', function (req, res) {
  let clienteDao = new ClienteDao();

  clienteDao.getAllClientes(res);
});




//CRUD PRODUTO
app.get('/produto', function (req, res) {
  let produtoDao = new ProdutoDao();

  if (req.query.idproduto) {
    produtoDao.getProdutoById(res, req.query.idproduto);
  } else if (req.query.pesquisa) {
    produtoDao.searchProdutos(res, req.query.pesquisa);
  } else if (req.query.categoria) {
    produtoDao.getProdutosByCategoria(res, req.query.categoria);
  }else {
    produtoDao.getAllProdutos(res);
  }
});

//upload de imagem
app.post('/produtoUpFile', function (req, res) {

});

app.post('/produtoADM', function (req, res) {
  let produtoDao = new ProdutoDao();
  let produto = new Produto({
    nome: req.body.nome,
    categoria: req.body.categoria,
    preco: req.body.preco,
    desconto: req.body.desconto,
    preco_descontado: req.body.preco_descontado,
    descricao: req.body.descricao,
    imagem: req.body.imagem
  });

  produtoDao.persistProduto(res, produto);
});

app.put('/produtoADM', function (req, res) {
  let produtoDao = new ProdutoDao();
  let produto = new Produto({
    idproduto: req.body.idproduto,
    nome: req.body.nome,
    categoria: req.body.categoria,
    preco: req.body.preco,
    desconto: req.body.desconto,
    preco_descontado: req.body.preco_descontado,
    descricao: req.body.descricao,
    imagem: req.body.imagem
  });

  produtoDao.uploadProdutoById(res, produto);
});

app.delete('/produtoADM', function (req, res) {
  let produtoDao = new ProdutoDao();

  produtoDao.deleteProdutoById(res, req.query.idproduto);
});

//CARRINHO
app.get('/carrinho', function (req, res) {
  let carrinhoDao = new CarrinhoDao();

  carrinhoDao.getCarrinho(res, req.query.id_cliente);
});

app.get('/confirmaCarrinho', function (req, res) {
  let carrinhoDao = new CarrinhoDao();

  carrinhoDao.confirmaProdutoNoCarrinho(res, req.query.id_cliente, req.query.id_produto);
});

app.post('/carrinho', function (req, res) {
  let carrinhoDao = new CarrinhoDao();

  carrinhoDao.addAoCarrinho(res, req.body.id_cliente, req.body.id_produto);
});
/*
app.put('/carrinho', function(req, res){

});
*/
app.delete('/carrinho', function (req, res) {
  let carrinhoDao = new CarrinhoDao();

  carrinhoDao.remDoCarrinho(res, req.query.id_cliente, req.query.id_produto);
});



//CRUD PEDIDO

app.get('/pedido', function (req, res) {
  let pedidoDao = new PedidoDao();

  if (req.query.id_cliente) {
    pedidoDao.getPedidoByCliente(res, req.query.id_cliente);
  } else {
    pedidoDao.getAllPedidos(res);
  }
});

app.post('/pedido', function (req, res) {
  let pedidoDao = new PedidoDao();

  if (req.body.id_cliente) {// PEDIDO DE CLIENTE
    if (req.body.enderecoCad) {

      let pedido = new Pedido({
        cliente: req.body.cliente,
        endereco: req.body.endereco,
        forma_pagamento: req.body.forma_pagamento,
        num_cartao: req.body.cliente.num_cartao,
        data_validade: req.body.cliente.data_validade,
        codigo_seguranca: req.body.cliente.codigo_seguranca,
        status: req.body.status
      });

      pedidoDao.persistPedidoCliente(res, pedido);

    }else if (
    req.body.endereco.rua != '' && req.body.endereco.rua != undefined ||
    req.body.endereco.numero != '' && req.body.endereco.numero != undefined ||
    req.body.endereco.bairro != '' && req.body.endereco.bairro != undefined ||
    req.body.endereco.cidade != '' && req.body.endereco.cidade != undefined ||
    req.body.endereco.uf != '' && req.body.endereco.uf != undefined){

      let enderecoDao = new EnderecoDao();
      let endereco = new Endereco(req.body.endereco);

      enderecoDao.persistEnderecoCliente(endereco, req.body.cliente.idusuario);

      let pedido = new Pedido({
        cliente: req.body.cliente,
        endereco,
        forma_pagamento: req.body.forma_pagamento,
        num_cartao: req.body.cliente.num_cartao,
        data_validade: req.body.cliente.data_validade,
        codigo_seguranca: req.body.cliente.codigo_seguranca,
        status: req.body.status
      });

      pedidoDao.persistPedidoCliente(res, pedido);
    }
    
  }else if (// PEDIDO DE VISITANTE
  req.body.nome != '' && req.body.nome != undefined ||
  req.body.email != '' && req.body.email != undefined ||
  req.body.telefone != '' && req.body.telefone != undefined ||
  req.body.cpf != '' && req.body.cpf != undefined ||
  req.body.num_cartao != '' && req.body.num_cartao != undefined ||
  req.body.data_validade != '' && req.body.data_validade != undefined ||
  req.body.codigo_seguranca != '' && req.body.codigo_seguranca != undefined ||
  req.body.endereco.rua != '' && req.body.endereco.rua != undefined ||
  req.body.endereco.numero != '' && req.body.endereco.numero != undefined ||
  req.body.endereco.bairro != '' && req.body.endereco.bairro != undefined ||
  req.body.endereco.cidade != '' && req.body.endereco.cidade != undefined ||
  req.body.endereco.uf != '' && req.body.endereco.uf != undefined) {
    
    
    let visitanteDao = new VisitanteDao();
    let visitante = new Visitante({
      nome: req.body.nome,
      email: req.body.email,
      telefone: req.body.telefone,
      cpf: req.body.cpf
    });
    
    var idNewVisitante = visitanteDao.persistVisitante(visitante);
    
    let enderecoDao = new EnderecoDao();
    let endereco = new Endereco(req.body.endereco);
    
    var idNewEndereco = enderecoDao.persistEnderecoVisitante(endereco, idNewVisitante);

    if (idNewVisitante && idNewEndereco) {
      let pedido = new Pedido({
        visitante,
        endereco,
        forma_pagamento: req.body.forma_pagamento,
        num_cartao: req.body.num_cartao,
        data_validade: req.body.data_validade,
        codigo_seguranca: req.body.codigo_seguranca,
        status: req.body.status
      });
  
      pedidoDao.persistPedidoVisitante(res, pedido);
    }else{
      res.status(401).json({ auth: false, message: 'ERRO AO REALIZAR PEDIDO!' });
    }
  }
});
