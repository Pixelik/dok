const path = require('path');
const fse = require('fs-extra');
const html = require('html');

const TAGS = {
  SECTION: 'section',
  TITLE: 'title',
  SUBTITLE: 'subtitle',
  DESCRIPTION: 'description',
  EXAMPLE: 'example',
  COMPONENT: 'component'
}

module.exports = function(pathToWrite, file, $virtualDOM, cb) {
  const getHTML = function($el) {
    return $virtualDOM('<textarea/>').html($el.html()).text().trim();
  };

  const fileName = path.parse(file).name;

  let sectionsHTML = '';
  let extractedComponents = [];

  // get content of file: /blocks/{some-block}/{some-block}.hbs
  let content = fse.readFileSync(file).toString('utf-8');

  // place content in virtual DOM to perform operations
  $virtualDOM('body').html(content);

  // loop through each <section> and rebuild its HTML properly
  $virtualDOM(TAGS.SECTION).each(function(index, section) {
    let $section = $virtualDOM(section);

    // create proper HTML tags for <title>, <subtitle> & <description>
    let $title = $virtualDOM(section).find(TAGS.TITLE);
    let titleHTML = `<div class="title">${getHTML($title)}</div>`;
    let $subtitle = $virtualDOM(section).find(TAGS.SUBTITLE);
    let subtitleHTML = `<div class="subtitle">${getHTML($subtitle)}</div>`;
    let $description = $virtualDOM(section).find(TAGS.DESCRIPTION);
    let descriptionHTML = `<div class="description">${getHTML($description)}</div>`;

    // place them inside column
    let leftColumnHTML = `<div class="column">
                            ${titleHTML}
                            ${subtitleHTML}
                            ${descriptionHTML}
                          </div>`;

    // replace all custom <component> tags (found inside <example>) with their containing HTML
    // store above HTML to make re-usable partials out of it
    $section.find(TAGS.COMPONENT).each(function(index, component) {
      let $component = $virtualDOM(component);
      let name = $component.attr('name');
      let html = getHTML($component);
      $virtualDOM(html).insertAfter($component);

      // remove <component> so that it's not found inside exampleHTML further down
      $component.remove();

      // store component name & html to make a reusable handlebars partial out of it later
      if (name) {
        extractedComponents.push({ name, html });
      }
    });

    // create proper HTML tag for <example>
    let $example = $section.find(TAGS.EXAMPLE);
    let exampleHTML = `<div class="example">${getHTML($example)}</div>`;

    // place it inside column
    let rightColumnHTML = `<div class="column">${exampleHTML}</div>`;

    // build proper <section> HTML
    sectionsHTML += `<div class="section">
                      ${leftColumnHTML}
                      ${rightColumnHTML}
                     </div>`;
  });

  let finalContent = html.prettyPrint(`<!-- block: ${fileName} -->\n\n${sectionsHTML}\n\n`, {
    indent_size: 2
  });

  fse.writeFileSync(`${pathToWrite}/${fileName}.hbs`, finalContent);

  cb(extractedComponents);
}