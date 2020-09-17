const executeSQL = require('../../helpers/exeSQL');
const dataNow = require('../../helpers/dataTool');

const Pedido = require('./pedido-model');
const Produto = require('../produto/produto-model');
const Visitante = require('./visitante-model');
const Cliente = require('../cliente/cliente-model');
const Endereco = require('../endereco/endereco-model');
const Item = require('./item-model');

class PedidoDao {
  constructor() {
  }

  getAllPedidos(res){
    executeSQL('SELECT idpedido, data_criacao, forma_pagamento, status, valor_total FROM ecommerce.pedido;').then(pedidos => {
      res.json(pedidos);
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO PROJETAR PEDIDO! => "+err});
    });
  }

  getPedidoByCliente(res, id_cliente){
    executeSQL('SELECT idpedido, data_criacao, forma_pagamento, status, valor_total FROM ecommerce.pedido WHERE id_cliente = '+id_cliente+';').then(pedidos => {
      res.json(pedidos);
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO PROJETAR PEDIDO! => "+err});
    });
  }

  getPedidoById(res, idpedido){
    executeSQL('SELECT p.*, v.*, u.*, c.*, e.* FROM ecommerce.pedido p LEFT JOIN ecommerce.visitante v ON idvisitante = id_visitante RIGHT JOIN ecommerce.usuario u ON idusuario = id_cliente RIGHT JOIN ecommerce.cliente c ON id_usuario = id_cliente INNER JOIN ecommerce.endereco e ON idendereco = id_endereco WHERE idpedido = '+idpedido+';').then(pedido => {
      
      var endereco = new Endereco({//ENDEREÇO DO PEDIDO!!!
        idendereco: pedido[0].id_endereco,
        rua: pedido[0].rua,
        numero: pedido[0].numero,
        referencia: pedido[0].referencia,
        bairro: pedido[0].bairro,
        cidade: pedido[0].cidade,
        uf: pedido[0].uf
      });

      if (pedido[0].id_visitante != null) {//pedido de visitante
        var cliente = null;
        var visitante = new Visitante({
          idvisitante: pedido[0].id_visitante,
          nome: pedido[0].nome,
          email: pedido[0].email,
          telefone: pedido[0].telefone,
          cpf: pedido[0].cpf
        });

      }else{//pedido de cliente
        var visitante = null;
        var cliente = new Cliente({
          idusuario: pedido[0].idusuario,
          nome: pedido[0].nome,
          email: pedido[0].email,
          telefone: pedido[0].telefone,
          cpf: pedido[0].cpf,
        });
      }

      if (pedido[0].forma_pagamento == 'boleto') {
        var pedidoMontagem = new Pedido({
          idpedido: pedido[0].idpedido,
          data_criacao: pedido[0].data_criacao,
          visitante,
          cliente,
          endereco,
          forma_pagamento: pedido[0].forma_pagamento,
          num_cartao: null,
          data_validade: null,
          codigo_seguranca: null,
          items: null,
          status: pedido[0].status,
          valor_total: pedido[0].valor_total
        });
      }else{
        var pedidoMontagem = new Pedido({
          idpedido: pedido[0].idpedido,
          data_criacao: pedido[0].data_criacao,
          visitante,
          cliente,
          endereco,
          forma_pagamento: pedido[0].forma_pagamento,
          num_cartao: pedido[0].num_cartao,
          data_validade: pedido[0].data_validade,
          codigo_seguranca: pedido[0].codigo_seguranca,
          items: null,
          status: pedido[0].status,
          valor_total: pedido[0].valor_total
        });
      }

      this.getPedidoLista(pedidoMontagem.idpedido).then(items => {
        if (items) {
          pedidoMontagem.setItems(items);
        }else{
          res.status(401).json({ auth: false, message: "FALHA AO PROJETAR PEDIDO! => "+err});
        }
        res.json(pedidoMontagem);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO PROJETAR PEDIDO! => "+err});
    });
  }

  getPedidoLista(id_pedido){
    return new Promise((resolve, reject) => {
      executeSQL('SELECT p.*, pl.quantidade FROM ecommerce.pedido_lista pl INNER JOIN ecommerce.produto p ON p.idproduto = pl.id_produto WHERE pl.id_pedido = '+id_pedido+';').then(pedido_lista => {
        var items = [];
        pedido_lista.forEach(pl => {
          var item = new Item({
            produto: new Produto({
              idproduto: pl.idproduto,
              nome: pl.nome,
              categoria: pl.categoria,
              preco: pl.preco,
              desconto: pl.desconto,
              descricao: pl.descricao,
              imagem: pl.imagem,
              data_cadastro: pl.data_cadastro,
            }),
            quantidade: pl.quantidade
          });

          items.push(item);
        });
        
        resolve(items);
      })
      .catch(err => {
        console.log(err);
        reject(false);
      });
    });
  }

  updateStatus(res, status_pedido){
    executeSQL('UPDATE FROM ecommerce.pedido SET status_pedido = "'+status_pedido+'";').then(upStatus => {
      res.json(upStatus);
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({ auth: false, message: "FALHA AO ALTERAR STATUS! => "+err});
    });
  }
  /*
  deletePedidoById(res, idpedido){
    executeSQL('DELETE FROM ecommerce.pedido WHERE idpedido = '+idpedido+';').then(upStatus => {
      res.json(upStatus);
    });
  }*/

  //métodos de COMPRA
  persistPedidoVisitante(res, pedido){
    function persistPedido_Lista(idNewPedido){
      //VISITANTE poderá fazer o pedido com apenas um produto na lista
      executeSQL('INSERT INTO ecommerce.pedido_lista(id_pedido, id_produto, quantidade) VALUES('+idNewPedido+', '+pedido.items[0].produto.idproduto+', '+pedido.items[0].quantidade+');').then(newPedidoLista => {
        res.json("PEDIDO ENVIADO COM SUCESSO!");
      })
      .catch(err => {
        console.log(err);
        res.status(401).json({ auth: false, message: "FALHA AO VINCULAR PRODUTO AO PEDIDO DE VISITANTE! => "+err});
      });
    }

    var data_criacao = dataNow();

    if (pedido.forma_pagamento == 'boleto') {
      executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_visitante, id_endereco, forma_pagamento, status, valor_total) VALUES("'+data_criacao+'", '+pedido.visitante.idvisitante+', '+pedido.endereco.idendereco+', "'+pedido.forma_pagamento+'", "CRIADO", '+pedido.calculaTotal()+');').then(newPedidoBoleto => {
        persistPedido_Lista(newPedidoBoleto.insertId);
      })
      .catch(err => {
        console.log(err);
        res.status(401).json({ auth: false, message: "FALHA AO ENVIAR PEDIDO DE VISITANTE (BOLETO)! => "+err});
      });
    }else{
      executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_visitante, id_endereco, forma_pagamento, num_cartao, data_validade, codigo_seguranca, status, valor_total) VALUES("'+data_criacao+'", '+pedido.visitante.idvisitante+', '+pedido.endereco.idendereco+', "'+pedido.forma_pagamento+'", "'+pedido.num_cartao+'", "'+pedido.data_validade+'", "'+pedido.codigo_seguranca+'", "CRIADO", '+pedido.calculaTotal()+');').then(newPedidoCartao => {
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
        executeSQL('INSERT INTO ecommerce.pedido_lista(id_pedido, id_produto, quantidade) VALUES('+idNewPedido+', '+item.produto.idproduto+', '+item.quantidade+');').then(newPedidoLista => {
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
      executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_cliente, id_endereco, forma_pagamento, status, valor_total) VALUES("'+data_criacao+'", '+pedido.cliente.idusuario+', '+pedido.cliente.endereco.idendereco+', "'+pedido.forma_pagamento+'", "CRIADO", '+pedido.calculaTotal()+');').then(newPedidoBoleto => {
        persistPedido_Lista(newPedidoBoleto.insertId);
      })
      .catch(err => {
        console.log(err);
        res.status(401).json({ auth: false, message: "FALHA AO ENVIAR PEDIDO DE CLIENTE (CARTÃO)! => "+err});
      });
    }else{
      executeSQL('INSERT INTO ecommerce.pedido(data_criacao, id_cliente, id_endereco, forma_pagamento, num_cartao, data_validade, codigo_seguranca, status, valor_total) VALUES("'+data_criacao+'", '+pedido.cliente.idusuario+', '+pedido.cliente.endereco.idendereco+', "'+pedido.forma_pagamento+'", "'+pedido.num_cartao+'", "'+pedido.data_validade+'", "'+pedido.codigo_seguranca+'", "CRIADO", '+pedido.calculaTotal()+');').then(newPedidoCartao => {
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
