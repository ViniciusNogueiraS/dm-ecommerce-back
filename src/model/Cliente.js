class Cliente {
  
  idusuario;
  nome;
  email;
  senha;
  telefone;
  cpf;
  num_cartao;
  data_validade;
  codigo_seguranca;
  endereco;

  constructor(obj) {
    Object.assign(this, obj);
  }
}
module.exports = Cliente;