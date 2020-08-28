class Cliente {
  
  idusuario;
  nome;
  email;
  senha;
  telefone;
  cpf;
  num_ct_credito;
  data_validade;
  codigo_seguranca;
  endereco;

  constructor(obj) {
    Object.assign(this, obj);
  }
}
module.exports = Cliente;