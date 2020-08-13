class Pedido {

  idpedido;
  data_criacao;
  id_visitante;
  id_cliente;
  id_endereco;
  forma_pagamento;
  num_ct_credito;
  agencia;
  status;

  constructor(obj) {
    Object.assign(this, obj);
  }

}
module.exports = Pedido;