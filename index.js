import {promisify} from 'node:util';
import childProcess from 'node:child_process';
import plist from 'plist';

const exec = promisify(childProcess.exec);

/**
 * @param {{
 *   dataTypes?: string[],
 *   maxBuffer?: number,
 *   timeout?: number|string,
 *   detailLevel?: "mini"|"basic"|"full",
 *   normalize?: boolean,
 *   cwd?: string
 * }} opts
 * @param {(err: NodeJS.ErrnoException|null, out?: unknown|Info[]) => void} [cb]
 */
// eslint-disable-next-line promise/prefer-await-to-callbacks -- Alternative API
export const systemProfiler = async function (opts, cb) {
  opts = opts || {};
  const dataTypes = opts && Array.isArray(opts.dataTypes)
    ? opts.dataTypes
    : [];

  const detailLevel = opts.detailLevel &&
    ['mini', 'basic', 'full'].includes(opts.detailLevel)
    ? opts.detailLevel
    : 'mini';

  try {
    const {
      stdout
    } = await exec(
      `/usr/sbin/system_profiler -xml -detailLevel ${detailLevel} ${
        dataTypes.join(' ')
      } ${opts.timeout ? ` -timeout ${opts.timeout}` : ''}`,
      {
        cwd: opts.cwd,
        maxBuffer: opts.maxBuffer || Infinity
      }
    );
    const out = parse(stdout, opts.normalize !== false);
    if (cb) {
      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line promise/prefer-await-to-callbacks -- Alternative API
      cb(null, out);
      return out;
    }
    return out;
  } catch (err) {
    if (cb) {
      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line promise/prefer-await-to-callbacks -- Alternative API
      cb(/** @type {NodeJS.ErrnoException} */ (err));
      return '';
    }
    throw err;
  }
};

/**
 * @typedef {{
 *   name: string,
 *   items: import('plist').PlistValue,
 *   properties: import('plist').PlistValue
 * }} Info
 */

/**
 * @param {string} buf
 * @param {boolean} normalize
 * @returns {Info[]|plist.PlistValue}
 */
function parse (buf, normalize) {
  const data = /** @type {import('plist').PlistArray} */ (
    plist.parse(buf.toString())
  );
  const out = normalize
    ? data.reduce((acc, sec) => {
      // eslint-disable-next-line unicorn/prefer-spread -- Performance?
      return /** @type {import('plist').PlistArray} */ (acc).concat({
        name: /** @type {{_dataType: string}} */ (sec)._dataType,
        items: /** @type {{_items: [import('plist').PlistValue]}} */ (
          sec
        )._items[0],
        properties: /** @type {{_properties: import('plist').PlistValue}} */ (
          sec
        )._properties
      });
    }, [])
    : data;
  return out;
}

/**
 * @param {{
 *   cwd?: string
 *   maxBuffer?: number
 * }} [opts]
 * @param {(err: NodeJS.ErrnoException|null, json?: string[]) => void} [cb]
 */
// eslint-disable-next-line promise/prefer-await-to-callbacks -- Alternative API
export const listDataTypes = async function (opts, cb) {
  opts = opts || {};
  try {
    const {
      stdout
    } = await exec(`/usr/sbin/system_profiler -listDataTypes`, {
      cwd: opts.cwd,
      maxBuffer: opts.maxBuffer || Infinity
    });
    const json = stdout.trim().split('\n').slice(1);
    if (cb) {
      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line promise/prefer-await-to-callbacks -- Alternative API
      cb(null, json);
      return json;
    }
    return json;
  } catch (err) {
    if (cb) {
      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line promise/prefer-await-to-callbacks -- Alternative API
      cb(/** @type {NodeJS.ErrnoException} */ (err));
      return '';
    }
    throw err;
  }
};
