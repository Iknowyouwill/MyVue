function Compile(root) {
  this.nodes = root.children;
  var _this = this;
  for (let node in nodes) {
    if (node.children.length) { //检查子元素是否有后代元素
      arguments.callee.call(this, node);
    }

    if (node.hasAttribute('v-click')) {
      node.onclick = (() => {
        var attrVal = nodes[i].getAttributes('v-click');
        return _this.$methods[attrVal].bind(_this.)
      })
    }
  }
}