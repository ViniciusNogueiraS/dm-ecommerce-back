const Endereco = require('../endereco/endereco-model');
const Pedido = require('./pedido-model');
const Visitante = require('./visitante-model');

const EnderecoDao = require('../endereco/endereco-dao');
const PedidoDao = require('./pedido-dao');
const VisitanteDao = require('./visitante-dao');

const verificaVisitante = require('../../helpers/verifyVisitante');
const verificaEndereco = require('../../helpers/verifyEndereco');

//---------------importações-------------------

function aplicarServicos(app){

  app.get('/pedido', function (req, res) {
    let pedidoDao = new PedidoDao();
  
    if (req.query.id_cliente) {
      pedidoDao.getPedidoByCliente(res, req.query.id_cliente);
    } else {
      pedidoDao.getAllPedidos(res);
    }
  });
  
  app.post('/pedido', function (req, res) {
    let pedidoDao = new PedidoDao();
    let visitanteDao = new VisitanteDao();
    let enderecoDao = new EnderecoDao();
  
    if (req.body.pedidoClienteEndCad) { // PEDIDO DE CLIENTE ENDERECO CADASTRADO!
  
      let pedido = new Pedido({
        idpedido: null,
        data_criacao: null,
        visitante: null,
        cliente: req.body.pedidoClienteEndCad.cliente,
        endereco: req.body.pedidoClienteEndCad.endereco,
        forma_pagamento: req.body.pedidoClienteEndCad.forma_pagamento,
        num_cartao: req.body.pedidoClienteEndCad.num_cartao,
        data_validade: req.body.pedidoClienteEndCad.data_validade,
        codigo_seguranca: req.body.pedidoClienteEndCad.codigo_seguranca,
        items: req.body.pedidoClienteEndCad.items,
        status: req.body.pedidoClienteEndCad.status
      });
  
      pedidoDao.persistPedidoCliente(res, pedido);
  
    }
    else if (req.body.pedidoClienteEndNovo) { // PEDIDO DE CLIENTE ENDERECO NOVO!
      if (verificaEndereco(req.body.pedidoClienteEndNovo.endereco)) {
  
        let endereco = new Endereco(req.body.pedidoClienteEndNovo.endereco);
        enderecoDao.persistEndereco(endereco).then(idNewEndereco => {
          endereco.setIdEndereco(idNewEndereco);
  
          let pedido = new Pedido({
            idpedido: null,
            data_criacao: null,
            visitante: null,
            cliente: req.body.pedidoClienteEndNovo.cliente,
            endereco,
            forma_pagamento: req.body.pedidoClienteEndNovo.forma_pagamento,
            num_cartao: req.body.pedidoClienteEndNovo.num_cartao,
            data_validade: req.body.pedidoClienteEndNovo.data_validade,
            codigo_seguranca: req.body.pedidoClienteEndNovo.codigo_seguranca,
            items: req.body.pedidoClienteEndNovo.items,
            status: req.body.pedidoClienteEndNovo.status
          });
    
          pedidoDao.persistPedidoCliente(res, pedido);
        });
      } else {
        res.status(401).json({ auth: false, message: 'ERRO AO REALIZAR PEDIDO!' });
      }
    } else if (req.body.pedidoVisitante) {// PEDIDO DE VISITANTE
      if (verificaVisitante(req.body.pedidoVisitante.visitante) && verificaEndereco(req.body.pedidoVisitante.endereco)) {
  
        let visitante = new Visitante({
          nome: req.body.pedidoVisitante.visitante.nome,
          email: req.body.pedidoVisitante.visitante.email,
          telefone: req.body.pedidoVisitante.visitante.telefone,
          cpf: req.body.pedidoVisitante.visitante.cpf
        });
        
        visitanteDao.persistVisitante(visitante).then(idNewVisitante => {
          visitante.setIdVisitante(idNewVisitante);
          
          let endereco = new Endereco(req.body.pedidoVisitante.endereco);
          enderecoDao.persistEndereco(endereco).then(idNewEndereco => {
            endereco.setIdEndereco(idNewEndereco);
  
            let pedido = new Pedido({
              idpedido: null,
              data_criacao: null,
              visitante,
              cliente: null,
              endereco,
              forma_pagamento: req.body.pedidoVisitante.forma_pagamento,
              num_cartao: req.body.pedidoVisitante.num_cartao,
              data_validade: req.body.pedidoVisitante.data_validade,
              codigo_seguranca: req.body.pedidoVisitante.codigo_seguranca,
              items: req.body.pedidoVisitante.items,
              status: req.body.pedidoVisitante.status
            });
  
            pedidoDao.persistPedidoVisitante(res, pedido);
          });
        });
  
      }
      else {
        res.status(401).json({ auth: false, message: 'ERRO AO REALIZAR PEDIDO!' });
      }
    }
  });

}
module.exports = aplicarServicos;