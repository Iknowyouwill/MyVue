// 指令类watcher，用来绑定更新函数，实现DOM元素的更新

function Watcher(name, el, vm, exp, attr) {
  this.name = name; //指令名称
  this.el = el; //指令对应的DOM元素
  this.vm = vm; //指令所属的MyVue实例
  this.exp = exp; //指令对应的值
  this.attr = attr; //绑定的属性值

  this.updata();
}

Watcher.prototype.update = function() {
  this.el[this.attr] = this.vm.$data[this.exp];
}