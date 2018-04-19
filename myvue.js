function MyVue(options) {
  this._init(options)
}
/****
 * options{
 * el,
 * data,
 * methods
 * 
 * }
 
 * ***/
MyVue.prototype._init = function(options) {
  this.$options = options; //options为传入的结构体，el,data,methods
  this.$el = document.querySelector(options.el); //el是#app, $el是id为appde element
  this.$data = options.data;
  this.$methods = options.methods;

  this._binding = {};
  this._observe(this.$data);
  this._compile(this.$el);
}

MyVue.prototype._observe = function(obj) {
  let value;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      this._binding[key] = {
        _directives: []
      };

      value = obj[key];

      if (typeof value === 'object') { //如果是对象则继续递归
        this._observe(value);
      };

      var binding = this._binding[key];

      Object.defineProperty(this.$data, key, {
        enumerable: false,
        configurable: true,
        get: function() {
          console.log(`获取${value}`);
          return value;
        },
        set: function(newVal) {
          console.log(`更新${newVal}`);
          if (value !== newVal) {
            value = newVal;
            binding._directives.forEach((item) => {
              item.update();
            })
          }
        }
      });
    }
  }
}

MyVue.prototype._compile = function(root) {
  var _this = this;
  var nodes = root.children;

  for (let i = 0; i < nodes.length; i++) {

    let node = nodes[i];

    if (node.children.length) {
      this._compile(node);
    }

    if (node.hasAttribute('v-click')) {
      node.onclick = (function() {
        let attrVal = nodes[i].getAttribute('v-click');
        return _this.$methods[attrVal].bind(_this.$data);
      })();
    }

    if (node.hasAttribute("v-model") && (node.tagName == "INPUT" || node.tagName == "TEXTAREA")) {
      node.addEventListener("input", (function(node) {
        console.log(node)
        let attrVal = node.getAttribute("v-model");
        _this._binding[attrVal]._directives.push(new Watcher("input", node, _this, attrVal, "value"));
        return function() {
          console.log(_this.$data)
          _this.$data[attrVal] = node.value;
        };
      })(node));
    }

    if (node.hasAttribute("v-bind")) {
      let attrVal = node.getAttribute("v-bind");
      _this._binding[attrVal]._directives.push(new Watcher("text", node, _this, attrVal, "innerHTML"));
    }
  }
}

function Watcher(name, el, vm, exp, attr) {
  this.name = name; //指令名称
  this.el = el; //指令对应的DOM元素
  this.vm = vm; //指令所属的MyVue实例
  this.exp = exp; //指令对应的值
  this.attr = attr; //绑定的属性值

  this.update();
}

Watcher.prototype.update = function() {
  this.el[this.attr] = this.vm.$data[this.exp];
};