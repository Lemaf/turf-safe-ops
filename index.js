// depend on jsts for now http://bjornharrtell.github.io/jsts/
var jsts = require('jsts');

var safe_helpers = require('./helpers');
var removePointsAndLinestrings = safe_helpers.removePointsAndLinestrings;
var getValidJSTSPolygon = safe_helpers.getValidJSTSPolygon;

var reader = new jsts.io.GeoJSONReader(),
    writer = new jsts.io.GeoJSONWriter();

/**
 * Safe intersect between polygons.
 */
var safeIntersect = function (poly1, poly2) {

    var geom1, geom2;
    if (poly1.type === 'Feature') geom1 = poly1.geometry;
    else geom1 = poly1;
    if (poly2.type === 'Feature') geom2 = poly2.geometry;
    else geom2 = poly2;

    var a = getValidJSTSPolygon(geom1, reader);
    var b = getValidJSTSPolygon(geom2, reader);

    var result = a.intersection(b);

    if (result.isEmpty()) {
        return undefined;
    }

    result = removePointsAndLinestrings(result);

    var writer = new jsts.io.GeoJSONWriter();

    var geojsonGeometry = writer.write(result);

    return {
        type: 'Feature',
        properties: {},
        geometry: geojsonGeometry
    };

};

/**
 * Safe difference between polygons.
 */
var safeDifference = function (poly1, poly2) {

    var geom1, geom2;
    if (poly1.type === 'Feature') geom1 = poly1.geometry;
    else geom1 = poly1;
    if (poly2.type === 'Feature') geom2 = poly2.geometry;
    else geom2 = poly2;

    var a = getValidJSTSPolygon(geom1, reader);
    var b = getValidJSTSPolygon(geom2, reader);

    var result = a.difference(b);

    if (result.isEmpty()){
        return undefined;
    };

    result = removePointsAndLinestrings(result);

    var geojsonGeometry = writer.write(result);

    poly1.geometry = result;

    return {
        type: 'Feature',
        properties: poly1.properties,
        geometry: geojsonGeometry
    };

};

/**
 * Safe union between polygons.
 */
var safeUnion = function() {

    var geom,
        poly = arguments[0];
    if (poly.type === 'Feature') geom = poly.geometry;
    else geom = poly;

    var result = getValidJSTSPolygon(geom, reader);

    for (var i = 1; i < arguments.length; i++) {
        poly = arguments[i];
        if (poly.type === 'Feature') geom = poly.geometry;
        else geom = poly;
        result = result.union(getValidJSTSPolygon(geom, reader));
    }

    result = removePointsAndLinestrings(result);

    result = writer.write(result);

    return {
        type: 'Feature',
        geometry: result,
        properties: arguments[0].properties
    };

};

/**
 * Same as safeUnion, but expects the last argument to be a
 * buffer value to apply to the result.
 */
var safeUnionWithBuffer = function() {

    var geom,
        poly = arguments[0];
    if (poly.type === 'Feature') geom = poly.geometry;
    else geom = poly;

    var result = getValidJSTSPolygon(geom, reader);

    for (var i = 1; i < arguments.length -1; i++) {
        poly = arguments[i];
        if (poly.type === 'Feature') geom = poly.geometry;
        else geom = poly;
        result = result.union(getValidJSTSPolygon(geom, reader));
    }

    result = removePointsAndLinestrings(result);

    var bufferValue = arguments[arguments.length - 1];

    result = result.buffer(bufferValue || 0.0);

    result = writer.write(result);

    return {
        type: 'Feature',
        geometry: result,
        properties: arguments[0].properties
    };

};

module.exports = {
    safeIntersect: safeIntersect,
    safeDifference: safeDifference,
    safeUnion: safeUnion
};