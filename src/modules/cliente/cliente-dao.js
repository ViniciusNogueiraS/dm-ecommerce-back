const Endereco = require('../endereco/endereco-model');
const EnderecoDao = require('../endereco/endereco-dao');

const executeSQL = require('../../helpers/exeSQL');
const dataNow = require('../../helpers/dataTool');

class ClienteDao {
  constructor() {
  }

  getAllClientes(res){
    executeSQL('SELECT u.idusuario, u.nome, u.email, u.telefone, c.cpf, c.num_cartao, c.data_validade, c.codigo_seguranca FROM ecommerce.usuario u INNER JOIN ecommerce.cliente c ON c.id_usuario = u.idusuario;').then(clientes => {
      res.json(clientes);
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO PROJETAR CLIENTES! => "+err});
    });
  }

  getClienteById(res, idusuario){
    executeSQL('SELECT u.*, c.cpf, c.num_cartao, c.data_validade, c.codigo_seguranca FROM ecommerce.usuario u INNER JOIN ecommerce.cliente c ON c.id_usuario = u.idusuario WHERE idusuario = '+idusuario+';').then(clienteSemEnd => {
      var enderecoDao = new EnderecoDao();
      var endereco = new Endereco(enderecoDao.getEnderecoByCliente(idusuario));

      var cliente = new Cliente({
        idusuario: clienteSemEnd[0].idusuario,
        nome: clienteSemEnd[0].nome,
        email: clienteSemEnd[0].email,
        senha: clienteSemEnd[0].senha,
        telefone: clienteSemEnd[0].telefone,
        cpf: clienteSemEnd[0].cpf,
        num_cartao: clienteSemEnd[0].num_cartao,
        data_validade: clienteSemEnd[0].data_validade,
        codigo_seguranca: clienteSemEnd[0].codigo_seguranca,
        endereco
      });

      res.json(cliente);
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO PROJETAR CLIENTE! => "+err});
    });
  }

  persistCliente(res, cliente){
    executeSQL('SELECT idusuario FROM ecommerce.usuario WHERE email = "'+cliente.email+'";').then(verificaCliente => {
      if (verificaCliente[0] != undefined) {
        res.status(401).json({ auth: false, message: "ESTE EMAIL JÁ ESTÁ SENDO UTILIZADO POR OUTRO USUÁRIO!"});
      }else {
        //inserindo novo usuario
        executeSQL('INSERT INTO ecommerce.usuario(nome, email, senha, telefone, data_cadastro) VALUES("'+cliente.nome+'", "'+cliente.email+'", "'+cliente.senha+'", "'+cliente.telefone+'", "'+dataNow()+'");').then(newUsuario => {
          //inserindo novo cliente
          executeSQL('INSERT INTO ecommerce.cliente(cpf, num_cartao, data_validade, codigo_seguranca, id_usuario) VALUES("'+cliente.cpf+'", "'+cliente.num_cartao+'", "'+cliente.data_validade+'", "'+cliente.codigo_seguranca+'", '+newUsuario.insertId+');').then(newCliente => {
            //inserindo novo endereco
            var enderecoDao = new EnderecoDao();

            enderecoDao.persistEnderecoCliente(cliente.endereco, newUsuario.insertId);
            
            res.json({ auth: false, message: "USUÁRIO CADASTRADO COM SUCESSO!"});
          })
          .catch(err => {
            res.status(401).json({ auth: false, message: "FALHA AO INSERIR CLIENTE! => "+err});
          });
        })
        .catch(err => {
          res.status(401).json({ auth: false, message: "FALHA AO INSERIR USUÁRIO! => "+err});
        });
      }
    })
    .catch(err => {
      res.status(401).json({ auth: false, message: "FALHA AO VERIFICAR EMAIL! => "+err});
    });
  }

}
module.exports = ClienteDao;
