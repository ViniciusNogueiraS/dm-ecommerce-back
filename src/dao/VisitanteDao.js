const executeSQL = require('../helpers/exeSQL');
class VisitanteDao {
  constructor() {
  }

  persistVisitante(visitante){
    executeSQL('INSERT INTO ecommerce.visitante(nome, email, telefone, cpf) VALUES("'+visitante.nome+'", "'+visitante.email+'", "'+visitante.telefone+'", "'+visitante.cpf+'");', (newVisitante) => {
      executeSQL('SELECT idvisitante FROM ecommerce.visitante WHERE cpf = "'+visitante.cpf+'";', (getId) => {
        executeSQL('INSERT INTO ecommerce.endereco(rua, numero, referencia, bairro, cidade, uf, id_visitante) VALUES("'+visitante.rua+'", "'+visitante.numero+'", "'+visitante.referencia+'", "'+visitante.bairro+'", "'+visitante.cidade+'", "'+visitante.uf+'", '+getId[0].idvisitante+');', (newEndereco) => {
          console.log("VISITANTE CADASTRADO COM SUCESSO!");
        });
      });
    });
  }

}
module.exports = VisitanteDao;
