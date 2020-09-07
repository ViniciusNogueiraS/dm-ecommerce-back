const CarrinhoDao = require('./carrinho-dao');

//---------------importações-------------------

function controlador(app){

  app.get('/carrinho', function (req, res) {
    let carrinhoDao = new CarrinhoDao();
  
    carrinhoDao.getCarrinho(res, req.query.id_cliente);
  });
  
  app.get('/confirmaCarrinho', function (req, res) {
    let carrinhoDao = new CarrinhoDao();
  
    carrinhoDao.confirmaProdutoNoCarrinho(res, req.query.id_cliente, req.query.id_produto);
  });
  
  app.post('/carrinho', function (req, res) {
    let carrinhoDao = new CarrinhoDao();
  
    carrinhoDao.addAoCarrinho(res, req.body.id_cliente, req.body.id_produto);
  });
  /*
  app.put('/carrinho', function(req, res){
  
  });
  */
  app.delete('/carrinho', function (req, res) {
    let carrinhoDao = new CarrinhoDao();
  
    carrinhoDao.remDoCarrinho(res, req.query.id_cliente, req.query.id_produto);
  });
}
module.exports = controlador;