const executeSQL = require('../../helpers/exeSQL');

class EnderecoDao {
  constructor() {
  }

  getAllEnderecos(){
    return new Promise((resolve, reject) => {
      executeSQL('SELECT rua, numero, referencia, bairro, cidade, uf FROM ecommerce.endereco;').then(enderecos => {
        resolve(enderecos);
      })
      .catch(err => {
        console.log(err);
        reject(false);
      });
    });
  }

  getEnderecoByCliente(idusuario){
    return new Promise((resolve, reject) => {
      executeSQL('SELECT rua, numero, referencia, bairro, cidade, uf FROM ecommerce.endereco WHERE id_cliente = '+idusuario+';').then(endereco => {
        resolve(endereco[0]);
      })
      .catch(err => {
        console.log(err);
        reject(false);
      });
    });
  }

  persistEndereco(endereco){
    return new Promise((resolve, reject) => {
      //inserindo endereco
      executeSQL('INSERT INTO ecommerce.endereco(rua, numero, referencia, bairro, cidade, uf) VALUES("'+endereco.rua+'", "'+endereco.numero+'", "'+endereco.referencia+'", "'+endereco.bairro+'", "'+endereco.cidade+'", "'+endereco.uf+'");').then(newEndereco => {
        resolve(newEndereco.insertId);
      })
      .catch(err => {
        console.log(err);
        reject(false);
      });
    });
  }

  persistEnderecoCliente(endereco, idusuario){
    return new Promise((resolve, reject) => {
      //inserindo endereco de cliente
      executeSQL('INSERT INTO ecommerce.endereco(rua, numero, referencia, bairro, cidade, uf, id_cliente) VALUES("'+endereco.rua+'", "'+endereco.numero+'", "'+endereco.referencia+'", "'+endereco.bairro+'", "'+endereco.cidade+'", "'+endereco.uf+'", '+idusuario+');').then(newEndereco => {
        resolve(newEndereco.insertId);
      })
      .catch(err => {
        console.log(err);
        reject(false);
      });
    });
  }

}
module.exports = EnderecoDao;
