const executeSQL = require('../helpers/exeSQL');
class VisitanteDao {
  constructor() {
  }

  persistVisitante(visitante){
    return new Promise((act) => {
      try {
        executeSQL('SELECT idvisitante FROM ecommerce.visitante WHERE nome = "'+visitante.nome+'" AND email = "'+visitante.email+'", AND telefone = "'+visitante.telefone+'" AND cpf = "'+visitante.cpf+'";', (getId) => {
          console.log(getId[0]);
          if (getId[0] == undefined) {// se não existir um cadastro identico para este visitante!
            executeSQL('INSERT INTO ecommerce.visitante(nome, email, telefone, cpf) VALUES("'+visitante.nome+'", "'+visitante.email+'", "'+visitante.telefone+'", "'+visitante.cpf+'");', (newVisitante) => {
              console.log("VISITANTE CADASTRADO COM SUCESSO!");
              act(newVisitante.insertId);
            });
          }else{
            false;
          }
        });
      }
      catch(err) {
        console.log(err);
        res.status(401).json({ auth: false, message: "FALHA AO CADASTRAR VISITANTE! => "+err.message});
      }
    });
  }

}
module.exports = VisitanteDao;
