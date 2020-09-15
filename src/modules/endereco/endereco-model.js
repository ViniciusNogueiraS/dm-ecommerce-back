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

  setIdEndereco(idendereco){
    this.idendereco = idendereco;
  }
}
module.exports = Endereco;