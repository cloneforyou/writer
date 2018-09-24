const isPlainObject = (obj: any) => {
  if (!obj || typeof obj !== "object" || obj.nodeType || (obj != null && obj == obj.window)) {
    return false;
  }

  try {
    if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj, "constructor") && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
      return false;
    }
  } catch (e) {
    return false;
  }

  var key;
  for (key in obj) { }
  return key === undefined || Object.prototype.hasOwnProperty.call.call(obj, key);
}

class HttpHelper {
  _buildPrams(prefix: string, obj: any, traditional: boolean, add: Function) {
    // jQeury._buildPrams v1.7.2
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (traditional || /\[\]$/.test(prefix)) {
          add(prefix, item);
        } else {
          this._buildPrams(prefix + "[" + (typeof item === "object"
            ? index
            : "") + "]", item, traditional, add);
        }
      })
    } else if (!traditional && typeof obj === 'object') {
      for (var name in obj) {
        this._buildPrams(prefix + "[" + name + "]", obj[name], traditional, add);
      }
    } else {
      add(prefix, obj);
    }
  }
  parseQeuery(obj: any = {}, traditional = false): string {
    // jQeury.prams v1.7.2
    let ret = <any>[],
      add = (key: any, value: any) => {
        ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
      };

    if (Array.isArray(obj) && isPlainObject(obj)) {
      obj.forEach((item, index) => {
        add(index, item);
      });
    } else {
      for (var prefix in obj) {
        this._buildPrams(prefix, obj[prefix], traditional, add);
      }
    }

    return ret.join('&').replace(/%20/g, '+');
  }

  /**
   *  将data对象处理成formdata对象
   *
   * @param {String} prefix
   * @param {Object} obj
   * @param {String} phpStyle
   * @param {Function} add
   * @memberof HTTPManager
   */
  _buildFormParams(prefix: string, obj: any, phpStyle: boolean, add: Function) {
    //  主要处理数组，fileList file 类型。

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (phpStyle) {
          add(prefix + '[]', item);
        } else {
          this._buildFormParams(prefix, item, phpStyle, add);
        }
      })
    } else if (!phpStyle && typeof obj === 'object' && !obj.length && isPlainObject(obj)) {
      //不是数组，是对象
      for (var name in obj) {
        this._buildFormParams(prefix + "[" + name + "]", obj[name], phpStyle, add);
      }
    } else if (toString.call(obj) === '[object FileList]') {
      for (var i = 0; i < obj.length; i++) {
        if (phpStyle) {
          add(prefix + '[]', obj[i])
        } else {
          add(prefix, obj[i])
        }
      }
    } else {
      add(prefix, obj);
    }
  }
  parseFormData(obj: any, phpStyle: boolean = false): FormData | undefined {
    //  暂不支持二维数组
    console.log(obj);
    if (!obj) {
      return void 0;
    }
    if (toString.call(obj) === '[object FormData]') {
      return obj;
    }
    let form = new FormData();
    let add = (key: string, value: any) => {
      if (~['number', 'string', 'boolean'].indexOf(typeof value)) {
        form.append(key, String(value));

      } else if (~(['[object Blob]', '[object File]'].indexOf(toString.call(obj)))) {
        form.append(key, value, value.name || '' + Date.now())

      } else {
        form.append(key, value);
      }
    };

    for (var prefix in obj) {
      this._buildFormParams(prefix, obj[prefix], phpStyle, add);
    }
    return form;
  }
}

export default new HttpHelper();