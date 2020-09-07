const Produto = require('./produto-model');

const ProdutoDao = require('./produto-dao');

//---------------importações-------------------

function aplicarServicos(app){

  app.get('/busca', function (req, res) {
    let produtoDao = new ProdutoDao();
  
    produtoDao.searchProdutos(res, req.query.pesquisa);
  });
  
  app.get('/produto', function (req, res) {
    let produtoDao = new ProdutoDao();
  
    if (req.query.idproduto) {
      produtoDao.getProdutoById(res, req.query.idproduto);
    } else if (req.query.categoria) {
      produtoDao.getProdutosByCategoria(res, req.query.categoria);
    } else {
      produtoDao.getAllProdutos(res);
    }
  });
  
  //upload de imagem
  app.post('/produtoUpFile', function (req, res) {
  
  });
  
  app.post('/produtoADM', function (req, res) {
    let produtoDao = new ProdutoDao();
    let produto = new Produto({
      nome: req.body.nome,
      categoria: req.body.categoria,
      preco: req.body.preco,
      desconto: req.body.desconto,
      preco_descontado: req.body.preco_descontado,
      descricao: req.body.descricao,
      imagem: req.body.imagem
    });
  
    produtoDao.persistProduto(res, produto);
  });
  
  app.put('/produtoADM', function (req, res) {
    let produtoDao = new ProdutoDao();
    let produto = new Produto({
      idproduto: req.body.idproduto,
      nome: req.body.nome,
      categoria: req.body.categoria,
      preco: req.body.preco,
      desconto: req.body.desconto,
      preco_descontado: req.body.preco_descontado,
      descricao: req.body.descricao,
      imagem: req.body.imagem
    });
  
    produtoDao.uploadProdutoById(res, produto);
  });
  
  app.delete('/produtoADM', function (req, res) {
    let produtoDao = new ProdutoDao();
  
    produtoDao.deleteProdutoById(res, req.query.idproduto);
  });
}
module.exports = aplicarServicos;