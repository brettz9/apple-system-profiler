# apple-system-profiler

wrapper around apple's `system_profiler` that parses the output

## usage

```js
import {systemProfiler as asp} from 'apple-system-profiler';

// Grab graphics, hardware, and memory info
// and parse them out as a JavaScript object

try {
  const out = await asp({
    dataTypes: [
      'SPDisplaysDataType',
      'SPHardwareDataType',
      'SPMemoryDataType'
    ]
    /*
    Other options (with defaults):
        detailLevel: 'mini', // mini|basic|full
        cwd: undefined,
        maxBuffer: Infinity,
        normalize: true // Set to `false` to get raw, untransformed JSON data
    */
  });
  console.log(out);
} catch (err) {
  console.log(err);
  throw err;
}
```

There is also `listDataTypes` method which resolves to the system's available
`dataTypes`.

```js
const jsonArray = await listDataTypes();
console.log('jsonArray', jsonArray);
```

see `test.js`
