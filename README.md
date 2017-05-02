# turf-safe-ops
Turf module for pre- and post-processing geometries in order to make basic operations safe. It allows invalid geometries to be passed to the operations and attempts to make the output valid.

Turf-safe-ops tries to make sure that the operation will not produce collections with linestrings and point as "artifacts". The implemented operations remove these artifacts and calls __turf.unkinkPolygon__ if needed.

Only _safeIntersect_, _safeDifference_ and _safeUnion_ for __polygon arguments__ are implemented so far.

### Usage

The operations follow the original method signature:

```
var turfSafeOps = require('turf-safe-ops');

var result = turfSafeOps.safeIntersect(geomA, geomB);
```

For __safeIntersect__ and __safeDifference__, there's an extra parameter that can be passed, _inputBufferConfig = {min: minBufferValue, max: maxBufferValue}_. This parameter will be used only if the operation between the input geometries fails. In this case, turf_safe_ops will try to apply buffers from _minBufferValue_ to _maxBufferValue_, with 10x increments, to the geometries (one at a time) until the operation succeeds.

```
var turfSafeOps = require('turf-safe-ops');

/*
If geomA.intersect(geomB) fails, geomA will be buffered by 0.0000001.
If geomA.intersect(geomB) fails again, geomB will be buffered by 0.0000001.
If geomA.intersect(geomB) fails, geomA will be buffered by 0.0000001 * 10.
...
Until it succeeds, or _inputBufferConfig.max = 0.001_ is reached.
 */
var result = turfSafeOps.safeIntersect(geomA, geomB, {min: 0.0000001, max: 0.001});
```