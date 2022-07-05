declare module '*.scss' {
    const classNames: Record<string, string>;
    export default classNames;
}

declare module '*.svg' {
  const classNames: Record<string, string>;
  export default classNames;
}

declare module 'js-cookie'
declare module 'uuid'
declare module 'react-input-mask'