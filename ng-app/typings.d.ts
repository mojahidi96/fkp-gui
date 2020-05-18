/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// required for use of custom ast-loader for storybook
declare module 'ast!*' {
  var content: string;
  export default content;
}
