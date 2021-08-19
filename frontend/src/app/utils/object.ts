export function isEmpty(obj: any) {
    return (
      obj === null ||
      obj === undefined ||
      obj === '' ||
      obj.length === 0
    )
  }
  
  export function isUndefined(obj: object) {
    return obj === undefined
  }
  
  export function isObject(obj: any) {
    return typeof obj === 'object'
  }
  