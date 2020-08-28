class Pedido {

  idpedido;
  data_criacao;
  visitante;
  cliente;
  endereco;
  forma_pagamento;
  num_cartao;
  data_validade;
  codigo_seguranca;
  lista_produtos;
  status;

  constructor(obj) {
    Object.assign(this, obj);
  }

}
module.exports = Pedido;