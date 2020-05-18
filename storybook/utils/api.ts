interface Component {
  name: string;
  selector: string;
  description: string;
  inputs: ReadonlyArray<Input>;
  outputs: ReadonlyArray<Output>;
}

interface Input {
  name: string;
  definedInClass: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
}

interface Output {
  name: string;
  type: string;
  description: string;
}

interface StorybookNotes {
  notes: {
    markdown: string;
  };
}

export const generateDocumentation = (input: any): StorybookNotes => {
  const component = input as Component;

  const renderComponentSummary = (component: Component) => `# ${component.name}

${
  component.description !== undefined
    ? component.description
    : '(No description)'
}

## Selector

<code>${component.selector}</code>
`;

  const renderInputs = (component: Component) => {
    if (component.inputs.length === 0) {
      return '';
    }

    return (
      `## Inputs

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>` +
      Object.assign([], component.inputs)
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => (a.required === b.required ? 0 : a.required ? -1 : 1))
        .map(
          prop => `
      <tr>
        <td>${prop.name}${
            prop.required
              ? '<span style="color: #e60000; cursor: help;" title="Required">*</span>'
              : ''
          }<div style="display: ${
            prop.definedInClass !== component.name ? 'block' : 'none'
          }; font-size: .7em;">from&nbsp;${prop.definedInClass}</div></td>
        <td>${prop.type}</td>
        <td>${prop.default !== undefined ? prop.default : ''}</td>
        <td>${prop.description ? prop.description : ''}</td>
      </tr>`
        )
        .join('') +
      `</tbody>
</table>`
    );
  };

  const renderOutputs = (component: Component) => {
    if (component.outputs.length === 0) {
      return '';
    }

    return (
      `## Outputs

<table>
<thead>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>` +
      Object.assign([], component.outputs)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(
          prop => `
    <tr>
    <td>${prop.name}<div style="display: ${
            prop.definedInClass !== component.name ? 'block' : 'none'
          }; font-size: .7em;">from&nbsp;${prop.definedInClass}</div></td>
      <td>${prop.type}</td>
      <td>${prop.description ? prop.description : ''}</td>
    </tr>`
        )
        .join('') +
      `</tbody>
</table>`
    );
  };

  const template = [
    renderComponentSummary(component),
    renderInputs(component),
    renderOutputs(component)
  ].join('\n');

  return {notes: {markdown: template}};
};
