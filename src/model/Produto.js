class Produto {

  idproduto;
  nome;
  categoria;
  preco;
  desconto;
  descricao;
  imagem;
  data_cadastro;

  constructor(obj) {
    Object.assign(this, obj);
  }
}
module.exports = Produto;