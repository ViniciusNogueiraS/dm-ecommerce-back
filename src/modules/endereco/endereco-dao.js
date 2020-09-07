const executeSQL = require('../../helpers/exeSQL');

class EnderecoDao {
  constructor() {
  }

  getAllEnderecos(){
    return new Promise((resolve, reject) => {
      try {
        executeSQL('SELECT rua, numero, referencia, bairro, cidade, uf FROM ecommerce.endereco;', (enderecos) => {
          resolve(enderecos);
        });
      }
      catch(err) {
        console.log(err);
        reject(false);
      }
    });
  }

  getEnderecoByCliente(idusuario){
    return new Promise((resolve, reject) => {
      try {
        executeSQL('SELECT rua, numero, referencia, bairro, cidade, uf FROM ecommerce.endereco WHERE id_cliente = '+idusuario+';', (endereco) => {
          resolve(endereco[0]);
        });
      }
      catch(err) {
        console.log(err);
        reject(false);
      }
    });
  }

  persistEndereco(endereco){
    return new Promise((resolve, reject) => {
      try {
        //inserindo endereco
        executeSQL('INSERT INTO ecommerce.endereco(rua, numero, referencia, bairro, cidade, uf) VALUES("'+endereco.rua+'", "'+endereco.numero+'", "'+endereco.referencia+'", "'+endereco.bairro+'", "'+endereco.cidade+'", "'+endereco.uf+'");', (newEndereco) => {
          resolve(newEndereco.insertId);
        });
      }
      catch(err) {
        console.log(err);
        reject(false);
      }
    });
  }

  persistEnderecoCliente(endereco, idusuario){
    return new Promise((resolve, reject) => {
      try {
        //inserindo endereco de cliente
        executeSQL('INSERT INTO ecommerce.endereco(rua, numero, referencia, bairro, cidade, uf, id_cliente) VALUES("'+endereco.rua+'", "'+endereco.numero+'", "'+endereco.referencia+'", "'+endereco.bairro+'", "'+endereco.cidade+'", "'+endereco.uf+'", '+idusuario+');', (newEndereco) => {
          resolve(newEndereco.insertId);
        });
      }
      catch(err) {
        console.log(err);
        reject(false);
      }
    });
  }

}
module.exports = EnderecoDao;
