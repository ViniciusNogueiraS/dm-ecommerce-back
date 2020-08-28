const executeSQL = require('../helpers/exeSQL');

class EnderecoDao {
  constructor() {
  }

  getAllEnderecos(){
    executeSQL('SELECT rua, numero, referencia, bairro, cidade, uf FROM ecommerce.endereco;', (enderecos) => {
    });
  }

  getEnderecoByCliente(idusuario){
    return executeSQL('SELECT rua, numero, referencia, bairro, cidade, uf FROM ecommerce.endereco WHERE id_cliente = '+idusuario+';', (endereco) => {
      return endereco[0];
    });
  }

  persistEnderecoCliente(endereco, idusuario){
    //inserindo endereco
    return executeSQL('INSERT INTO ecommerce.endereco(rua, numero, referencia, bairro, cidade, uf, id_cliente) VALUES("'+endereco.rua+'", "'+endereco.numero+'", "'+endereco.referencia+'", "'+endereco.bairro+'", "'+endereco.cidade+'", "'+endereco.uf+'", '+idusuario+');', (newEndereco) => {
      return newEndereco.insertId;
    });
  }

  persistEnderecoVisitante(endereco, idusuario){
    //inserindo endereco
    return executeSQL('INSERT INTO ecommerce.endereco(rua, numero, referencia, bairro, cidade, uf, id_visitante) VALUES("'+endereco.rua+'", "'+endereco.numero+'", "'+endereco.referencia+'", "'+endereco.bairro+'", "'+endereco.cidade+'", "'+endereco.uf+'", '+idusuario+');', (newEndereco) => {
      return newEndereco.insertId
    });
  }

}
module.exports = EnderecoDao;
