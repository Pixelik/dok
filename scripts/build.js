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

const replaceCustomTags = require('./replaceCustomTags');
const buildCss = require('./buildCss');

const tempPath = './temp';
const customTagsReplacedPath = `${tempPath}/blocks/replaced_custom_tags`;
const blocksCompiledPath = `${tempPath}/blocks/compiled`;

fse.emptyDirSync(tempPath);
fse.ensureDirSync(customTagsReplacedPath);
fse.ensureDirSync(blocksCompiledPath);

// replace custom tags in /blocks/{block}/{block}.hbs
let originalBlocks = glob.sync(`./blocks/*/*.hbs`);
originalBlocks.forEach((originalBlock) => {
  replaceCustomTags(customTagsReplacedPath, originalBlock, $, function(extractedComponents) {

    // register components extracted from /blocks/{block}/{block}.hbs as handlebars partials
    extractedComponents.forEach((component) => {
      hbs.registerPartial(component.name, component.html);
    });
  });
});

// compile all ./temp/blocks/replacec_custom_tags/{block}.hbs
let blocksWithReplacedCustomTags = glob.sync(`${customTagsReplacedPath}/*.hbs`);
blocksWithReplacedCustomTags.forEach((blockWithReplacedCustomTags) => {
  let fileName = path.parse(blockWithReplacedCustomTags).name;
  let raw = fse.readFileSync(blockWithReplacedCustomTags).toString('utf-8');
  let template = hbs.compile(raw);
  let compiled = template({});
  fse.writeFileSync(`${blocksCompiledPath}/${fileName}.html`, html.prettyPrint(compiled, {
    indent_size: 2
  }));
});

buildCss();

console.log(`time = ${(new Date().getTime() - start) / 1000}`);