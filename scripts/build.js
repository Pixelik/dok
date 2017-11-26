/* https://gist.github.com/doug2k1/a58032866d1cfee32375c74aca46d9e2#file-build-js */
const start = new Date().getTime();

const glob = require('glob');
const fse = require('fs-extra');
const path = require('path');
const hbs = require('handlebars');
const html = require('html');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
const $ = require('jquery')(window);

const compileMarkdown = require('./compileMarkdown');
const replaceCustomTags = require('./replaceCustomTags');
const registerComponents = require('./registerComponents');

fse.emptyDirSync('./tmp');
fse.emptyDirSync('./public');

fse.ensureDirSync('./tmp/blocks/markdown_replaced');
fse.ensureDirSync('./tmp/blocks/custom_tags_replaced');
fse.ensureDirSync('./tmp/blocks/components_registered');
fse.ensureDirSync('./public/templates');

const getHTML = function($el) {
  return $('<textarea/>').html($el.html()).text();
};

// parse blocks
let blocks = glob.sync(`./content/blocks/*/*.xml`);
blocks.forEach((block) => {
  let fileName = path.parse(block).name;
  let content = fse.readFileSync(block).toString('utf-8');

  $('body').html(content);

  compileMarkdown($, getHTML);
  fse.writeFileSync(`./tmp/blocks/markdown_replaced/${fileName}.xml`, html.prettyPrint(getHTML($('body')), {
    indent_size: 2
  }));

  replaceCustomTags($, getHTML);
  fse.writeFileSync(`./tmp/blocks/custom_tags_replaced/${fileName}.xml`, html.prettyPrint(getHTML($('body')), {
    indent_size: 2
  }));

  registerComponents($, getHTML);
  fse.writeFileSync(`./tmp/blocks/components_registered/${fileName}.hbs`, html.prettyPrint(getHTML($('body')), {
    indent_size: 2
  }));
});

// compile templates
let templates = glob.sync(`./content/templates/*.hbs`);
templates.forEach((template) => {
  let fileName = path.parse(template).name;
  let content = fse.readFileSync(template).toString('utf-8');
  let hbsTemplate = hbs.compile(content);
  let compiled = hbsTemplate({});
  fse.writeFileSync(`./public/templates/${fileName}.html`, html.prettyPrint(compiled, {
    indent_size: 2
  }));
});

// compile blocks
let allBlocksHTML = '';
let replacedBlocks = glob.sync('./tmp/blocks/components_registered/*.hbs');
replacedBlocks.forEach((replacedBlock) => {
  let fileName = path.parse(replacedBlock).name;
  let content = fse.readFileSync(replacedBlock).toString('utf-8');
  let hbsTemplate = hbs.compile(content);
  allBlocksHTML += hbsTemplate({});
});
hbs.registerPartial('blocks', allBlocksHTML);

// register sections
let sections = glob.sync(`./content/sections/*.hbs`);
sections.forEach((section) => {
  let fileName = path.parse(section).name;
  let content = fse.readFileSync(section).toString('utf-8');
  let template = hbs.compile(content);
  let compiled = template({});
  hbs.registerPartial(fileName, compiled);
});

// compile index
let indexHBS = fse.readFileSync('./content/index.hbs').toString('utf-8');
let indexTemplate = hbs.compile(indexHBS);
let indexHTML = indexTemplate({});
fse.writeFileSync(`./public/index.html`, html.prettyPrint(indexHTML, {
  indent_size: 2
}));

console.log(`time = ${(new Date().getTime() - start) / 1000}`);