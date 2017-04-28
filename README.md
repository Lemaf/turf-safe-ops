# turf-safe-ops
Turf module for pre- and post-processing geometries in order to make basic operations safe.

Only _safeIntersect_, _safeDifference_ and _safeUnion_ for __polygon arguments__ are implemented so far.

Turf-safe-ops tries to make ensure that the operation will not produce collections with linestrings and point as "artifacts". The implemented operations remove these artifacts and calls __turk.unkinkPolygon__ if needed.

### Usage

The operations follow the original method signature:

```
var turfSafeOps = require('turf-safe-ops');

var result = turfSafeOps.safeIntersect(geomA, geomB);
```
