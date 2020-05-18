var path = require('path');
var {Project} = require('ts-morph');

module.exports = function() {
  var sourcePath = this.resourcePath;

  var project = new Project({
    tsConfigFilePath: path.join(__dirname, '../../../tsconfig.json'),
    addFilesFromTsConfig: false
  });

  var sourceFile = project.addExistingSourceFile(sourcePath);
  var componentClass = sourceFile.getClasses()[0];

  var propertiesByDecorator = function(componentClass, decorator) {
    const allProps = componentClass
      .getProperties()
      .concat(componentClass.getGetAccessors());

    return allProps
      .filter(prop => prop.getDecorator(decorator))
      .map(prop => {
        return {
          name: prop.getName(),
          definedInClass: componentClass.getName(),
          type: prop.getType().getText(prop),
          default:
            prop.getInitializer &&
            prop.getInitializer() &&
            prop.getInitializer().getText(),
          required: !prop.getStructure().hasQuestionToken,
          description:
            (prop.getJsDocs().length && prop.getJsDocs()[0].getInnerText()) ||
            undefined
        };
      })
      .concat(
        componentClass.getBaseClass()
          ? propertiesByDecorator(componentClass.getBaseClass(), decorator)
          : []
      );
  };

  var result = {
    name: componentClass.getName(),
    selector: componentClass
      .getDecorator('Component')
      .getCallExpression()
      .getArguments()[0]
      .getProperties()
      .filter(p => p.getName() === 'selector')[0]
      .getInitializer()
      .getText()
      .slice(1, -1),
    description:
      (componentClass.getJsDocs().length &&
        componentClass.getJsDocs()[0].getInnerText()) ||
      undefined,
    inputs: propertiesByDecorator(componentClass, 'Input'),
    outputs: propertiesByDecorator(componentClass, 'Output')
  };

  return `module.exports = ${JSON.stringify(result)}`;
};

// set to raw to avoid unnecessary UTF-8 conversion, we don't need the source anyway
module.exports.raw = true;
