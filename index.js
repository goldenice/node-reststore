'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');

function RestStore(url, validator, modelIdParam) {
    if (!(this instanceof RestAdapt)) return new RestAdapt(url);
    this._url = url;
    if (this._url.slice(-1) != '/') this._url += '/';
    this._validator = validator || null;
    this._modelIdParam = modelIdParam || 'id';
}

RestAdapt.prototype.getAll = function readAll() {
    return new Promise(function(resolve, reject) {
        fetch(this._url, { method: 'get' })
            .then(function(res) { return res.json(); })
            .then(resolve)
            .catch(reject);
    }.bind(this));
}

RestAdapt.prototype.get = function read(id) {
    return new Promise(function(resolve, reject) {
        fetch(this._url + id, { method: 'get' })
            .then(function(res) { return res.json(); })
            .then(resolve)
            .catch(reject);
    }.bind(this));
}

RestAdapt.prototype.save = function save(object) {
    return new Promise(function(resolve, reject) {
        function doRequest() {
            fetch(this._url + (typeof object[this._modelIdParam] != 'undefined') ? object[this._modelIdParam] : '', { method: (typeof object[this._modelIdParam] != 'undefined') ? 'put' : 'post' })
                .then(function(res) { return res.json(); });
                .then(resolve)
                .catch(reject);
        }

        if (typeof this._validator == 'function') {
            this._validator.then(doRequest).catch(reject);
        } else {
            doRequest();
        }
    }.bind(this));
}

RestAdapt.prototype.delete = function delete(object) {
    return new Promise(function(resolve, reject) {
        fetch.doRequest(this._url + object[this._modelIdParam], { method: 'delete' })
            .then(function() { resolve(); })
            .catch(reject);
    });
}

module.exports = RestAdapt;
