import makeEta from 'simple-eta';
import prettyMs from 'pretty-ms';

const lazyKeys = ['etaValue', 'eta', 'rate', 'elapsedValue', 'elapsed', 'percentValue', 'percent', 'message'];

/**
 * @param {Iterable} iterable Iterable to iterate over
 * @param {object} [opts]
 * @yields {[any, progress]}
 * @returns {iterator} Iterator
 * Example:
 * ```js
 * for(const [item, progress] of [1,2,3,4,5...]) {
 *   console.log(progress.message) //=> 10% [1/10] ETA: 1m Elapsed: 10s
 * }
 * ```
 */
export default function* progressOf(iterable) {
  const total = iterable.length ?? iterable.size;
  const start = new Date;
  const eta = makeEta({ max: total });
  for (let current = 0; current < total; current++) {
    eta.report(current);
    const now = new Date;
    const progress = { current, total, start, now };
    lazyGetter(progress, lazyKeys, key => {
      const now = new Date;
      const p = { ...progress };
      const estimate = eta.estimate();
      const isEstimateFinite = isFinite(estimate);
      p.etaValue = estimate * 1000;
      p.rate = eta.rate();
      p.eta = isEstimateFinite ? prettyMs(p.etaValue, { compact: true }) : '∞';
      p.elapsedValue = now - start;
      p.elapsed = prettyMs(p.elapsedValue, { compact: true });
      p.ratio = current / total;
      p.percentValue = p.ratio * 100;
      p.percent = Math.floor(p.percentValue) + '%';
      p.message = `${p.percent} [${current}/${total}] ETA: ${p.eta} Elapsed: ${p.elapsed}`;
      const descriptor = {};
      for (const key in lazyKeys) {
        descriptor[key] = { value: p[key] };
      }
      Object.defineProperties(progress, descriptor);
      return p[key];
    });
    const element = iterable[current];
    yield [element, progress];
  }
}

/**
 * @typedef {object} progress
 * @property {string} eta Human readable current ETA (between 0 & ∞)
 * @property {string} elapsed Human readable time elapsed since start
 * @property {string} percent Human readable current percentage done
 * @property {string} message Human readable message, like: 10% [1/10] ETA: 1m Elapsed: 10s
 * @property {number} etaValue ETA (in ms)
 * @property {number} elapsedValue Elapsed time (in ms)
 * @property {number} percentValue Percent value (between 0 & 100)
 * @property {number} ratio Fraction of items done (between 0 & 1)
 * @property {number} current Current counter of the iterable
 * @property {number} total Total size of the iterable
 */

/**
 * @typedef {object} iterator
 * @property {next} next
 */

/**
 * @callback next
 * @returns {result}
 */

/**
 * @typedef {object} result
 * @property {boolean} done
 * @property {[any, progress]} value
 */


/**
 * Invoke a getter only when a key is looked up in the object
 * @param {object} object The object
 * @param {string} key The key
 * @param {function} get The getter
 * Example:
 * ```js
 * const object = {};
 * const expensive = () => {while(Math.random() < .9999) {} return 1 } // Not called until `object.key` is looked up
 * lazyGetter(object, 'key', expensive)
 * ```
 */
function lazyGetter(object, keys, get) {
  for (const key of keys) {
    Object.defineProperty(object, key, { get() { return get.call(this, key, this) } });
  }
}
