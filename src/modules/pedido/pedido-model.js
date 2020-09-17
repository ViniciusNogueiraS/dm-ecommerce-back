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

  setItems(items){
    this.items = items;
  }

  calculaTotal(){
    var aux = [];
    this.items.forEach(item => {
      var precoDescontado = item.produto.preco - (item.produto.preco * (item.produto.desconto / 100));
      aux.push(parseFloat(precoDescontado) * parseInt(item.quantidade));
    });
    return aux.reduce((a, b) => a + b, 0);
  }

}
module.exports = Pedido;