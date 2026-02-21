import classnames from 'classnames'

type OptionsObj = Record<string, any>
type Options = string | OptionsObj

export const getGlobalClassName = (rootClass: string, options: Options) => {
  if (typeof options === 'string') {
    return `${rootClass}-${options}`
  }
  const mappedOptions: OptionsObj = {}
  for (const option in options) {
    mappedOptions[`${rootClass}--${option}`] = options[option]
  }
  return classnames({ [rootClass]: true, ...mappedOptions })
}

const getClassNameFactory =
  (
    rootClass: string,
    styles: Record<string, string>,
    config: { baseClass?: string } = { baseClass: '' }
  ) =>
  (options: Options = {}) => {
    if (typeof options === 'string') {
      const descendant = options
      const style = styles[`${rootClass}-${descendant}`]
      if (style) return config.baseClass + style
      return ''
    }
    if (typeof options === 'object') {
      const modifiers = options
      const prefixedModifiers: OptionsObj = {}
      for (const modifier in modifiers) {
        prefixedModifiers[styles[`${rootClass}--${modifier}`]] = modifiers[modifier]
      }
      const c = styles[rootClass]
      return config.baseClass + classnames({ [c]: !!c, ...prefixedModifiers })
    }
    return config.baseClass + (styles[rootClass] || '')
  }

export default getClassNameFactory
