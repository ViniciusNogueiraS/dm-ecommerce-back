class Visitante {
  
  idvisitante;
  nome;
  email;
  telefone;
  cpf;

  constructor(obj) {
    Object.assign(this, obj);
  }
}
module.exports = Visitante;