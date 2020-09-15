class Visitante {
  
  idvisitante;
  nome;
  email;
  telefone;
  cpf;

  constructor(obj) {
    Object.assign(this, obj);
  }

  setIdVisitante(idvisitante){
    this.idvisitante = idvisitante;
  }
}
module.exports = Visitante;