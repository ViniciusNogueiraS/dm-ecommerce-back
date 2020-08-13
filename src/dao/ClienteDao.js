const executeSQL = require('../helpers/exeSQL');
const dataNow = require('../helpers/dataTool');
const Endereco = require('../model/Endereco');
const EnderecoDao = require('./EnderecoDao');

class ClienteDao {
  constructor() {
  }

  getAllClientes(res){
    executeSQL('SELECT u.idusuario, u.nome, u.email, u.telefone, c.cpf FROM ecommerce.usuario u INNER JOIN ecommerce.cliente c ON c.id_usuario = u.idusuario', (clientes) => {
      res.json(clientes);
    });
  }

  getClienteById(res, idusuario){
    executeSQL('SELECT u.*, c.cpf FROM ecommerce.usuario u INNER JOIN ecommerce.cliente c ON c.id_usuario = u.idusuario WHERE idusuario = '+idusuario+';', (clienteSemEnd) => {
      var enderecoDao = new EnderecoDao();
      var endereco = new Endereco(enderecoDao.getEnderecoByCliente(idusuario));

      var cliente = new Cliente({
        idusuario: clienteSemEnd[0].idusuario,
        nome: clienteSemEnd[0].nome,
        email: clienteSemEnd[0].email,
        senha: clienteSemEnd[0].senha,
        telefone: clienteSemEnd[0].telefone,
        cpf: clienteSemEnd[0].cpf,
        endereco
      });

      res.json(cliente);
    });
  }

  persistCliente(res, cliente){
    executeSQL('SELECT idusuario FROM ecommerce.usuario WHERE email = "'+cliente.email+'";', (verificaCliente) => {
      if (verificaCliente[0] != undefined) {
        res.status(401).json({ auth: false, message: "ESTE EMAIL JÁ ESTÁ SENDO UTILIZADO POR OUTRO USUÁRIO!"});
      }else {
        //inserindo novo usuario
        executeSQL('INSERT INTO ecommerce.usuario(nome, email, senha, telefone, data_cadastro) VALUES("'+cliente.nome+'", "'+cliente.email+'", "'+cliente.senha+'", "'+cliente.telefone+'", "'+dataNow()+'");', (newUsuario) => {
          console.log(newUsuario);
          //inserindo novo cliente
          executeSQL('INSERT INTO ecommerce.cliente(cpf, id_usuario) VALUES("'+cliente.cpf+'", '+newUsuario.insertId+');', (newCliente) => {
            //inserindo novo endereco
            var enderecoDao = new EnderecoDao();
            enderecoDao.persistEnderecoCliente(cliente.endereco, newUsuario.insertId);
            
            res.json({ auth: false, message: "USUÁRIO CADASTRADO COM SUCESSO!"});
          });
        });
      }
    });
  }

}
module.exports = ClienteDao;
