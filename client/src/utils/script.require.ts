/**
 * Load an external script.
 *
 * @param {string} url Absolute URL of script to load
 * @param {string=} name Name of global variable that the script is expected to define
 * @return {Promise}
 */

class ScriptRequire {
  private _cache: any = {};
  private _promise: any;

  requestScript(url: string, name: string) {
    if (this._cache.hasOwnProperty(name)) {
      this._promise = this._cache[name];
    } else {
      this._promise = new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.onerror = event => reject(new Error(`Failed to load '${url}'`));
        script.onload = resolve;
        script.async = true;
        script.src = url;

        if (document.currentScript) {
          document.currentScript.parentNode.insertBefore(script, document.currentScript);
        } else {
          (document.head || document.getElementsByTagName('head')[0]).appendChild(script);
        }
      });

      this._cache[name] = this._promise;
    }

    return this._promise.then(() => {
      if (global[name]) {
        return global[name];
      } else {
        throw new Error(`"${name}" was not created by "${url}"`);
      }
    });
  }
}

const script = new ScriptRequire();

export {script};
