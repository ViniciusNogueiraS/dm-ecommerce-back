class Item {

  produto;
  quantidade;

  constructor(obj) {
    Object.assign(this, obj);
  }

}
module.exports = Item;