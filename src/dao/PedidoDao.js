const executeSQL = require('../helpers/exeSQL');
const dataNow = require('../helpers/dataTool');
class PedidoDao {
  constructor() {
  }

  getAllPedidos(res){
    executeSQL('SELECT * FROM ecommerce.pedido;', (pedidos) => {
      res.json(pedidos);
    });
  }

  getPedidoByCliente(res, id_cliente){
    executeSQL('SELECT * FROM ecommerce.pedido WHERE id_cliente = '+id_cliente+';', (pedido) => {
      res.json(pedido);
    });
  }
  /*
  updatePedido(res, num_ct_credito, agencia){
    executeSQL('UPDATE FROM ecommerce.pedido SET num_ct_credito = "'+num_ct_credito+'", agencia = "'+agencia+'";', (upPedido) => {
      res.json(upPedido);
    });
  }*/

  updateStatus(res, status_pedido){
    executeSQL('UPDATE FROM ecommerce.pedido SET status_pedido = "'+status_pedido+'";', (upStatus) => {
      res.json(upStatus);
    });
  }
  /*
  deletePedidoById(res, idpedido){
    executeSQL('DELETE FROM ecommerce.pedido WHERE idpedido = '+idpedido+';', (upStatus) => {
      res.json(upStatus);
    });
  }*/

  //métodos de COMPRA
  persistPedidoVisitante(res, pedido){

    function persistPedido_Lista(idNewPedido){
      //VISITANTE poderá fazer o pedido com apenas um produto na lista
      executeSQL('INSERT INTO ecommerce.pedido_lista(id_pedido, id_produto, quantidade) VALUES('+idNewPedido+', '+pedido.lista_produtos[0].idproduto+', '+pedido.lista_produtos[0].quantidade+';', (newPedidoLista) => {
        res.json("PEDIDO ENVIADO COM SUCESSO!");
      });
    }

    var data_criacao = dataNow();

    if (pedido.num_cartao == '' || pedido.num_cartao == null) {
      executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_visitante, id_endereco, status_pedido) VALUES("'+data_criacao+'", '+pedido.visitante.idvisitante+', '+pedido.endereco.idendereco+', "CRIADO");', (newPedidoBoleto) => {
        persistPedido_Lista(newPedidoBoleto.insertId);
      });
    }else{
      executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_visitante, id_endereco, num_cartao, data_validade, codigo_seguranca, status_pedido) VALUES("'+data_criacao+'", '+pedido.visitante.idvisitante+', '+pedido.endereco.idendereco+', "'+pedido.num_cartao+'", "'+pedido.data_validade+'", "'+pedido.codigo_seguranca+'", "CRIADO", );', (newPedidoCartao) => {
        persistPedido_Lista(newPedidoCartao.insertId);
      });
    }
  }

  persistPedidoCliente(res, pedido){

    function persistPedido_Lista(idNewPedido){
      //CLIENTE poderá fazer o pedido com vários produtos na lista
      pedido.lista_produtos.forEach(item => {
        executeSQL('INSERT INTO ecommerce.pedido_lista(id_pedido, id_produto) VALUES('+idNewPedido+', '+item.idproduto+';', (newPedidoLista) => {
        });
      });
      res.json("PEDIDO ENVIADO COM SUCESSO!");
    }

    var data_criacao = dataNow();

    if (pedido.num_cartao == '' || pedido.num_cartao == null) {
      executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_cliente, id_endereco, status_pedido) VALUES("'+data_criacao+'", '+pedido.cliente.idusuario+', '+pedido.cliente.endereco.idendereco+', "CRIADO");', (newPedidoBoleto) => {
        persistPedido_Lista(newPedidoBoleto.insertId);
      });
    }else{
      executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_cliente, id_endereco, num_cartao, agencia, status_pedido) VALUES("'+data_criacao+'", '+pedido.cliente.idusuario+', '+pedido.cliente.endereco.idendereco+', "'+pedido.num_cartao+'", "'+pedido.data_validade+'", "'+pedido.codigo_seguranca+'", "CRIADO", );', (newPedidoCartao) => {
        persistPedido_Lista(newPedidoCartao.insertId);
      });
    }
  }

}
module.exports = PedidoDao;
