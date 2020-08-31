const executeSQL = require('../helpers/exeSQL');
class VisitanteDao {
  constructor() {
  }

  persistVisitante(visitante){
    return executeSQL('SELECT idvisitante FROM ecommerce.visitante WHERE nome = "'+visitante.nome+'" AND email = "'+visitante.email+'", AND telefone = "'+visitante.telefone+'" AND cpf = "'+visitante.cpf+'";', (getId) => {
      if (getId[0] == undefined) {// se não existir um cadastro identico para este visitante!
        return executeSQL('INSERT INTO ecommerce.visitante(nome, email, telefone, cpf) VALUES("'+visitante.nome+'", "'+visitante.email+'", "'+visitante.telefone+'", "'+visitante.cpf+'");', (newVisitante) => {
          console.log("VISITANTE CADASTRADO COM SUCESSO!");
          return newVisitante.insertId;
        });
      }else{
        return false;
      }
    });
  }

}
module.exports = VisitanteDao;
