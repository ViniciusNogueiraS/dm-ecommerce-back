const executeSQL = require('../../helpers/exeSQL');

class VisitanteDao {
  constructor() {
  }

  persistVisitante(visitante){
    return new Promise((resolve, reject) => {
      try {
        executeSQL('SELECT idvisitante FROM ecommerce.visitante WHERE nome = "'+visitante.nome+'" AND email = "'+visitante.email+'" AND telefone = "'+visitante.telefone+'" AND cpf = "'+visitante.cpf+'";', (getId) => {
          if (getId[0] == undefined) {// se não existir um cadastro identico para este visitante!
            executeSQL('INSERT INTO ecommerce.visitante(nome, email, telefone, cpf) VALUES("'+visitante.nome+'", "'+visitante.email+'", "'+visitante.telefone+'", "'+visitante.cpf+'");', (newVisitante) => {
              console.log("VISITANTE CADASTRADO COM SUCESSO!");
              resolve(newVisitante.insertId);
            });
          }else{
            resolve(getId[0]);
          }
        });
      }
      catch(err) {
        reject(false);
      }
    });
  }

}
module.exports = VisitanteDao;
