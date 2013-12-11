// # vim: set shiftwidth=2 tabstop=2 softtabstop=2 expandtab:
  
var datgui = require('dat-gui');

module.exports = function(game, opts) {
  return new PluginsUI(game, opts);
};

function PluginsUI(game, opts) {
  this.game = game;
  this.plugins = this.game.plugins;

  opts = opts || {};

  this.gui = opts.gui || new datgui.GUI();
  this.folder = this.gui.addFolder('plugins');

  this.pluginState = {};
  this.pluginItems = {};

  // add all existing plugins, already loaded
  var list = this.plugins.listAll();
  for (var i = 0; i < list.length; ++i) {
    this.addPlugin(list[i]);
  }

  // and listen for events for new plugins, which haven't loaded yet
  this.plugins.on('new plugin', function(name) {
    self.addPlugin(name);
  });

  // update GUI when plugin is enabled/disabled by something else
  var self = this;
  this.plugins.on('plugin enabled', function(name) {
    self.pluginState[name] = true;
    self.pluginItems[name].updateDisplay();
  });

  this.plugins.on('plugin disabled', function(name) {
    self.pluginState[name] = false;
    self.pluginItems[name].updateDisplay();
  });
}

// add plugin checkbox widget
PluginsUI.prototype.addPlugin = function (name) {
  this.pluginState[name] = this.plugins.isEnabled(name);
  this.pluginItems[name] = this.folder.add(this.pluginState, name);
  this.pluginItems[name].onChange(setStateForPlugin(this, name));
};

// set new plugin state when user toggles it in GUI
function setStateForPlugin(self, name) {
  return function(newState) {
    if (newState)
      self.plugins.enable(name);
    else
      self.plugins.disable(name);
  };
}
