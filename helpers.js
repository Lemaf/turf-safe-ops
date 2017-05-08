// depend on jsts for now http://bjornharrtell.github.io/jsts/
var jsts = require('jsts'),
    unkinkPolygon = require('@turf/unkink-polygon'),
        factory = new jsts.geom.GeometryFactory();

/**
 * Removes Linestrings and Points that may appear after an operation
 * such as difference, intersection, etc.
 * If the input is a GeometryCollection, iterates through its
 * geometries and removes all non-(Multi)Polygons, returning a jsts.geom.MultiPolygon.
 */
function removePointsAndLinestrings(geometryJSTS) {

    var type = geometryJSTS.getGeometryType();

    if(type === 'Polygon' || type === 'MultiPolygon') {
        return geometryJSTS;
    }

    if(geometryJSTS.isGeometryCollectionOrDerived()) {

        var geoms = [];
        for (var i = 0; i < geometryJSTS.geometries.length; i++) {
            var geom = geometryJSTS.geometries[i];
            type = geom.getGeometryType();
            // Just ignore other geometry types
            if(type === 'Polygon' || type === 'MultiPolygon') {
                geoms.push(geom);
            }
        }

        return factory.createMultiPolygon(geoms);

    }

}

/**
 * If the input geometry isn't valid, tries to unkink it.
 * Returns the input geometry, if valid, or a valid MultiPolygon out
 * of the "unkinked"(?) input geometry.
 */
function getValidJSTSPolygon(geojson, reader) {

    let polygonJSTS = reader.read(geojson);

    if(polygonJSTS.isValid()) {
        return polygonJSTS;
    }

    if(geojson.type === 'Polygon' || geojson.type === 'MultiPolygon'){
        geojson = {type: 'Feature', geometry: geojson};
    }

    let splitPolygon = unkinkPolygon(geojson);

    if(splitPolygon && splitPolygon.features){

        let jstsPolygons = [];

        for (let i = 0; i < splitPolygon.features.length; i++) {
            jstsPolygons.push(reader.read(splitPolygon.features[i].geometry));
        }

        let multiPolygon = new jsts.geom.GeometryFactory().createMultiPolygon(jstsPolygons);

        if(multiPolygon.isValid()) {
            return multiPolygon;
        }

    }

}


module.exports = {
    removePointsAndLinestrings: removePointsAndLinestrings,
    getValidJSTSPolygon: getValidJSTSPolygon
};
