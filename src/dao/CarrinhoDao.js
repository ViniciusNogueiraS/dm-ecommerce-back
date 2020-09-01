const executeSQL = require('../helpers/exeSQL');
const dataNow = require('../helpers/dataTool');
class CarrinhoDao {
  constructor() {
  }

  getCarrinho(res, id_cliente){
    try {
      executeSQL('SELECT p.* FROM ecommerce.produto p INNER JOIN ecommerce.carrinho car ON car.id_produto = p.idproduto INNER JOIN ecommerce.cliente c ON car.id_cliente = c.id_usuario WHERE c.id_usuario = '+id_cliente+';', (carrinho) => {
        res.json(carrinho);
      });
    }
    catch(err) {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO PROJETAR CARRINHO! => "+err.message});
    }
  }

  confirmaProdutoNoCarrinho(res, id_cliente, id_produto){
    try {
      executeSQL('SELECT id_produto FROM ecommerce.carrinho WHERE id_cliente = '+id_cliente+' AND id_produto = '+id_produto+';', (confirmacao) => {
        if (confirmacao[0]) {
          res.json(true);
        }else{
          res.json(false);
        }
      });
    }
    catch(err) {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO CONFIRMAR PRODUTO NO CARRINHO! => "+err.message});
    }
  }

  addAoCarrinho(res, id_cliente, id_produto){
    try {
      executeSQL('INSERT INTO ecommerce.carrinho(id_cliente, id_produto, data_inclusao) VALUES('+id_cliente+', '+id_produto+', "'+dataNow()+'");', (addProdutoCarrinho) => {
        res.json('PRODUTO ADICIONADO AO CARRINHO!');
      });
    }
    catch(err) {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO INSERIR PRODUTO NO CARRINHO! => "+err.message});
    }
  }

  remDoCarrinho(res, id_cliente, id_produto){
    try {
      executeSQL('DELETE FROM ecommerce.carrinho WHERE id_cliente = '+id_cliente+' AND id_produto = '+id_produto+';', (remProdutoCarrinho) => {
        res.json('PRODUTO RETIRADO DO CARRINHO!');
      });
    }
    catch(err) {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO EXCLUIR PRODUTO DO CARRINHO! => "+err.message});
    }
  }
}
module.exports = CarrinhoDao;
