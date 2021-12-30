# progress-of

Get progress and ETA of an iterator.

* Pretty, human-readable percentages and time estimates
* Gives you the data to print, doesn't log itself – cross-platform

## Install

```sh
npm install progress-of
```

## Example

```js
import progressOf from 'progress-of'

for await(const [item, p] of progressOf([1, 2, 3])) {
  console.log(p.message) // 10% [1/10] ETA: 1m Elapsed: 10s
  console.log(`${p.percentPretty} [${p.counter}/${p.total}] ETA: ${p.etaPretty} Elapsed: ${p.elapsedPretty}`)
}
```

## API

```js
for(const [, progress] of progressOf(iterable)) {}
```

* **`iterable`** `[Iterable]` Iterable to iterate over
* **`progress.eta`** `[string]` Human readable current ETA (between 0 & ∞)
* **`progress.elapsed`** `[string]` Human readable time elapsed since start
* **`progress.percent`** `[string]` Human readable current percentage done
* **`progress.message`** `[string]` Human readable message, like: `10% [1/10] ETA: 1m Elapsed: 10s`
* **`progress.etaValue`** `[number]` ETA (in ms)
* **`progress.elapsedValue`** `[number]` Elapsed time (in ms)
* **`progress.percentValue`** `[number]` Percent value (between 0 & 100)
* **`progress.ratio`** `[number]` Fraction of items done (between 0 & 1)
* **`progress.current`** `[number]` Current counter of the iterable
* **`progress.total`** `[number]` Total size of the iterable

## Libraries Used

* [simple-eta](https://github.com/legraphista/eta)
* [pretty-ms](https://github.com/sindresorhus/pretty-ms)
