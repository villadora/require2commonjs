define([
  'backbone',
  'zepto',
  'base/view/layout',
  'view/common/alert'
], function(Backbone, $, LayoutView, AlertModal) {
  var App = {};

  _.extend(App, Backbone.Events);

  try {
    init();

    function init() {
      return "Init Msg";
    }
  } catch (e) {
    return {};
  }

  return App;
})