const executeSQL = require('../helpers/exeSQL');
class VisitanteDao {
  constructor() {
  }

  persistVisitante(visitante){
    return executeSQL('SELECT idvisitante FROM ecommerce.visitante WHERE nome = "'+visitante.nome+'" AND email = "'+visitante.email+'", AND telefone = "'+visitante.telefone+'" AND cpf = "'+visitante.cpf+'";', (getId) => {
      if (getId[0] == undefined) {// se não existir um cadastro identico para este visitante!
        return executeSQL('INSERT INTO ecommerce.visitante(nome, email, telefone, cpf) VALUES("'+visitante.nome+'", "'+visitante.email+'", "'+visitante.telefone+'", "'+visitante.cpf+'");', (newVisitante) => {
          return executeSQL('INSERT INTO ecommerce.endereco(rua, numero, referencia, bairro, cidade, uf, id_visitante) VALUES("'+visitante.rua+'", "'+visitante.numero+'", "'+visitante.referencia+'", "'+visitante.bairro+'", "'+visitante.cidade+'", "'+visitante.uf+'", '+newVisitante.insertId+');', (newEndereco) => {
            console.log("VISITANTE CADASTRADO COM SUCESSO!");
            return true;
          });
        });
      }else{
        return false;
      }
    });
  }

}
module.exports = VisitanteDao;
