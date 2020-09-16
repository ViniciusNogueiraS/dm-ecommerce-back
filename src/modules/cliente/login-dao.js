const jwt = require('jsonwebtoken');
const secret = "hash";

const Cliente = require('./cliente-model');
const Endereco = require('../endereco/endereco-model');

const executeSQL = require('../../helpers/exeSQL');

class LoginDao {
  constructor() {
  }

  login(res, email, senha) {
    try {
      executeSQL('SELECT idusuario FROM ecommerce.usuario WHERE email = "' + email + '" AND senha = "' + senha + '";').then(verificaUsuario => {
        if (verificaUsuario[0] != undefined) {//usuario existente
          executeSQL('SELECT id_usuario FROM ecommerce.cliente WHERE id_usuario = ' + verificaUsuario[0].idusuario + ';').then(verificaCliente => {
            if (verificaCliente[0] != undefined) {//cliente existente
              executeSQL('SELECT u.*, c.*, e.* FROM ecommerce.usuario u INNER JOIN ecommerce.cliente c ON c.id_usuario = u.idusuario INNER JOIN ecommerce.endereco e ON e.id_cliente = u.idusuario WHERE idusuario = ' + verificaCliente[0].id_usuario + ';').then(loginCliente => {
                var endereco = new Endereco({
                  idendereco: loginCliente[0].idendereco,
                  rua: loginCliente[0].rua,
                  numero: loginCliente[0].numero,
                  referencia: loginCliente[0].referencia,
                  bairro: loginCliente[0].bairro,
                  cidade: loginCliente[0].cidade,
                  uf: loginCliente[0].uf
                });
                
                var cliente = new Cliente({
                  idusuario: loginCliente[0].idusuario,
                  nome: loginCliente[0].nome,
                  email: loginCliente[0].email,
                  senha: loginCliente[0].senha,
                  telefone: loginCliente[0].telefone,
                  cpf: loginCliente[0].cpf,
                  num_cartao: loginCliente[0].num_cartao,
                  data_validade: loginCliente[0].data_validade,
                  codigo_seguranca: loginCliente[0].codigo_seguranca,
                  endereco
                });
  
                var token = jwt.sign({ cliente: cliente }, secret, { expiresIn: 3000 });
                return res.json({ auth: true, cliente, token });//cliente logado!
              });
            }else {//administrador existente
              executeSQL('SELECT u.*, a.cargo FROM ecommerce.usuario u INNER JOIN ecommerce.administrador a ON a.id_usuario = u.idusuario;').then(loginAdministrador => {
                var token = jwt.sign({ administrador: loginAdministrador[0] }, secret, { expiresIn: 6000 });
                res.json({ auth: true, administrador: loginAdministrador[0], token });//administrador logado!
              });
            }
          });
        }else {
          res.status(401).json({ auth: false, message: 'EMAIL OU SENHA INCORRETOS!' });
        }
      });
    }
    catch(err) {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO REALIZAR LOGIN! => "+err});
    }
  }

}
module.exports = LoginDao;