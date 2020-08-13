class Endereco {
  
  idendereco;
  rua;
  numero;
  referencia;
  bairro;
  cidade;
  uf;

  constructor(obj) {
    Object.assign(this, obj);
  }
}
module.exports = Endereco;