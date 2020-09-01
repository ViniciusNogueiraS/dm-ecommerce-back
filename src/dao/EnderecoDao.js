const executeSQL = require('../helpers/exeSQL');

class EnderecoDao {
  constructor() {
  }

  getAllEnderecos(){
    return new Promise((act) => {
      try {
        executeSQL('SELECT rua, numero, referencia, bairro, cidade, uf FROM ecommerce.endereco;', (enderecos) => {
          act(enderecos);
        });
      }
      catch(err) {
        console.log(err);
        act(false);
      }
    });
  }

  getEnderecoByCliente(idusuario){
    return new Promise((act) => {
      try {
        executeSQL('SELECT rua, numero, referencia, bairro, cidade, uf FROM ecommerce.endereco WHERE id_cliente = '+idusuario+';', (endereco) => {
          act(endereco[0]);
        });
      }
      catch(err) {
        console.log(err);
        act(false);
      }
    });
  }

  persistEndereco(endereco){
    return new Promise((act) => {
      try {
        //inserindo endereco
        executeSQL('INSERT INTO ecommerce.endereco(rua, numero, referencia, bairro, cidade, uf) VALUES("'+endereco.rua+'", "'+endereco.numero+'", "'+endereco.referencia+'", "'+endereco.bairro+'", "'+endereco.cidade+'", "'+endereco.uf+'");', (newEndereco) => {
          act(newEndereco.insertId);
        });
      }
      catch(err) {
        console.log(err);
        act(false);
      }
    });
  }

  persistEnderecoCliente(endereco, idusuario){
    return new Promise((act) => {
      try {
        //inserindo endereco de cliente
        executeSQL('INSERT INTO ecommerce.endereco(rua, numero, referencia, bairro, cidade, uf, id_cliente) VALUES("'+endereco.rua+'", "'+endereco.numero+'", "'+endereco.referencia+'", "'+endereco.bairro+'", "'+endereco.cidade+'", "'+endereco.uf+'", '+idusuario+');', (newEndereco) => {
          act(newEndereco.insertId);
        });
      }
      catch(err) {
        console.log(err);
        act(err);
      }
    });
  }

}
module.exports = EnderecoDao;
