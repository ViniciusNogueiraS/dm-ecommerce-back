const executeSQL = require('../helpers/exeSQL');
const dataNow = require('../helpers/dataTool');
class ProdutoDao {
  constructor() {
  }

  getAllProdutos(res){
    executeSQL('SELECT * FROM ecommerce.produto;', (produtos) => {
      res.json(produtos);
    });
  }

  getProdutoById(res, idproduto){
    executeSQL('SELECT * FROM ecommerce.produto WHERE idproduto = '+idproduto+';', (produto) => {
      res.json(produto);
    });
  }

  searchProdutos(res, pesquisa){
    executeSQL('SELECT * FROM ecommerce.produto WHERE nome LIKE "%'+pesquisa+'%";', (produtos) => {
      res.json(produtos);
    });
  }

  getProdutosByCategoria(res, categoria){
    executeSQL('SELECT * FROM ecommerce.produto WHERE categoria = "'+categoria+'";', (produtos) => {
      res.json(produtos);
    });
  }

  persistProduto(res, produto){
    executeSQL('INSERT INTO ecommerce.produto(nome, categoria, preco, desconto, preco_descontado, descricao, imagem, data_cadastro) VALUES("'+produto.nome+'", "'+produto.categoria+'", '+produto.preco+', '+produto.desconto+', '+produto.preco_descontado+', "'+produto.descricao+'", "'+produto.imagem+'", "'+dataNow()+'");', (newProduto) => {
      res.json('PRODUTO CADASTRADO COM SUCESSO!');
    });
  }

  uploadProdutoById(res, produto){
    executeSQL('UPDATE ecommerce.produto SET nome = "'+produto.nome+'", categoria = "'+produto.categoria+'", preco = '+produto.preco+', desconto = '+produto.desconto+', preco_descontado = '+produto.preco_descontado+', descricao = "'+produto.descricao+'", imagem = "'+produto.imagem+'" WHERE idproduto = '+produto.idproduto+';', (upProduto) => {
      res.json('PRODUTO ATUALIZADO COM SUCESSO!');
    });
  }

  deleteProdutoById(res, idproduto){
    executeSQL('DELETE FROM ecommerce.produto WHERE idproduto = '+idproduto+';', (delProduto) => {
      res.json('PRODUTO EXCLUÍDO COM SUCESSO!');
    });
  }
}
module.exports = ProdutoDao;
