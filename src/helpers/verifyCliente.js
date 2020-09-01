function verificaCliente(cliente){
  if (cliente.nome != '' && cliente.nome != undefined ||
    cliente.email != '' && cliente.email != undefined ||
    cliente.senha != '' && cliente.senha != undefined ||
    cliente.telefone != '' && cliente.telefone != undefined ||
    cliente.cpf != '' && cliente.cpf != undefined ||
    cliente.num_cartao != '' && cliente.num_cartao != undefined ||
    cliente.data_validade != '' && cliente.data_validade != undefined ||
    cliente.codigo_seguranca != '' && cliente.codigo_seguranca != undefined ||
    cliente.endereco.rua != '' && cliente.endereco.rua != undefined ||
    cliente.endereco.numero != '' && cliente.endereco.numero != undefined ||
    cliente.endereco.bairro != '' && cliente.endereco.bairro != undefined ||
    cliente.endereco.cidade != '' && cliente.endereco.cidade != undefined ||
    cliente.endereco.uf != '' && cliente.endereco.uf != undefined) {
    return true;

  }else{
    return false;
    
  }
}
module.exports = verificaCliente;