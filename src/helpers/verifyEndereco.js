function verificaEndereco(endereco){
  if (endereco.rua != '' && endereco.rua != undefined ||
    endereco.numero != '' && endereco.numero != undefined ||
    endereco.bairro != '' && endereco.bairro != undefined ||
    endereco.cidade != '' && endereco.cidade != undefined ||
    endereco.uf != '' && endereco.uf != undefined) {
    return true;

  }else{
    return false;
    
  }
}
module.exports = verificaEndereco;