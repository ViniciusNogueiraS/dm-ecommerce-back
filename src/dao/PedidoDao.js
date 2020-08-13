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
  persistPedidoVisitante(res, cpf, num_ct_credito, agencia, lista_produtos){

    function persistPedido_Lista(id_visitante, lista_produtos, data_criacao){
      executeSQL('SELECT idpedido FROM ecommerce.pedido WHERE id_visitante = '+id_visitante+' AND data_criacao = '+data_criacao+';', (idpedido) => {
        //VISITANTE poderá fazer o pedido com apenas um produto na lista
        executeSQL('INSERT INTO ecommerce.pedido_lista(id_pedido, id_produto) VALUES('+idpedido[0]+', '+lista_produtos[0].idproduto+';', (newPedidoLista) => {
          res.json("PEDIDO ENVIADO COM SUCESSO!");
        });
      });
    }

    var data_criacao = dataNow();

    executeSQL('SELECT v.idvisitante, e.idendereco FROM ecommerce.visitante v INNER JOIN ecommerce.endereco e ON e.id_visitante = v.idvisitante WHERE v.cpf = "'+cpf+'";', (getIds) => {
      if (num_ct_credito == '' || num_ct_credito == null) {
        executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_visitante, id_endereco, status_pedido) VALUES("'+data_criacao+'", '+getIds[0]+', '+getIds[1]+', "CRIADO");', (newPedidoNoCt) => {
          persistPedido_Lista(getIds[0], lista_produtos, data_criacao);
        });
      }else{
        executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_visitante, id_endereco, num_ct_credito, agencia, status_pedido) VALUES("'+data_criacao+'", '+getIds[0]+', '+getIds[1]+', "'+num_ct_credito+'", "'+agencia+'", "CRIADO", );', (newPedidoWiCt) => {
          persistPedido_Lista(getIds[0], lista_produtos, data_criacao);
        });
      }
    });
  }

  persistPedidoCliente(res, cliente, num_ct_credito, agencia, lista_produtos){

    function persistPedido_Lista(id_cliente, lista_produtos, data_criacao){
      executeSQL('SELECT idpedido FROM ecommerce.pedido WHERE id_cliente = '+id_cliente+' AND data_criacao = '+data_criacao+';', (idpedido) => {
        //CLIENTE poderá fazer o pedido com vários produtos na lista
        for (var i = 0; i < lista_produtos.length; i++) {
          executeSQL('INSERT INTO ecommerce.pedido_lista(id_pedido, id_produto) VALUES('+idpedido[0]+', '+lista_produtos[i].idproduto+';', (newPedidoLista) => {
          });
        }
        res.json("PEDIDO ENVIADO COM SUCESSO!");
      });
    }

    var data_criacao = dataNow();

    executeSQL('SELECT idendereco FROM ecommerce.endereco WHERE id_cliente = '+cliente.idusuario+';', (id_endereco) => {
      if (num_ct_credito == '' || num_ct_credito == null) {
        executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_cliente, id_endereco, status_pedido) VALUES("'+data_criacao+'", '+cliente.idusuario+', '+id_endereco[0]+', "CRIADO");', (newPedidoNoCt) => {
          persistPedido_Lista(cliente.idusuario, lista_produtos, data_criacao);
        });
      }else{
        executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_cliente, id_endereco, num_ct_credito, agencia, status_pedido) VALUES("'+data_criacao+'", '+cliente.idusuario+', '+id_endereco[0]+', "'+num_ct_credito+'", "'+agencia+'", "CRIADO", );', (newPedidoWiCt) => {
          persistPedido_Lista(cliente.idusuario, lista_produtos, data_criacao);
        });
      }
    });
  }

}
module.exports = PedidoDao;
