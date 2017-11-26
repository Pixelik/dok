const htmlFormatter = require('html');
const showdown  = require('showdown');
const converter = new showdown.Converter({
  simpleLineBreaks: true,
  omitExtraWLInCodeBlocks: true,
  noHeaderId: true,
  tables: true,
  simpleLineBreaks: true,
  backslashEscapesHTMLTags: true
});
converter.setFlavor('github');

module.exports = function($virtualDOM, getHTML) {
  $virtualDOM('md').each(function(index, md) {
    let $md = $virtualDOM(md);
    let markdown = getHTML($md);
    markdown = markdown.replace(/(?:\r\n|\r|\n)\s*/g, '\n');
    let html  = htmlFormatter.prettyPrint(converter.makeHtml(markdown), {
      indent_size: 2
    });
    $virtualDOM(html).insertAfter($md);
    $md.remove();
  });
};