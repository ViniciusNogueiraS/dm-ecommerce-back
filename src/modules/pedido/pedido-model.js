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
  items;
  status;
  valor_total;

  constructor(obj) {
    Object.assign(this, obj);
  }

  calculaTotal(){
    var aux = [];
    this.items.forEach(item => {
      aux.push(parseFloat(item.produto.preco) * parseInt(item.quantidade));
    });
    return aux.reduce((a, b) => a + b, 0);
  }

}
module.exports = Pedido;