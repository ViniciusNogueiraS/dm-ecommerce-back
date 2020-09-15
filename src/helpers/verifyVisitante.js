function verificaVisitante(visitante){
  if (visitante.nome != '' && visitante.nome != undefined ||
  visitante.email != '' && visitante.email != undefined ||
  visitante.telefone != '' && visitante.telefone != undefined ||
  visitante.cpf != '' && visitante.cpf != undefined) {
    return true;

  }else{
    return false;
    
  }
}
module.exports = verificaVisitante;