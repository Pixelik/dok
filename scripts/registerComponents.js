const hbs = require('handlebars');

module.exports = function($virtualDOM, getHTML) {
  $virtualDOM('hbs[name]').each(function(index, component) {
    let $component = $virtualDOM(component);
    let name = $component.attr('name');
    let html = getHTML($component);
    $virtualDOM(html).insertAfter($component);
    $component.remove();
    hbs.registerPartial(name, html);
  });
}