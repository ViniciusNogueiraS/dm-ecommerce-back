const Cliente = require('./cliente-model');
const Endereco = require('../endereco/endereco-model');

const LoginDao = require('./login-dao');
const ClienteDao = require('./cliente-dao');

const verificaCliente = require('../../helpers/verifyCliente');

//---------------importações-------------------

function controlador(app){

  app.get('/cliente', function (req, res) {
    let clienteDao = new ClienteDao();
  
    clienteDao.getAllClientes(res);
  });

  app.post('/login', function (req, res) {//Pode logar Cliente ou Administrador
    let loginDao = new LoginDao();
  
    loginDao.login(res, req.body.email, req.body.senha);
  });
  
  app.post('/logout', function (req, res) {
    res.json({ auth: false, token: null });
  });
  
  app.post('/cadastro', function (req, res) {
  
    if (verificaCliente(req.body.cliente)) {
  
      let endereco = new Endereco(req.body.cliente.endereco);
  
      let clienteDao = new ClienteDao();
      let cliente = new Cliente({
        nome: req.body.cliente.nome,
        email: req.body.cliente.email,
        senha: req.body.cliente.senha,
        telefone: req.body.cliente.telefone,
        cpf: req.body.cliente.cpf,
        num_cartao: req.body.cliente.num_cartao,
        data_validade: req.body.cliente.data_validade,
        codigo_seguranca: req.body.cliente.codigo_seguranca,
        endereco
      });
  
      clienteDao.persistCliente(res, cliente);
    } else {
      res.status(401).json({ auth: false, message: "POR FAVOR, PREENCHA TODOS OS CAMPOS!" });
    }
  });
}
module.exports = controlador;