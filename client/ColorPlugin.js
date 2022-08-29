'use strict';

var domify = require('min-dom/lib/domify');
var ColorPicker = require('simple-color-picker');
var getDi = require('bpmn-js/lib/util/ModelUtil').getDi;

function ColorPlugin(eventBus, bpmnRules, editorActions, canvas, commandStack) {
  var self = this;
  this.commandStack = commandStack;

  editorActions.register({
    toggleColorPicker: function() {
      self.toggle(canvas);
    }
  });

  eventBus.on('selection.changed', function(e) {
    self.selectedElement = e.newSelection[0];
    var color = ColorPlugin.prototype._getColor(self.selectedElement);
    if (color != null  && self.colorPicker != null) {
      self.colorPicker.setColor(color);
    }
  });
}

ColorPlugin.prototype._getColor = function(element) {
  if (element != null) {
    var di = getDi(element);

    return di && di.get('fill') || null;
  }
  return null;
}

ColorPlugin.prototype.toggle = function(canvas) {
  if (this.isActive) {
    this.colorPicker.remove();
    document.getElementById('colorpicker').remove();
    this.isActive = false;
  } else {
    this.isActive = true;
    this.addColorPicker(canvas.getContainer().parentNode);
  }
};

ColorPlugin.prototype.addColorPicker = function(container) {
  var self = this;
  var pickerColor = '#FF0000';
  var markup = '<div id="colorpicker" class="colorpicker-container"></div>';
  var element = domify(markup);

  container.appendChild(element);

  if (self.selectedElement != null) {
    var color = ColorPlugin.prototype._getColor(self.selectedElement);
    if (color != null) {
      pickerColor = color;
    }
  }

  this.colorPicker = new ColorPicker({
    color: pickerColor,
    background: '#000000',
    el: element,
    width: 210,
    height: 200
  });

  this.colorPicker.onChange(function() {
    var hexString = self.colorPicker.getHexString();
    if (self.selectedElement != null) {
      self.commandStack.execute('element.setColor', {
        elements: [self.selectedElement],
        colors: { fill: hexString }
      });
    }
  });
};

ColorPlugin.$inject = [ 'eventBus', 'bpmnRules', 'editorActions', 'canvas', 'commandStack' ];

module.exports = {
  __init__: [ 'colorPlugin' ],
  colorPlugin: [ 'type', ColorPlugin ]
};
