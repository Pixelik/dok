module.exports = function($virtualDOM, getHTML) {
  // loop through each <section type="example">
  $virtualDOM('section[type="example"]').each(function(index, section) {
    let $section = $virtualDOM(section);

    // create proper HTML tags for <title>, <subtitle> & <description>
    let $title = $virtualDOM(section).find('title');
    let titleHTML = `<div class="title">${getHTML($title)}</div>`;
    let $subtitle = $virtualDOM(section).find('subtitle');
    let subtitleHTML = `<div class="subtitle">${getHTML($subtitle)}</div>`;
    let $description = $virtualDOM(section).find('description');
    let descriptionHTML = `<div class="description">${getHTML($description)}</div>`;

    // place them inside column
    let leftColumnHTML = `<div class="column">
                            ${titleHTML}
                            ${subtitleHTML}
                            ${descriptionHTML}
                          </div>`;

    // create proper HTML tag for <example>
    let $example = $section.find('example');
    let exampleHTML = `<div class="example">${getHTML($example)}</div>`;

    // place it inside column
    let rightColumnHTML = `<div class="column">${exampleHTML}</div>`;

    // build proper <section> HTML
    $section.html(`${leftColumnHTML}${rightColumnHTML}`);
  });
}