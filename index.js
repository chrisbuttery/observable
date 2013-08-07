function Observable(obj){
  if(obj) return mixin(obj);
  this.attributes = {};
};

// Give the observable the exact same events as backone
_.extend(Observable.prototype, Backbone.Events);

// if an object of events were passed through, add them to the Observable prototype
function mixin(obj) {
  for (var key in Observable.prototype) {
    obj[key] = Observable.prototype[key];
  }
  return obj;
}

// Set method
// 1. if there isnt an options obj create an empty one
// 2. check if the key is an object
//    .set({
//      name: "bruce",
//      age: "24"
//    )};
//
// 3. loop thought object and pass through key, value, options to _set
Observable.prototype.set = function(key, value, options) {
  options = options || {};

  if( _.isObject(key) === true ) {
    options = value;
    _(key).each(function(value, key) {
      this._set(key, value, options);
    }, this);
  }
  else {
    this._set(key, value, options);
  }

  return this;
};

// take the key, value, options values and set them on 'this.attributes' object
// if silent is set to true .set('foo', 'bar', { silent: true }), don't emit an event.

Observable.prototype._set = function(key, val, options) {
  options = options || {};
  var silent = options.silent || false;
  var previous = this.attributes[key];
  if( previous === val ) return; // No change
  this.attributes[key] = val;

  if(!silent) {
    this.trigger('change', key, val, previous);
    this.trigger('change:'+key, val, previous);
  }
};

// get method
Observable.prototype.get = function(key) {
  return this.attributes[key];
};

// call this.attributes in a callback() in a speific context
Observable.prototype.each = function(callback, context) {
  _(this.attributes).each(callback, context);
};

module.exports = Observable;
