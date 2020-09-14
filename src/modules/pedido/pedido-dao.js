const executeSQL = require('../../helpers/exeSQL');
const dataNow = require('../../helpers/dataTool');

class PedidoDao {
  constructor() {
  }

  getAllPedidos(res){
    executeSQL('SELECT * FROM ecommerce.pedido;', (pedidos) => {
      res.json(pedidos);
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO PROJETAR PEDIDOS! => "+err});
    });
  }

  getPedidoByCliente(res, id_cliente){
    executeSQL('SELECT * FROM ecommerce.pedido WHERE id_cliente = '+id_cliente+';', (pedido) => {
      res.json(pedido);
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO PROJETAR PEDIDO! => "+err});
    });
  }

  getPedidoById(res, idpedido){
    executeSQL('SELECT * FROM ecommerce.pedido WHERE idpedido = '+idpedido+';', (pedido) => {
      res.json(pedido);
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO PROJETAR PEDIDO! => "+err});
    });
  }

  updateStatus(res, status_pedido){
    executeSQL('UPDATE FROM ecommerce.pedido SET status_pedido = "'+status_pedido+'";', (upStatus) => {
      res.json(upStatus);
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO ALTERAR STATUS! => "+err});
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
      executeSQL('INSERT INTO ecommerce.pedido_lista(id_pedido, id_produto, quantidade) VALUES('+idNewPedido+', '+pedido.items[0].produto.idproduto+', '+pedido.items[0].quantidade+');', (newPedidoLista) => {
        res.json("PEDIDO ENVIADO COM SUCESSO!");
      })
      .catch(err => {
        console.log(err);
        res.status(401).json({ auth: false, message: "FALHA AO VINCULAR PRODUTO AO PEDIDO DE VISITANTE! => "+err});
      });
    }

    var data_criacao = dataNow();

    if (pedido.forma_pagamento == 'boleto') {
      executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_visitante, id_endereco, forma_pagamento, status, valor_total) VALUES("'+data_criacao+'", '+pedido.visitante.idvisitante+', '+pedido.endereco.idendereco+', "'+pedido.forma_pagamento+'", "CRIADO", '+pedido.calculaTotal()+');', (newPedidoBoleto) => {
        persistPedido_Lista(newPedidoBoleto.insertId);
      })
      .catch(err => {
        console.log(err);
        res.status(401).json({ auth: false, message: "FALHA AO ENVIAR PEDIDO DE VISITANTE (BOLETO)! => "+err});
      });
    }else{
      executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_visitante, id_endereco, forma_pagamento, num_cartao, data_validade, codigo_seguranca, status, valor_total) VALUES("'+data_criacao+'", '+pedido.visitante.idvisitante+', '+pedido.endereco.idendereco+', "'+pedido.forma_pagamento+'", "'+pedido.num_cartao+'", "'+pedido.data_validade+'", "'+pedido.codigo_seguranca+'", "CRIADO", '+pedido.calculaTotal()+');', (newPedidoCartao) => {
        persistPedido_Lista(newPedidoCartao.insertId);
      })
      .catch(err => {
        console.log(err);
        res.status(401).json({ auth: false, message: "FALHA AO ENVIAR PEDIDO DE VISITANTE (CARTÃO)! => "+err});
      });
    }
  }

  persistPedidoCliente(res, pedido){
    function persistPedido_Lista(idNewPedido){
      //CLIENTE poderá fazer o pedido com vários produtos na lista
      pedido.items.forEach(item => {
        executeSQL('INSERT INTO ecommerce.pedido_lista(id_pedido, id_produto, quantidade) VALUES('+idNewPedido+', '+item.produto.idproduto+', '+item.quantidade+');', (newPedidoLista) => {
        })
        .catch(err => {
          console.log(err);
          res.status(401).json({ auth: false, message: "FALHA AO VINCULAR PRODUTOS AO PEDIDO DE CLIENTE! => "+err});
        });
      });
      res.json("PEDIDO ENVIADO COM SUCESSO!");
    }

    var data_criacao = dataNow();

    if (pedido.forma_pagamento == 'boleto') {
      executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_cliente, id_endereco, forma_pagamento, status, valor_total) VALUES("'+data_criacao+'", '+pedido.cliente.idusuario+', '+pedido.cliente.endereco.idendereco+', "'+pedido.forma_pagamento+'", "CRIADO", '+pedido.calculaTotal()+');', (newPedidoBoleto) => {
        persistPedido_Lista(newPedidoBoleto.insertId);
      })
      .catch(err => {
        console.log(err);
        res.status(401).json({ auth: false, message: "FALHA AO ENVIAR PEDIDO DE CLIENTE (CARTÃO)! => "+err});
      });
    }else{
      executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_cliente, id_endereco, forma_pagamento, num_cartao, data_validade, codigo_seguranca, status, valor_total) VALUES("'+data_criacao+'", '+pedido.cliente.idusuario+', '+pedido.cliente.endereco.idendereco+', "'+pedido.forma_pagamento+'", "'+pedido.num_cartao+'", "'+pedido.data_validade+'", "'+pedido.codigo_seguranca+'", "CRIADO", '+pedido.calculaTotal()+');', (newPedidoCartao) => {
        persistPedido_Lista(newPedidoCartao.insertId);
      })
      .catch(err => {
        console.log(err);
        res.status(401).json({ auth: false, message: "FALHA AO ENVIAR PEDIDO DE CLIENTE (CARTÃO)! => "+err});
      });
    }
  }

}
module.exports = PedidoDao;
