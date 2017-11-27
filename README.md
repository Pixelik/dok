# dok

`npm install && make serve`

1. `/content/blocks/${block}/${block}.xml` is where you write the documentation for your block
2. each block-documentation is split up into `<section>`s
3. each `<section>` consists of a `<title>`, `<subtitle>`, `<description>` and an `<example>`. These are custom xml tags that will be replaced with standard HTML tags with "dok" classes/styling (TODO)
4. each `<example>` will contain the HTML that generates an example-implemenation of that block
5. anything inside `<example>` that is wrapped inside an `<hbs name="${component-name}">` becomes a globally re-usable component
6. anything wrapped in `<md>` is markdown (i.e. can contain markdown _and_ HTML)
7. `/content/templates/${some-template}.hbs` is where you write the HTML that will generate an example-page that will be using any number of `block`s. The re-usable components mentioned earlie can be called inside these templates by `{{> component-name}}`
8. `/content/index.hbs` consists of the main scaffolding of the documentation site (everything will exists in one single page except for the templates (example-pages) mentioned earlier.
