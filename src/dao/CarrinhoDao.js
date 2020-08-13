const executeSQL = require('../helpers/exeSQL');
const dataNow = require('../helpers/dataTool');
class CarrinhoDao {
  constructor() {
  }

  getCarrinho(res, id_cliente){
    executeSQL('SELECT p.* FROM ecommerce.produto p INNER JOIN ecommerce.carrinho car ON car.id_produto = p.idproduto INNER JOIN ecommerce.cliente c ON car.id_cliente = c.id_usuario WHERE c.id_usuario = '+id_cliente+';', (carrinho) => {
      res.json(carrinho);
    });
  }

  confirmaProdutoNoCarrinho(res, id_cliente, id_produto){
    executeSQL('SELECT id_produto FROM ecommerce.carrinho WHERE id_cliente = '+id_cliente+' AND id_produto = '+id_produto+';', (confirmacao) => {
      if (confirmacao[0]) {
        res.json(true);
      }else{
        res.json(false);
      }
    });
  }

  addAoCarrinho(res, id_cliente, id_produto){
    executeSQL('INSERT INTO ecommerce.carrinho(id_cliente, id_produto, data_inclusao) VALUES('+id_cliente+', '+id_produto+', "'+dataNow()+'");', (addProdutoCarrinho) => {
      res.json('PRODUTO ADICIONADO AO CARRINHO!');
    });
  }

  remDoCarrinho(res, id_cliente, id_produto){
    executeSQL('DELETE FROM ecommerce.carrinho WHERE id_cliente = '+id_cliente+' AND id_produto = '+id_produto+';', (remProdutoCarrinho) => {
      res.json('PRODUTO RETIRADO DO CARRINHO!');
    });
  }
}
module.exports = CarrinhoDao;
