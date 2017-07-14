(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("regenerator-runtime/runtime");

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"core-js/fn/regexp/escape":2,"core-js/shim":295,"regenerator-runtime/runtime":296}],2:[function(require,module,exports){
require('../../modules/core.regexp.escape');
module.exports = require('../../modules/_core').RegExp.escape;
},{"../../modules/_core":23,"../../modules/core.regexp.escape":119}],3:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],4:[function(require,module,exports){
var cof = require('./_cof');
module.exports = function(it, msg){
  if(typeof it != 'number' && cof(it) != 'Number')throw TypeError(msg);
  return +it;
};
},{"./_cof":18}],5:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"./_hide":40,"./_wks":117}],6:[function(require,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],7:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":49}],8:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object')
  , toIndex  = require('./_to-index')
  , toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , end   = arguments.length > 2 ? arguments[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};
},{"./_to-index":105,"./_to-length":108,"./_to-object":109}],9:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object')
  , toIndex  = require('./_to-index')
  , toLength = require('./_to-length');
module.exports = function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , aLen   = arguments.length
    , index  = toIndex(aLen > 1 ? arguments[1] : undefined, length)
    , end    = aLen > 2 ? arguments[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};
},{"./_to-index":105,"./_to-length":108,"./_to-object":109}],10:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":37}],11:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":105,"./_to-iobject":107,"./_to-length":108}],12:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./_ctx')
  , IObject  = require('./_iobject')
  , toObject = require('./_to-object')
  , toLength = require('./_to-length')
  , asc      = require('./_array-species-create');
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./_array-species-create":15,"./_ctx":25,"./_iobject":45,"./_to-length":108,"./_to-object":109}],13:[function(require,module,exports){
var aFunction = require('./_a-function')
  , toObject  = require('./_to-object')
  , IObject   = require('./_iobject')
  , toLength  = require('./_to-length');

module.exports = function(that, callbackfn, aLen, memo, isRight){
  aFunction(callbackfn);
  var O      = toObject(that)
    , self   = IObject(O)
    , length = toLength(O.length)
    , index  = isRight ? length - 1 : 0
    , i      = isRight ? -1 : 1;
  if(aLen < 2)for(;;){
    if(index in self){
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if(isRight ? index < 0 : length <= index){
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for(;isRight ? index >= 0 : length > index; index += i)if(index in self){
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};
},{"./_a-function":3,"./_iobject":45,"./_to-length":108,"./_to-object":109}],14:[function(require,module,exports){
var isObject = require('./_is-object')
  , isArray  = require('./_is-array')
  , SPECIES  = require('./_wks')('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};
},{"./_is-array":47,"./_is-object":49,"./_wks":117}],15:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};
},{"./_array-species-constructor":14}],16:[function(require,module,exports){
'use strict';
var aFunction  = require('./_a-function')
  , isObject   = require('./_is-object')
  , invoke     = require('./_invoke')
  , arraySlice = [].slice
  , factories  = {};

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /*, args... */){
  var fn       = aFunction(this)
    , partArgs = arraySlice.call(arguments, 1);
  var bound = function(/* args... */){
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if(isObject(fn.prototype))bound.prototype = fn.prototype;
  return bound;
};
},{"./_a-function":3,"./_invoke":44,"./_is-object":49}],17:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":18,"./_wks":117}],18:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],19:[function(require,module,exports){
'use strict';
var dP          = require('./_object-dp').f
  , create      = require('./_object-create')
  , redefineAll = require('./_redefine-all')
  , ctx         = require('./_ctx')
  , anInstance  = require('./_an-instance')
  , defined     = require('./_defined')
  , forOf       = require('./_for-of')
  , $iterDefine = require('./_iter-define')
  , step        = require('./_iter-step')
  , setSpecies  = require('./_set-species')
  , DESCRIPTORS = require('./_descriptors')
  , fastKey     = require('./_meta').fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./_an-instance":6,"./_ctx":25,"./_defined":27,"./_descriptors":28,"./_for-of":37,"./_iter-define":53,"./_iter-step":55,"./_meta":62,"./_object-create":66,"./_object-dp":67,"./_redefine-all":86,"./_set-species":91}],20:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof')
  , from    = require('./_array-from-iterable');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};
},{"./_array-from-iterable":10,"./_classof":17}],21:[function(require,module,exports){
'use strict';
var redefineAll       = require('./_redefine-all')
  , getWeak           = require('./_meta').getWeak
  , anObject          = require('./_an-object')
  , isObject          = require('./_is-object')
  , anInstance        = require('./_an-instance')
  , forOf             = require('./_for-of')
  , createArrayMethod = require('./_array-methods')
  , $has              = require('./_has')
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function(that){
  return that._l || (that._l = new UncaughtFrozenStore);
};
var UncaughtFrozenStore = function(){
  this.a = [];
};
var findUncaughtFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function(key){
    var entry = findUncaughtFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findUncaughtFrozen(this, key);
  },
  set: function(key, value){
    var entry = findUncaughtFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this)['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var data = getWeak(anObject(key), true);
    if(data === true)uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};
},{"./_an-instance":6,"./_an-object":7,"./_array-methods":12,"./_for-of":37,"./_has":39,"./_is-object":49,"./_meta":62,"./_redefine-all":86}],22:[function(require,module,exports){
'use strict';
var global            = require('./_global')
  , $export           = require('./_export')
  , redefine          = require('./_redefine')
  , redefineAll       = require('./_redefine-all')
  , meta              = require('./_meta')
  , forOf             = require('./_for-of')
  , anInstance        = require('./_an-instance')
  , isObject          = require('./_is-object')
  , fails             = require('./_fails')
  , $iterDetect       = require('./_iter-detect')
  , setToStringTag    = require('./_set-to-string-tag')
  , inheritIfRequired = require('./_inherit-if-required');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO = !IS_WEAK && fails(function(){
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new C()
          , index     = 5;
        while(index--)$instance[ADDER](index, index);
        return !$instance.has(-0);
      });
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base, target, C);
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./_an-instance":6,"./_export":32,"./_fails":34,"./_for-of":37,"./_global":38,"./_inherit-if-required":43,"./_is-object":49,"./_iter-detect":54,"./_meta":62,"./_redefine":87,"./_redefine-all":86,"./_set-to-string-tag":92}],23:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],24:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp')
  , createDesc      = require('./_property-desc');

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};
},{"./_object-dp":67,"./_property-desc":85}],25:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":3}],26:[function(require,module,exports){
'use strict';
var anObject    = require('./_an-object')
  , toPrimitive = require('./_to-primitive')
  , NUMBER      = 'number';

module.exports = function(hint){
  if(hint !== 'string' && hint !== NUMBER && hint !== 'default')throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};
},{"./_an-object":7,"./_to-primitive":110}],27:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],28:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":34}],29:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":38,"./_is-object":49}],30:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],31:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys')
  , gOPS    = require('./_object-gops')
  , pIE     = require('./_object-pie');
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
},{"./_object-gops":73,"./_object-keys":76,"./_object-pie":77}],32:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , hide      = require('./_hide')
  , redefine  = require('./_redefine')
  , ctx       = require('./_ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target)redefine(target, key, out, type & $export.U);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":23,"./_ctx":25,"./_global":38,"./_hide":40,"./_redefine":87}],33:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};
},{"./_wks":117}],34:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],35:[function(require,module,exports){
'use strict';
var hide     = require('./_hide')
  , redefine = require('./_redefine')
  , fails    = require('./_fails')
  , defined  = require('./_defined')
  , wks      = require('./_wks');

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , fns      = exec(defined, SYMBOL, ''[KEY])
    , strfn    = fns[0]
    , rxfn     = fns[1];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return rxfn.call(string, this); }
    );
  }
};
},{"./_defined":27,"./_fails":34,"./_hide":40,"./_redefine":87,"./_wks":117}],36:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};
},{"./_an-object":7}],37:[function(require,module,exports){
var ctx         = require('./_ctx')
  , call        = require('./_iter-call')
  , isArrayIter = require('./_is-array-iter')
  , anObject    = require('./_an-object')
  , toLength    = require('./_to-length')
  , getIterFn   = require('./core.get-iterator-method')
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
},{"./_an-object":7,"./_ctx":25,"./_is-array-iter":46,"./_iter-call":51,"./_to-length":108,"./core.get-iterator-method":118}],38:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],39:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],40:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":28,"./_object-dp":67,"./_property-desc":85}],41:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":38}],42:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":28,"./_dom-create":29,"./_fails":34}],43:[function(require,module,exports){
var isObject       = require('./_is-object')
  , setPrototypeOf = require('./_set-proto').set;
module.exports = function(that, target, C){
  var P, S = target.constructor;
  if(S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf){
    setPrototypeOf(that, P);
  } return that;
};
},{"./_is-object":49,"./_set-proto":90}],44:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],45:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":18}],46:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./_iterators')
  , ITERATOR   = require('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":56,"./_wks":117}],47:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":18}],48:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./_is-object":49}],49:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],50:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object')
  , cof      = require('./_cof')
  , MATCH    = require('./_wks')('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
},{"./_cof":18,"./_is-object":49,"./_wks":117}],51:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./_an-object":7}],52:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":40,"./_object-create":66,"./_property-desc":85,"./_set-to-string-tag":92,"./_wks":117}],53:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":32,"./_has":39,"./_hide":40,"./_iter-create":52,"./_iterators":56,"./_library":58,"./_object-gpo":74,"./_redefine":87,"./_set-to-string-tag":92,"./_wks":117}],54:[function(require,module,exports){
var ITERATOR     = require('./_wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":117}],55:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],56:[function(require,module,exports){
module.exports = {};
},{}],57:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./_object-keys":76,"./_to-iobject":107}],58:[function(require,module,exports){
module.exports = false;
},{}],59:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;
},{}],60:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
},{}],61:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
},{}],62:[function(require,module,exports){
var META     = require('./_uid')('meta')
  , isObject = require('./_is-object')
  , has      = require('./_has')
  , setDesc  = require('./_object-dp').f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_fails":34,"./_has":39,"./_is-object":49,"./_object-dp":67,"./_uid":114}],63:[function(require,module,exports){
var Map     = require('./es6.map')
  , $export = require('./_export')
  , shared  = require('./_shared')('metadata')
  , store   = shared.store || (shared.store = new (require('./es6.weak-map')));

var getOrCreateMetadataMap = function(target, targetKey, create){
  var targetMetadata = store.get(target);
  if(!targetMetadata){
    if(!create)return undefined;
    store.set(target, targetMetadata = new Map);
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if(!keyMetadata){
    if(!create)return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map);
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function(MetadataKey, MetadataValue, O, P){
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function(target, targetKey){
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false)
    , keys        = [];
  if(metadataMap)metadataMap.forEach(function(_, key){ keys.push(key); });
  return keys;
};
var toMetaKey = function(it){
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function(O){
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};
},{"./_export":32,"./_shared":94,"./es6.map":149,"./es6.weak-map":255}],64:[function(require,module,exports){
var global    = require('./_global')
  , macrotask = require('./_task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./_cof')(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};
},{"./_cof":18,"./_global":38,"./_task":104}],65:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = require('./_object-keys')
  , gOPS     = require('./_object-gops')
  , pIE      = require('./_object-pie')
  , toObject = require('./_to-object')
  , IObject  = require('./_iobject')
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;
},{"./_fails":34,"./_iobject":45,"./_object-gops":73,"./_object-keys":76,"./_object-pie":77,"./_to-object":109}],66:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":7,"./_dom-create":29,"./_enum-bug-keys":30,"./_html":41,"./_object-dps":68,"./_shared-key":93}],67:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":7,"./_descriptors":28,"./_ie8-dom-define":42,"./_to-primitive":110}],68:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":7,"./_descriptors":28,"./_object-dp":67,"./_object-keys":76}],69:[function(require,module,exports){
// Forced replacement prototype accessors methods
module.exports = require('./_library')|| !require('./_fails')(function(){
  var K = Math.random();
  // In FF throws only define methods
  __defineSetter__.call(null, K, function(){ /* empty */});
  delete require('./_global')[K];
});
},{"./_fails":34,"./_global":38,"./_library":58}],70:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":28,"./_has":39,"./_ie8-dom-define":42,"./_object-pie":77,"./_property-desc":85,"./_to-iobject":107,"./_to-primitive":110}],71:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject')
  , gOPN      = require('./_object-gopn').f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":72,"./_to-iobject":107}],72:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":30,"./_object-keys-internal":75}],73:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],74:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":39,"./_shared-key":93,"./_to-object":109}],75:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":11,"./_has":39,"./_shared-key":93,"./_to-iobject":107}],76:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":30,"./_object-keys-internal":75}],77:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],78:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export')
  , core    = require('./_core')
  , fails   = require('./_fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./_core":23,"./_export":32,"./_fails":34}],79:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject')
  , isEnum    = require('./_object-pie').f;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};
},{"./_object-keys":76,"./_object-pie":77,"./_to-iobject":107}],80:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN     = require('./_object-gopn')
  , gOPS     = require('./_object-gops')
  , anObject = require('./_an-object')
  , Reflect  = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = gOPN.f(anObject(it))
    , getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./_an-object":7,"./_global":38,"./_object-gopn":72,"./_object-gops":73}],81:[function(require,module,exports){
var $parseFloat = require('./_global').parseFloat
  , $trim       = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str){
  var string = $trim(String(str), 3)
    , result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;
},{"./_global":38,"./_string-trim":102,"./_string-ws":103}],82:[function(require,module,exports){
var $parseInt = require('./_global').parseInt
  , $trim     = require('./_string-trim').trim
  , ws        = require('./_string-ws')
  , hex       = /^[\-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix){
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;
},{"./_global":38,"./_string-trim":102,"./_string-ws":103}],83:[function(require,module,exports){
'use strict';
var path      = require('./_path')
  , invoke    = require('./_invoke')
  , aFunction = require('./_a-function');
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that = this
      , aLen = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !aLen)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(aLen > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};
},{"./_a-function":3,"./_invoke":44,"./_path":84}],84:[function(require,module,exports){
module.exports = require('./_global');
},{"./_global":38}],85:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],86:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function(target, src, safe){
  for(var key in src)redefine(target, key, src[key], safe);
  return target;
};
},{"./_redefine":87}],87:[function(require,module,exports){
var global    = require('./_global')
  , hide      = require('./_hide')
  , has       = require('./_has')
  , SRC       = require('./_uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  var isFunction = typeof val == 'function';
  if(isFunction)has(val, 'name') || hide(val, 'name', key);
  if(O[key] === val)return;
  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if(O === global){
    O[key] = val;
  } else {
    if(!safe){
      delete O[key];
      hide(O, key, val);
    } else {
      if(O[key])O[key] = val;
      else hide(O, key, val);
    }
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./_core":23,"./_global":38,"./_has":39,"./_hide":40,"./_uid":114}],88:[function(require,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],89:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],90:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object')
  , anObject = require('./_an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./_an-object":7,"./_ctx":25,"./_is-object":49,"./_object-gopd":70}],91:[function(require,module,exports){
'use strict';
var global      = require('./_global')
  , dP          = require('./_object-dp')
  , DESCRIPTORS = require('./_descriptors')
  , SPECIES     = require('./_wks')('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_descriptors":28,"./_global":38,"./_object-dp":67,"./_wks":117}],92:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":39,"./_object-dp":67,"./_wks":117}],93:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":94,"./_uid":114}],94:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":38}],95:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./_an-object')
  , aFunction = require('./_a-function')
  , SPECIES   = require('./_wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./_a-function":3,"./_an-object":7,"./_wks":117}],96:[function(require,module,exports){
var fails = require('./_fails');

module.exports = function(method, arg){
  return !!method && fails(function(){
    arg ? method.call(null, function(){}, 1) : method.call(null);
  });
};
},{"./_fails":34}],97:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":27,"./_to-integer":106}],98:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp')
  , defined  = require('./_defined');

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
},{"./_defined":27,"./_is-regexp":50}],99:[function(require,module,exports){
var $export = require('./_export')
  , fails   = require('./_fails')
  , defined = require('./_defined')
  , quot    = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function(string, tag, attribute, value) {
  var S  = String(defined(string))
    , p1 = '<' + tag;
  if(attribute !== '')p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function(NAME, exec){
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function(){
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};
},{"./_defined":27,"./_export":32,"./_fails":34}],100:[function(require,module,exports){
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length')
  , repeat   = require('./_string-repeat')
  , defined  = require('./_defined');

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength || fillStr == '')return S;
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":27,"./_string-repeat":101,"./_to-length":108}],101:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./_defined":27,"./_to-integer":106}],102:[function(require,module,exports){
var $export = require('./_export')
  , defined = require('./_defined')
  , fails   = require('./_fails')
  , spaces  = require('./_string-ws')
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec, ALIAS){
  var exp   = {};
  var FORCE = fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if(ALIAS)exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;
},{"./_defined":27,"./_export":32,"./_fails":34,"./_string-ws":103}],103:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
},{}],104:[function(require,module,exports){
var ctx                = require('./_ctx')
  , invoke             = require('./_invoke')
  , html               = require('./_html')
  , cel                = require('./_dom-create')
  , global             = require('./_global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./_cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./_cof":18,"./_ctx":25,"./_dom-create":29,"./_global":38,"./_html":41,"./_invoke":44}],105:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":106}],106:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],107:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":27,"./_iobject":45}],108:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":106}],109:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":27}],110:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":49}],111:[function(require,module,exports){
'use strict';
if(require('./_descriptors')){
  var LIBRARY             = require('./_library')
    , global              = require('./_global')
    , fails               = require('./_fails')
    , $export             = require('./_export')
    , $typed              = require('./_typed')
    , $buffer             = require('./_typed-buffer')
    , ctx                 = require('./_ctx')
    , anInstance          = require('./_an-instance')
    , propertyDesc        = require('./_property-desc')
    , hide                = require('./_hide')
    , redefineAll         = require('./_redefine-all')
    , toInteger           = require('./_to-integer')
    , toLength            = require('./_to-length')
    , toIndex             = require('./_to-index')
    , toPrimitive         = require('./_to-primitive')
    , has                 = require('./_has')
    , same                = require('./_same-value')
    , classof             = require('./_classof')
    , isObject            = require('./_is-object')
    , toObject            = require('./_to-object')
    , isArrayIter         = require('./_is-array-iter')
    , create              = require('./_object-create')
    , getPrototypeOf      = require('./_object-gpo')
    , gOPN                = require('./_object-gopn').f
    , getIterFn           = require('./core.get-iterator-method')
    , uid                 = require('./_uid')
    , wks                 = require('./_wks')
    , createArrayMethod   = require('./_array-methods')
    , createArrayIncludes = require('./_array-includes')
    , speciesConstructor  = require('./_species-constructor')
    , ArrayIterators      = require('./es6.array.iterator')
    , Iterators           = require('./_iterators')
    , $iterDetect         = require('./_iter-detect')
    , setSpecies          = require('./_set-species')
    , arrayFill           = require('./_array-fill')
    , arrayCopyWithin     = require('./_array-copy-within')
    , $DP                 = require('./_object-dp')
    , $GOPD               = require('./_object-gopd')
    , dP                  = $DP.f
    , gOPD                = $GOPD.f
    , RangeError          = global.RangeError
    , TypeError           = global.TypeError
    , Uint8Array          = global.Uint8Array
    , ARRAY_BUFFER        = 'ArrayBuffer'
    , SHARED_BUFFER       = 'Shared' + ARRAY_BUFFER
    , BYTES_PER_ELEMENT   = 'BYTES_PER_ELEMENT'
    , PROTOTYPE           = 'prototype'
    , ArrayProto          = Array[PROTOTYPE]
    , $ArrayBuffer        = $buffer.ArrayBuffer
    , $DataView           = $buffer.DataView
    , arrayForEach        = createArrayMethod(0)
    , arrayFilter         = createArrayMethod(2)
    , arraySome           = createArrayMethod(3)
    , arrayEvery          = createArrayMethod(4)
    , arrayFind           = createArrayMethod(5)
    , arrayFindIndex      = createArrayMethod(6)
    , arrayIncludes       = createArrayIncludes(true)
    , arrayIndexOf        = createArrayIncludes(false)
    , arrayValues         = ArrayIterators.values
    , arrayKeys           = ArrayIterators.keys
    , arrayEntries        = ArrayIterators.entries
    , arrayLastIndexOf    = ArrayProto.lastIndexOf
    , arrayReduce         = ArrayProto.reduce
    , arrayReduceRight    = ArrayProto.reduceRight
    , arrayJoin           = ArrayProto.join
    , arraySort           = ArrayProto.sort
    , arraySlice          = ArrayProto.slice
    , arrayToString       = ArrayProto.toString
    , arrayToLocaleString = ArrayProto.toLocaleString
    , ITERATOR            = wks('iterator')
    , TAG                 = wks('toStringTag')
    , TYPED_CONSTRUCTOR   = uid('typed_constructor')
    , DEF_CONSTRUCTOR     = uid('def_constructor')
    , ALL_CONSTRUCTORS    = $typed.CONSTR
    , TYPED_ARRAY         = $typed.TYPED
    , VIEW                = $typed.VIEW
    , WRONG_LENGTH        = 'Wrong length!';

  var $map = createArrayMethod(1, function(O, length){
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function(){
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function(){
    new Uint8Array(1).set({});
  });

  var strictToLength = function(it, SAME){
    if(it === undefined)throw TypeError(WRONG_LENGTH);
    var number = +it
      , length = toLength(it);
    if(SAME && !same(number, length))throw RangeError(WRONG_LENGTH);
    return length;
  };

  var toOffset = function(it, BYTES){
    var offset = toInteger(it);
    if(offset < 0 || offset % BYTES)throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function(it){
    if(isObject(it) && TYPED_ARRAY in it)return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function(C, length){
    if(!(isObject(C) && TYPED_CONSTRUCTOR in C)){
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function(O, list){
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function(C, list){
    var index  = 0
      , length = list.length
      , result = allocate(C, length);
    while(length > index)result[index] = list[index++];
    return result;
  };

  var addGetter = function(it, key, internal){
    dP(it, key, {get: function(){ return this._d[internal]; }});
  };

  var $from = function from(source /*, mapfn, thisArg */){
    var O       = toObject(source)
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , iterFn  = getIterFn(O)
      , i, length, values, result, step, iterator;
    if(iterFn != undefined && !isArrayIter(iterFn)){
      for(iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++){
        values.push(step.value);
      } O = values;
    }
    if(mapping && aLen > 2)mapfn = ctx(mapfn, arguments[2], 2);
    for(i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++){
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/*...items*/){
    var index  = 0
      , length = arguments.length
      , result = allocate(this, length);
    while(length > index)result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function(){ arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString(){
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /*, end */){
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /*, thisArg */){
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /*, start, end */){ // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /*, thisArg */){
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /*, thisArg */){
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /*, thisArg */){
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /*, thisArg */){
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /*, fromIndex */){
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /*, fromIndex */){
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator){ // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */){ // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /*, thisArg */){
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse(){
      var that   = this
        , length = validate(that).length
        , middle = Math.floor(length / 2)
        , index  = 0
        , value;
      while(index < middle){
        value         = that[index];
        that[index++] = that[--length];
        that[length]  = value;
      } return that;
    },
    some: function some(callbackfn /*, thisArg */){
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn){
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end){
      var O      = validate(this)
        , length = O.length
        , $begin = toIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end){
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /*, offset */){
    validate(this);
    var offset = toOffset(arguments[1], 1)
      , length = this.length
      , src    = toObject(arrayLike)
      , len    = toLength(src.length)
      , index  = 0;
    if(len + offset > length)throw RangeError(WRONG_LENGTH);
    while(index < len)this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries(){
      return arrayEntries.call(validate(this));
    },
    keys: function keys(){
      return arrayKeys.call(validate(this));
    },
    values: function values(){
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function(target, key){
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key){
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc){
    if(isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ){
      target[key] = desc.value;
      return target;
    } else return dP(target, key, desc);
  };

  if(!ALL_CONSTRUCTORS){
    $GOPD.f = $getDesc;
    $DP.f   = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty:           $setDesc
  });

  if(fails(function(){ arrayToString.call({}); })){
    arrayToString = arrayToLocaleString = function toString(){
      return arrayJoin.call(this);
    }
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice:          $slice,
    set:            $set,
    constructor:    function(){ /* noop */ },
    toString:       arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function(){ return this[TYPED_ARRAY]; }
  });

  module.exports = function(KEY, BYTES, wrapper, CLAMPED){
    CLAMPED = !!CLAMPED;
    var NAME       = KEY + (CLAMPED ? 'Clamped' : '') + 'Array'
      , ISNT_UINT8 = NAME != 'Uint8Array'
      , GETTER     = 'get' + KEY
      , SETTER     = 'set' + KEY
      , TypedArray = global[NAME]
      , Base       = TypedArray || {}
      , TAC        = TypedArray && getPrototypeOf(TypedArray)
      , FORCED     = !TypedArray || !$typed.ABV
      , O          = {}
      , TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function(that, index){
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function(that, index, value){
      var data = that._d;
      if(CLAMPED)value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function(that, index){
      dP(that, index, {
        get: function(){
          return getter(this, index);
        },
        set: function(value){
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if(FORCED){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME, '_d');
        var index  = 0
          , offset = 0
          , buffer, byteLength, length, klass;
        if(!isObject(data)){
          length     = strictToLength(data, true)
          byteLength = length * BYTES;
          buffer     = new $ArrayBuffer(byteLength);
        } else if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if($length === undefined){
            if($len % BYTES)throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if(byteLength < 0)throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if(byteLength + offset > $len)throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if(TYPED_ARRAY in data){
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while(index < length)addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if(!$iterDetect(function(iter){
      // V8 works with iterators, but fails in many other cases
      // https://code.google.com/p/v8/issues/detail?id=4552
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if(!isObject(data))return new Base(strictToLength(data, ISNT_UINT8));
        if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if(TYPED_ARRAY in data)return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function(key){
        if(!(key in TypedArray))hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if(!LIBRARY)TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator   = TypedArrayPrototype[ITERATOR]
      , CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined)
      , $iterator         = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if(CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)){
      dP(TypedArrayPrototype, TAG, {
        get: function(){ return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES,
      from: $from,
      of: $of
    });

    if(!(BYTES_PER_ELEMENT in TypedArrayPrototype))hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, {set: $set});

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, {toString: arrayToString});

    $export($export.P + $export.F * fails(function(){
      new TypedArray(1).slice();
    }), NAME, {slice: $slice});

    $export($export.P + $export.F * (fails(function(){
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString()
    }) || !fails(function(){
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, {toLocaleString: $toLocaleString});

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if(!LIBRARY && !CORRECT_ITER_NAME)hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function(){ /* empty */ };
},{"./_an-instance":6,"./_array-copy-within":8,"./_array-fill":9,"./_array-includes":11,"./_array-methods":12,"./_classof":17,"./_ctx":25,"./_descriptors":28,"./_export":32,"./_fails":34,"./_global":38,"./_has":39,"./_hide":40,"./_is-array-iter":46,"./_is-object":49,"./_iter-detect":54,"./_iterators":56,"./_library":58,"./_object-create":66,"./_object-dp":67,"./_object-gopd":70,"./_object-gopn":72,"./_object-gpo":74,"./_property-desc":85,"./_redefine-all":86,"./_same-value":89,"./_set-species":91,"./_species-constructor":95,"./_to-index":105,"./_to-integer":106,"./_to-length":108,"./_to-object":109,"./_to-primitive":110,"./_typed":113,"./_typed-buffer":112,"./_uid":114,"./_wks":117,"./core.get-iterator-method":118,"./es6.array.iterator":130}],112:[function(require,module,exports){
'use strict';
var global         = require('./_global')
  , DESCRIPTORS    = require('./_descriptors')
  , LIBRARY        = require('./_library')
  , $typed         = require('./_typed')
  , hide           = require('./_hide')
  , redefineAll    = require('./_redefine-all')
  , fails          = require('./_fails')
  , anInstance     = require('./_an-instance')
  , toInteger      = require('./_to-integer')
  , toLength       = require('./_to-length')
  , gOPN           = require('./_object-gopn').f
  , dP             = require('./_object-dp').f
  , arrayFill      = require('./_array-fill')
  , setToStringTag = require('./_set-to-string-tag')
  , ARRAY_BUFFER   = 'ArrayBuffer'
  , DATA_VIEW      = 'DataView'
  , PROTOTYPE      = 'prototype'
  , WRONG_LENGTH   = 'Wrong length!'
  , WRONG_INDEX    = 'Wrong index!'
  , $ArrayBuffer   = global[ARRAY_BUFFER]
  , $DataView      = global[DATA_VIEW]
  , Math           = global.Math
  , RangeError     = global.RangeError
  , Infinity       = global.Infinity
  , BaseBuffer     = $ArrayBuffer
  , abs            = Math.abs
  , pow            = Math.pow
  , floor          = Math.floor
  , log            = Math.log
  , LN2            = Math.LN2
  , BUFFER         = 'buffer'
  , BYTE_LENGTH    = 'byteLength'
  , BYTE_OFFSET    = 'byteOffset'
  , $BUFFER        = DESCRIPTORS ? '_b' : BUFFER
  , $LENGTH        = DESCRIPTORS ? '_l' : BYTE_LENGTH
  , $OFFSET        = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754 = function(value, mLen, nBytes){
  var buffer = Array(nBytes)
    , eLen   = nBytes * 8 - mLen - 1
    , eMax   = (1 << eLen) - 1
    , eBias  = eMax >> 1
    , rt     = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0
    , i      = 0
    , s      = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0
    , e, m, c;
  value = abs(value)
  if(value != value || value === Infinity){
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if(value * (c = pow(2, -e)) < 1){
      e--;
      c *= 2;
    }
    if(e + eBias >= 1){
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if(value * c >= 2){
      e++;
      c /= 2;
    }
    if(e + eBias >= eMax){
      m = 0;
      e = eMax;
    } else if(e + eBias >= 1){
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for(; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for(; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
};
var unpackIEEE754 = function(buffer, mLen, nBytes){
  var eLen  = nBytes * 8 - mLen - 1
    , eMax  = (1 << eLen) - 1
    , eBias = eMax >> 1
    , nBits = eLen - 7
    , i     = nBytes - 1
    , s     = buffer[i--]
    , e     = s & 127
    , m;
  s >>= 7;
  for(; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for(; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if(e === 0){
    e = 1 - eBias;
  } else if(e === eMax){
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
};

var unpackI32 = function(bytes){
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
};
var packI8 = function(it){
  return [it & 0xff];
};
var packI16 = function(it){
  return [it & 0xff, it >> 8 & 0xff];
};
var packI32 = function(it){
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
};
var packF64 = function(it){
  return packIEEE754(it, 52, 8);
};
var packF32 = function(it){
  return packIEEE754(it, 23, 4);
};

var addGetter = function(C, key, internal){
  dP(C[PROTOTYPE], key, {get: function(){ return this[internal]; }});
};

var get = function(view, bytes, index, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
};
var set = function(view, bytes, index, conversion, value, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = conversion(+value);
  for(var i = 0; i < bytes; i++)store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
};

var validateArrayBufferArguments = function(that, length){
  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
  var numberLength = +length
    , byteLength   = toLength(numberLength);
  if(numberLength != byteLength)throw RangeError(WRONG_LENGTH);
  return byteLength;
};

if(!$typed.ABV){
  $ArrayBuffer = function ArrayBuffer(length){
    var byteLength = validateArrayBufferArguments(this, length);
    this._b       = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength){
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH]
      , offset       = toInteger(byteOffset);
    if(offset < 0 || offset > bufferLength)throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if(offset + byteLength > bufferLength)throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if(DESCRIPTORS){
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset){
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset){
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */){
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if(!fails(function(){
    new $ArrayBuffer;     // eslint-disable-line no-new
  }) || !fails(function(){
    new $ArrayBuffer(.5); // eslint-disable-line no-new
  })){
    $ArrayBuffer = function ArrayBuffer(length){
      return new BaseBuffer(validateArrayBufferArguments(this, length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for(var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j; ){
      if(!((key = keys[j++]) in $ArrayBuffer))hide($ArrayBuffer, key, BaseBuffer[key]);
    };
    if(!LIBRARY)ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2))
    , $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if(view.getInt8(0) || !view.getInt8(1))redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;
},{"./_an-instance":6,"./_array-fill":9,"./_descriptors":28,"./_fails":34,"./_global":38,"./_hide":40,"./_library":58,"./_object-dp":67,"./_object-gopn":72,"./_redefine-all":86,"./_set-to-string-tag":92,"./_to-integer":106,"./_to-length":108,"./_typed":113}],113:[function(require,module,exports){
var global = require('./_global')
  , hide   = require('./_hide')
  , uid    = require('./_uid')
  , TYPED  = uid('typed_array')
  , VIEW   = uid('view')
  , ABV    = !!(global.ArrayBuffer && global.DataView)
  , CONSTR = ABV
  , i = 0, l = 9, Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while(i < l){
  if(Typed = global[TypedArrayConstructors[i++]]){
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV:    ABV,
  CONSTR: CONSTR,
  TYPED:  TYPED,
  VIEW:   VIEW
};
},{"./_global":38,"./_hide":40,"./_uid":114}],114:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],115:[function(require,module,exports){
var global         = require('./_global')
  , core           = require('./_core')
  , LIBRARY        = require('./_library')
  , wksExt         = require('./_wks-ext')
  , defineProperty = require('./_object-dp').f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
},{"./_core":23,"./_global":38,"./_library":58,"./_object-dp":67,"./_wks-ext":116}],116:[function(require,module,exports){
exports.f = require('./_wks');
},{"./_wks":117}],117:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":38,"./_shared":94,"./_uid":114}],118:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":17,"./_core":23,"./_iterators":56,"./_wks":117}],119:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = require('./_export')
  , $re     = require('./_replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});

},{"./_export":32,"./_replacer":88}],120:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', {copyWithin: require('./_array-copy-within')});

require('./_add-to-unscopables')('copyWithin');
},{"./_add-to-unscopables":5,"./_array-copy-within":8,"./_export":32}],121:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $every  = require('./_array-methods')(4);

$export($export.P + $export.F * !require('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */){
    return $every(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":12,"./_export":32,"./_strict-method":96}],122:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', {fill: require('./_array-fill')});

require('./_add-to-unscopables')('fill');
},{"./_add-to-unscopables":5,"./_array-fill":9,"./_export":32}],123:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */){
    return $filter(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":12,"./_export":32,"./_strict-method":96}],124:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export')
  , $find   = require('./_array-methods')(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
},{"./_add-to-unscopables":5,"./_array-methods":12,"./_export":32}],125:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export')
  , $find   = require('./_array-methods')(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
},{"./_add-to-unscopables":5,"./_array-methods":12,"./_export":32}],126:[function(require,module,exports){
'use strict';
var $export  = require('./_export')
  , $forEach = require('./_array-methods')(0)
  , STRICT   = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */){
    return $forEach(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":12,"./_export":32,"./_strict-method":96}],127:[function(require,module,exports){
'use strict';
var ctx            = require('./_ctx')
  , $export        = require('./_export')
  , toObject       = require('./_to-object')
  , call           = require('./_iter-call')
  , isArrayIter    = require('./_is-array-iter')
  , toLength       = require('./_to-length')
  , createProperty = require('./_create-property')
  , getIterFn      = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":24,"./_ctx":25,"./_export":32,"./_is-array-iter":46,"./_iter-call":51,"./_iter-detect":54,"./_to-length":108,"./_to-object":109,"./core.get-iterator-method":118}],128:[function(require,module,exports){
'use strict';
var $export       = require('./_export')
  , $indexOf      = require('./_array-includes')(false)
  , $native       = [].indexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /*, fromIndex = 0 */){
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});
},{"./_array-includes":11,"./_export":32,"./_strict-method":96}],129:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', {isArray: require('./_is-array')});
},{"./_export":32,"./_is-array":47}],130:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":5,"./_iter-define":53,"./_iter-step":55,"./_iterators":56,"./_to-iobject":107}],131:[function(require,module,exports){
'use strict';
// 22.1.3.13 Array.prototype.join(separator)
var $export   = require('./_export')
  , toIObject = require('./_to-iobject')
  , arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator){
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});
},{"./_export":32,"./_iobject":45,"./_strict-method":96,"./_to-iobject":107}],132:[function(require,module,exports){
'use strict';
var $export       = require('./_export')
  , toIObject     = require('./_to-iobject')
  , toInteger     = require('./_to-integer')
  , toLength      = require('./_to-length')
  , $native       = [].lastIndexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /*, fromIndex = @[*-1] */){
    // convert -0 to +0
    if(NEGATIVE_ZERO)return $native.apply(this, arguments) || 0;
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(arguments[1]));
    if(index < 0)index = length + index;
    for(;index >= 0; index--)if(index in O)if(O[index] === searchElement)return index || 0;
    return -1;
  }
});
},{"./_export":32,"./_strict-method":96,"./_to-integer":106,"./_to-iobject":107,"./_to-length":108}],133:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $map    = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */){
    return $map(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":12,"./_export":32,"./_strict-method":96}],134:[function(require,module,exports){
'use strict';
var $export        = require('./_export')
  , createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , aLen   = arguments.length
      , result = new (typeof this == 'function' ? this : Array)(aLen);
    while(aLen > index)createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});
},{"./_create-property":24,"./_export":32,"./_fails":34}],135:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});
},{"./_array-reduce":13,"./_export":32,"./_strict-method":96}],136:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});
},{"./_array-reduce":13,"./_export":32,"./_strict-method":96}],137:[function(require,module,exports){
'use strict';
var $export    = require('./_export')
  , html       = require('./_html')
  , cof        = require('./_cof')
  , toIndex    = require('./_to-index')
  , toLength   = require('./_to-length')
  , arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * require('./_fails')(function(){
  if(html)arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return arraySlice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});
},{"./_cof":18,"./_export":32,"./_fails":34,"./_html":41,"./_to-index":105,"./_to-length":108}],138:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $some   = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */){
    return $some(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":12,"./_export":32,"./_strict-method":96}],139:[function(require,module,exports){
'use strict';
var $export   = require('./_export')
  , aFunction = require('./_a-function')
  , toObject  = require('./_to-object')
  , fails     = require('./_fails')
  , $sort     = [].sort
  , test      = [1, 2, 3];

$export($export.P + $export.F * (fails(function(){
  // IE8-
  test.sort(undefined);
}) || !fails(function(){
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn){
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});
},{"./_a-function":3,"./_export":32,"./_fails":34,"./_strict-method":96,"./_to-object":109}],140:[function(require,module,exports){
require('./_set-species')('Array');
},{"./_set-species":91}],141:[function(require,module,exports){
// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = require('./_export');

$export($export.S, 'Date', {now: function(){ return new Date().getTime(); }});
},{"./_export":32}],142:[function(require,module,exports){
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = require('./_export')
  , fails   = require('./_fails')
  , getTime = Date.prototype.getTime;

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function(){
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function(){
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(getTime.call(this)))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
},{"./_export":32,"./_fails":34}],143:[function(require,module,exports){
'use strict';
var $export     = require('./_export')
  , toObject    = require('./_to-object')
  , toPrimitive = require('./_to-primitive');

$export($export.P + $export.F * require('./_fails')(function(){
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({toISOString: function(){ return 1; }}) !== 1;
}), 'Date', {
  toJSON: function toJSON(key){
    var O  = toObject(this)
      , pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});
},{"./_export":32,"./_fails":34,"./_to-object":109,"./_to-primitive":110}],144:[function(require,module,exports){
var TO_PRIMITIVE = require('./_wks')('toPrimitive')
  , proto        = Date.prototype;

if(!(TO_PRIMITIVE in proto))require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));
},{"./_date-to-primitive":26,"./_hide":40,"./_wks":117}],145:[function(require,module,exports){
var DateProto    = Date.prototype
  , INVALID_DATE = 'Invalid Date'
  , TO_STRING    = 'toString'
  , $toString    = DateProto[TO_STRING]
  , getTime      = DateProto.getTime;
if(new Date(NaN) + '' != INVALID_DATE){
  require('./_redefine')(DateProto, TO_STRING, function toString(){
    var value = getTime.call(this);
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}
},{"./_redefine":87}],146:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', {bind: require('./_bind')});
},{"./_bind":16,"./_export":32}],147:[function(require,module,exports){
'use strict';
var isObject       = require('./_is-object')
  , getPrototypeOf = require('./_object-gpo')
  , HAS_INSTANCE   = require('./_wks')('hasInstance')
  , FunctionProto  = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))require('./_object-dp').f(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = getPrototypeOf(O))if(this.prototype === O)return true;
  return false;
}});
},{"./_is-object":49,"./_object-dp":67,"./_object-gpo":74,"./_wks":117}],148:[function(require,module,exports){
var dP         = require('./_object-dp').f
  , createDesc = require('./_property-desc')
  , has        = require('./_has')
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';

var isExtensible = Object.isExtensible || function(){
  return true;
};

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function(){
    try {
      var that = this
        , name = ('' + that).match(nameRE)[1];
      has(that, NAME) || !isExtensible(that) || dP(that, NAME, createDesc(5, name));
      return name;
    } catch(e){
      return '';
    }
  }
});
},{"./_descriptors":28,"./_has":39,"./_object-dp":67,"./_property-desc":85}],149:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.1 Map Objects
module.exports = require('./_collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./_collection":22,"./_collection-strong":19}],150:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export')
  , log1p   = require('./_math-log1p')
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN 
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
},{"./_export":32,"./_math-log1p":60}],151:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export')
  , $asinh  = Math.asinh;

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0 
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', {asinh: asinh});
},{"./_export":32}],152:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export')
  , $atanh  = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0 
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
},{"./_export":32}],153:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export')
  , sign    = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
},{"./_export":32,"./_math-sign":61}],154:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
},{"./_export":32}],155:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
},{"./_export":32}],156:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export')
  , $expm1  = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', {expm1: $expm1});
},{"./_export":32,"./_math-expm1":59}],157:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export   = require('./_export')
  , sign      = require('./_math-sign')
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});
},{"./_export":32,"./_math-sign":61}],158:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export')
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , i    = 0
      , aLen = arguments.length
      , larg = 0
      , arg, div;
    while(i < aLen){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
},{"./_export":32}],159:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export')
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
},{"./_export":32,"./_fails":34}],160:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./_export":32}],161:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', {log1p: require('./_math-log1p')});
},{"./_export":32,"./_math-log1p":60}],162:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});
},{"./_export":32}],163:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', {sign: require('./_math-sign')});
},{"./_export":32,"./_math-sign":61}],164:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export')
  , expm1   = require('./_math-expm1')
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
},{"./_export":32,"./_fails":34,"./_math-expm1":59}],165:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export')
  , expm1   = require('./_math-expm1')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
},{"./_export":32,"./_math-expm1":59}],166:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"./_export":32}],167:[function(require,module,exports){
'use strict';
var global            = require('./_global')
  , has               = require('./_has')
  , cof               = require('./_cof')
  , inheritIfRequired = require('./_inherit-if-required')
  , toPrimitive       = require('./_to-primitive')
  , fails             = require('./_fails')
  , gOPN              = require('./_object-gopn').f
  , gOPD              = require('./_object-gopd').f
  , dP                = require('./_object-dp').f
  , $trim             = require('./_string-trim').trim
  , NUMBER            = 'Number'
  , $Number           = global[NUMBER]
  , Base              = $Number
  , proto             = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF        = cof(require('./_object-create')(proto)) == NUMBER
  , TRIM              = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for(var keys = require('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++){
    if(has(Base, key = keys[j]) && !has($Number, key)){
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}
},{"./_cof":18,"./_descriptors":28,"./_fails":34,"./_global":38,"./_has":39,"./_inherit-if-required":43,"./_object-create":66,"./_object-dp":67,"./_object-gopd":70,"./_object-gopn":72,"./_redefine":87,"./_string-trim":102,"./_to-primitive":110}],168:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});
},{"./_export":32}],169:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export   = require('./_export')
  , _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"./_export":32,"./_global":38}],170:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', {isInteger: require('./_is-integer')});
},{"./_export":32,"./_is-integer":48}],171:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});
},{"./_export":32}],172:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export   = require('./_export')
  , isInteger = require('./_is-integer')
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
},{"./_export":32,"./_is-integer":48}],173:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});
},{"./_export":32}],174:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});
},{"./_export":32}],175:[function(require,module,exports){
var $export     = require('./_export')
  , $parseFloat = require('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', {parseFloat: $parseFloat});
},{"./_export":32,"./_parse-float":81}],176:[function(require,module,exports){
var $export   = require('./_export')
  , $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {parseInt: $parseInt});
},{"./_export":32,"./_parse-int":82}],177:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , toInteger    = require('./_to-integer')
  , aNumberValue = require('./_a-number-value')
  , repeat       = require('./_string-repeat')
  , $toFixed     = 1..toFixed
  , floor        = Math.floor
  , data         = [0, 0, 0, 0, 0, 0]
  , ERROR        = 'Number.toFixed: incorrect invocation!'
  , ZERO         = '0';

var multiply = function(n, c){
  var i  = -1
    , c2 = c;
  while(++i < 6){
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function(n){
  var i = 6
    , c = 0;
  while(--i >= 0){
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function(){
  var i = 6
    , s = '';
  while(--i >= 0){
    if(s !== '' || i === 0 || data[i] !== 0){
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function(x, n, acc){
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function(x){
  var n  = 0
    , x2 = x;
  while(x2 >= 4096){
    n += 12;
    x2 /= 4096;
  }
  while(x2 >= 2){
    n  += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128..toFixed(0) !== '1000000000000000128'
) || !require('./_fails')(function(){
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits){
    var x = aNumberValue(this, ERROR)
      , f = toInteger(fractionDigits)
      , s = ''
      , m = ZERO
      , e, z, j, k;
    if(f < 0 || f > 20)throw RangeError(ERROR);
    if(x != x)return 'NaN';
    if(x <= -1e21 || x >= 1e21)return String(x);
    if(x < 0){
      s = '-';
      x = -x;
    }
    if(x > 1e-21){
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if(e > 0){
        multiply(0, z);
        j = f;
        while(j >= 7){
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while(j >= 23){
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if(f > 0){
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});
},{"./_a-number-value":4,"./_export":32,"./_fails":34,"./_string-repeat":101,"./_to-integer":106}],178:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , $fails       = require('./_fails')
  , aNumberValue = require('./_a-number-value')
  , $toPrecision = 1..toPrecision;

$export($export.P + $export.F * ($fails(function(){
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function(){
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision){
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision); 
  }
});
},{"./_a-number-value":4,"./_export":32,"./_fails":34}],179:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":32,"./_object-assign":65}],180:[function(require,module,exports){
var $export = require('./_export')
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require('./_object-create')});
},{"./_export":32,"./_object-create":66}],181:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperties: require('./_object-dps')});
},{"./_descriptors":28,"./_export":32,"./_object-dps":68}],182:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":28,"./_export":32,"./_object-dp":67}],183:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});
},{"./_is-object":49,"./_meta":62,"./_object-sap":78}],184:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = require('./_to-iobject')
  , $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./_object-gopd":70,"./_object-sap":78,"./_to-iobject":107}],185:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function(){
  return require('./_object-gopn-ext').f;
});
},{"./_object-gopn-ext":71,"./_object-sap":78}],186:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require('./_to-object')
  , $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./_object-gpo":74,"./_object-sap":78,"./_to-object":109}],187:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});
},{"./_is-object":49,"./_object-sap":78}],188:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
},{"./_is-object":49,"./_object-sap":78}],189:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});
},{"./_is-object":49,"./_object-sap":78}],190:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', {is: require('./_same-value')});
},{"./_export":32,"./_same-value":89}],191:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object')
  , $keys    = require('./_object-keys');

require('./_object-sap')('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./_object-keys":76,"./_object-sap":78,"./_to-object":109}],192:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});
},{"./_is-object":49,"./_meta":62,"./_object-sap":78}],193:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});
},{"./_is-object":49,"./_meta":62,"./_object-sap":78}],194:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', {setPrototypeOf: require('./_set-proto').set});
},{"./_export":32,"./_set-proto":90}],195:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof')
  , test    = {};
test[require('./_wks')('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  require('./_redefine')(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"./_classof":17,"./_redefine":87,"./_wks":117}],196:[function(require,module,exports){
var $export     = require('./_export')
  , $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), {parseFloat: $parseFloat});
},{"./_export":32,"./_parse-float":81}],197:[function(require,module,exports){
var $export   = require('./_export')
  , $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), {parseInt: $parseInt});
},{"./_export":32,"./_parse-int":82}],198:[function(require,module,exports){
'use strict';
var LIBRARY            = require('./_library')
  , global             = require('./_global')
  , ctx                = require('./_ctx')
  , classof            = require('./_classof')
  , $export            = require('./_export')
  , isObject           = require('./_is-object')
  , aFunction          = require('./_a-function')
  , anInstance         = require('./_an-instance')
  , forOf              = require('./_for-of')
  , speciesConstructor = require('./_species-constructor')
  , task               = require('./_task').set
  , microtask          = require('./_microtask')()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./_a-function":3,"./_an-instance":6,"./_classof":17,"./_core":23,"./_ctx":25,"./_export":32,"./_for-of":37,"./_global":38,"./_is-object":49,"./_iter-detect":54,"./_library":58,"./_microtask":64,"./_redefine-all":86,"./_set-species":91,"./_set-to-string-tag":92,"./_species-constructor":95,"./_task":104,"./_wks":117}],199:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export   = require('./_export')
  , aFunction = require('./_a-function')
  , anObject  = require('./_an-object')
  , rApply    = (require('./_global').Reflect || {}).apply
  , fApply    = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function(){
  rApply(function(){});
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    var T = aFunction(target)
      , L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});
},{"./_a-function":3,"./_an-object":7,"./_export":32,"./_fails":34,"./_global":38}],200:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export    = require('./_export')
  , create     = require('./_object-create')
  , aFunction  = require('./_a-function')
  , anObject   = require('./_an-object')
  , isObject   = require('./_is-object')
  , fails      = require('./_fails')
  , bind       = require('./_bind')
  , rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function(){
  function F(){}
  return !(rConstruct(function(){}, [], F) instanceof F);
});
var ARGS_BUG = !fails(function(){
  rConstruct(function(){});
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(ARGS_BUG && !NEW_TARGET_BUG)return rConstruct(Target, args, newTarget);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      switch(args.length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
},{"./_a-function":3,"./_an-object":7,"./_bind":16,"./_export":32,"./_fails":34,"./_global":38,"./_is-object":49,"./_object-create":66}],201:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP          = require('./_object-dp')
  , $export     = require('./_export')
  , anObject    = require('./_an-object')
  , toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function(){
  Reflect.defineProperty(dP.f({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_an-object":7,"./_export":32,"./_fails":34,"./_object-dp":67,"./_to-primitive":110}],202:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = require('./_export')
  , gOPD     = require('./_object-gopd').f
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
},{"./_an-object":7,"./_export":32,"./_object-gopd":70}],203:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export  = require('./_export')
  , anObject = require('./_an-object');
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
require('./_iter-create')(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});
},{"./_an-object":7,"./_export":32,"./_iter-create":52}],204:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD     = require('./_object-gopd')
  , $export  = require('./_export')
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return gOPD.f(anObject(target), propertyKey);
  }
});
},{"./_an-object":7,"./_export":32,"./_object-gopd":70}],205:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = require('./_export')
  , getProto = require('./_object-gpo')
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});
},{"./_an-object":7,"./_export":32,"./_object-gpo":74}],206:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD           = require('./_object-gopd')
  , getPrototypeOf = require('./_object-gpo')
  , has            = require('./_has')
  , $export        = require('./_export')
  , isObject       = require('./_is-object')
  , anObject       = require('./_an-object');

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = gOPD.f(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = getPrototypeOf(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});
},{"./_an-object":7,"./_export":32,"./_has":39,"./_is-object":49,"./_object-gopd":70,"./_object-gpo":74}],207:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});
},{"./_export":32}],208:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export       = require('./_export')
  , anObject      = require('./_an-object')
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
},{"./_an-object":7,"./_export":32}],209:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', {ownKeys: require('./_own-keys')});
},{"./_export":32,"./_own-keys":80}],210:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export            = require('./_export')
  , anObject           = require('./_an-object')
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_an-object":7,"./_export":32}],211:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = require('./_export')
  , setProto = require('./_set-proto');

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_export":32,"./_set-proto":90}],212:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP             = require('./_object-dp')
  , gOPD           = require('./_object-gopd')
  , getPrototypeOf = require('./_object-gpo')
  , has            = require('./_has')
  , $export        = require('./_export')
  , createDesc     = require('./_property-desc')
  , anObject       = require('./_an-object')
  , isObject       = require('./_is-object');

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = gOPD.f(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = getPrototypeOf(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});
},{"./_an-object":7,"./_export":32,"./_has":39,"./_is-object":49,"./_object-dp":67,"./_object-gopd":70,"./_object-gpo":74,"./_property-desc":85}],213:[function(require,module,exports){
var global            = require('./_global')
  , inheritIfRequired = require('./_inherit-if-required')
  , dP                = require('./_object-dp').f
  , gOPN              = require('./_object-gopn').f
  , isRegExp          = require('./_is-regexp')
  , $flags            = require('./_flags')
  , $RegExp           = global.RegExp
  , Base              = $RegExp
  , proto             = $RegExp.prototype
  , re1               = /a/g
  , re2               = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW       = new $RegExp(re1) !== re1;

if(require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function(){
  re2[require('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var tiRE = this instanceof $RegExp
      , piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function(key){
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  };
  for(var keys = gOPN(Base), i = 0; keys.length > i; )proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./_redefine')(global, 'RegExp', $RegExp);
}

require('./_set-species')('RegExp');
},{"./_descriptors":28,"./_fails":34,"./_flags":36,"./_global":38,"./_inherit-if-required":43,"./_is-regexp":50,"./_object-dp":67,"./_object-gopn":72,"./_redefine":87,"./_set-species":91,"./_wks":117}],214:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if(require('./_descriptors') && /./g.flags != 'g')require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});
},{"./_descriptors":28,"./_flags":36,"./_object-dp":67}],215:[function(require,module,exports){
// @@match logic
require('./_fix-re-wks')('match', 1, function(defined, MATCH, $match){
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});
},{"./_fix-re-wks":35}],216:[function(require,module,exports){
// @@replace logic
require('./_fix-re-wks')('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});
},{"./_fix-re-wks":35}],217:[function(require,module,exports){
// @@search logic
require('./_fix-re-wks')('search', 1, function(defined, SEARCH, $search){
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});
},{"./_fix-re-wks":35}],218:[function(require,module,exports){
// @@split logic
require('./_fix-re-wks')('split', 2, function(defined, SPLIT, $split){
  'use strict';
  var isRegExp   = require('./_is-regexp')
    , _split     = $split
    , $push      = [].push
    , $SPLIT     = 'split'
    , LENGTH     = 'length'
    , LAST_INDEX = 'lastIndex';
  if(
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ){
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function(separator, limit){
      var string = String(this);
      if(separator === undefined && limit === 0)return [];
      // If `separator` is not a regex, use native split
      if(!isRegExp(separator))return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if(!NPCG)separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while(match = separatorCopy.exec(string)){
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if(lastIndex > lastLastIndex){
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          if(!NPCG && match[LENGTH] > 1)match[0].replace(separator2, function(){
            for(i = 1; i < arguments[LENGTH] - 2; i++)if(arguments[i] === undefined)match[i] = undefined;
          });
          if(match[LENGTH] > 1 && match.index < string[LENGTH])$push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if(output[LENGTH] >= splitLimit)break;
        }
        if(separatorCopy[LAST_INDEX] === match.index)separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if(lastLastIndex === string[LENGTH]){
        if(lastLength || !separatorCopy.test(''))output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if('0'[$SPLIT](undefined, 0)[LENGTH]){
    $split = function(separator, limit){
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit){
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});
},{"./_fix-re-wks":35,"./_is-regexp":50}],219:[function(require,module,exports){
'use strict';
require('./es6.regexp.flags');
var anObject    = require('./_an-object')
  , $flags      = require('./_flags')
  , DESCRIPTORS = require('./_descriptors')
  , TO_STRING   = 'toString'
  , $toString   = /./[TO_STRING];

var define = function(fn){
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if(require('./_fails')(function(){ return $toString.call({source: 'a', flags: 'b'}) != '/a/b'; })){
  define(function toString(){
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if($toString.name != TO_STRING){
  define(function toString(){
    return $toString.call(this);
  });
}
},{"./_an-object":7,"./_descriptors":28,"./_fails":34,"./_flags":36,"./_redefine":87,"./es6.regexp.flags":214}],220:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.2 Set Objects
module.exports = require('./_collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./_collection":22,"./_collection-strong":19}],221:[function(require,module,exports){
'use strict';
// B.2.3.2 String.prototype.anchor(name)
require('./_string-html')('anchor', function(createHTML){
  return function anchor(name){
    return createHTML(this, 'a', 'name', name);
  }
});
},{"./_string-html":99}],222:[function(require,module,exports){
'use strict';
// B.2.3.3 String.prototype.big()
require('./_string-html')('big', function(createHTML){
  return function big(){
    return createHTML(this, 'big', '', '');
  }
});
},{"./_string-html":99}],223:[function(require,module,exports){
'use strict';
// B.2.3.4 String.prototype.blink()
require('./_string-html')('blink', function(createHTML){
  return function blink(){
    return createHTML(this, 'blink', '', '');
  }
});
},{"./_string-html":99}],224:[function(require,module,exports){
'use strict';
// B.2.3.5 String.prototype.bold()
require('./_string-html')('bold', function(createHTML){
  return function bold(){
    return createHTML(this, 'b', '', '');
  }
});
},{"./_string-html":99}],225:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $at     = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./_export":32,"./_string-at":97}],226:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export   = require('./_export')
  , toLength  = require('./_to-length')
  , context   = require('./_string-context')
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , endPosition = arguments.length > 1 ? arguments[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});
},{"./_export":32,"./_fails-is-regexp":33,"./_string-context":98,"./_to-length":108}],227:[function(require,module,exports){
'use strict';
// B.2.3.6 String.prototype.fixed()
require('./_string-html')('fixed', function(createHTML){
  return function fixed(){
    return createHTML(this, 'tt', '', '');
  }
});
},{"./_string-html":99}],228:[function(require,module,exports){
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)
require('./_string-html')('fontcolor', function(createHTML){
  return function fontcolor(color){
    return createHTML(this, 'font', 'color', color);
  }
});
},{"./_string-html":99}],229:[function(require,module,exports){
'use strict';
// B.2.3.8 String.prototype.fontsize(size)
require('./_string-html')('fontsize', function(createHTML){
  return function fontsize(size){
    return createHTML(this, 'font', 'size', size);
  }
});
},{"./_string-html":99}],230:[function(require,module,exports){
var $export        = require('./_export')
  , toIndex        = require('./_to-index')
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res  = []
      , aLen = arguments.length
      , i    = 0
      , code;
    while(aLen > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./_export":32,"./_to-index":105}],231:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export  = require('./_export')
  , context  = require('./_string-context')
  , INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});
},{"./_export":32,"./_fails-is-regexp":33,"./_string-context":98}],232:[function(require,module,exports){
'use strict';
// B.2.3.9 String.prototype.italics()
require('./_string-html')('italics', function(createHTML){
  return function italics(){
    return createHTML(this, 'i', '', '');
  }
});
},{"./_string-html":99}],233:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":53,"./_string-at":97}],234:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function(createHTML){
  return function link(url){
    return createHTML(this, 'a', 'href', url);
  }
});
},{"./_string-html":99}],235:[function(require,module,exports){
var $export   = require('./_export')
  , toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl  = toIObject(callSite.raw)
      , len  = toLength(tpl.length)
      , aLen = arguments.length
      , res  = []
      , i    = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < aLen)res.push(String(arguments[i]));
    } return res.join('');
  }
});
},{"./_export":32,"./_to-iobject":107,"./_to-length":108}],236:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});
},{"./_export":32,"./_string-repeat":101}],237:[function(require,module,exports){
'use strict';
// B.2.3.11 String.prototype.small()
require('./_string-html')('small', function(createHTML){
  return function small(){
    return createHTML(this, 'small', '', '');
  }
});
},{"./_string-html":99}],238:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export     = require('./_export')
  , toLength    = require('./_to-length')
  , context     = require('./_string-context')
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , index  = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});
},{"./_export":32,"./_fails-is-regexp":33,"./_string-context":98,"./_to-length":108}],239:[function(require,module,exports){
'use strict';
// B.2.3.12 String.prototype.strike()
require('./_string-html')('strike', function(createHTML){
  return function strike(){
    return createHTML(this, 'strike', '', '');
  }
});
},{"./_string-html":99}],240:[function(require,module,exports){
'use strict';
// B.2.3.13 String.prototype.sub()
require('./_string-html')('sub', function(createHTML){
  return function sub(){
    return createHTML(this, 'sub', '', '');
  }
});
},{"./_string-html":99}],241:[function(require,module,exports){
'use strict';
// B.2.3.14 String.prototype.sup()
require('./_string-html')('sup', function(createHTML){
  return function sup(){
    return createHTML(this, 'sup', '', '');
  }
});
},{"./_string-html":99}],242:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./_string-trim')('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});
},{"./_string-trim":102}],243:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global         = require('./_global')
  , has            = require('./_has')
  , DESCRIPTORS    = require('./_descriptors')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , META           = require('./_meta').KEY
  , $fails         = require('./_fails')
  , shared         = require('./_shared')
  , setToStringTag = require('./_set-to-string-tag')
  , uid            = require('./_uid')
  , wks            = require('./_wks')
  , wksExt         = require('./_wks-ext')
  , wksDefine      = require('./_wks-define')
  , keyOf          = require('./_keyof')
  , enumKeys       = require('./_enum-keys')
  , isArray        = require('./_is-array')
  , anObject       = require('./_an-object')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , createDesc     = require('./_property-desc')
  , _create        = require('./_object-create')
  , gOPNExt        = require('./_object-gopn-ext')
  , $GOPD          = require('./_object-gopd')
  , $DP            = require('./_object-dp')
  , $keys          = require('./_object-keys')
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f  = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./_library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./_an-object":7,"./_descriptors":28,"./_enum-keys":31,"./_export":32,"./_fails":34,"./_global":38,"./_has":39,"./_hide":40,"./_is-array":47,"./_keyof":57,"./_library":58,"./_meta":62,"./_object-create":66,"./_object-dp":67,"./_object-gopd":70,"./_object-gopn":72,"./_object-gopn-ext":71,"./_object-gops":73,"./_object-keys":76,"./_object-pie":77,"./_property-desc":85,"./_redefine":87,"./_set-to-string-tag":92,"./_shared":94,"./_to-iobject":107,"./_to-primitive":110,"./_uid":114,"./_wks":117,"./_wks-define":115,"./_wks-ext":116}],244:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , $typed       = require('./_typed')
  , buffer       = require('./_typed-buffer')
  , anObject     = require('./_an-object')
  , toIndex      = require('./_to-index')
  , toLength     = require('./_to-length')
  , isObject     = require('./_is-object')
  , ArrayBuffer  = require('./_global').ArrayBuffer
  , speciesConstructor = require('./_species-constructor')
  , $ArrayBuffer = buffer.ArrayBuffer
  , $DataView    = buffer.DataView
  , $isView      = $typed.ABV && ArrayBuffer.isView
  , $slice       = $ArrayBuffer.prototype.slice
  , VIEW         = $typed.VIEW
  , ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), {ArrayBuffer: $ArrayBuffer});

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it){
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function(){
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end){
    if($slice !== undefined && end === undefined)return $slice.call(anObject(this), start); // FF fix
    var len    = anObject(this).byteLength
      , first  = toIndex(start, len)
      , final  = toIndex(end === undefined ? len : end, len)
      , result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first))
      , viewS  = new $DataView(this)
      , viewT  = new $DataView(result)
      , index  = 0;
    while(first < final){
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);
},{"./_an-object":7,"./_export":32,"./_fails":34,"./_global":38,"./_is-object":49,"./_set-species":91,"./_species-constructor":95,"./_to-index":105,"./_to-length":108,"./_typed":113,"./_typed-buffer":112}],245:[function(require,module,exports){
var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});
},{"./_export":32,"./_typed":113,"./_typed-buffer":112}],246:[function(require,module,exports){
require('./_typed-array')('Float32', 4, function(init){
  return function Float32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],247:[function(require,module,exports){
require('./_typed-array')('Float64', 8, function(init){
  return function Float64Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],248:[function(require,module,exports){
require('./_typed-array')('Int16', 2, function(init){
  return function Int16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],249:[function(require,module,exports){
require('./_typed-array')('Int32', 4, function(init){
  return function Int32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],250:[function(require,module,exports){
require('./_typed-array')('Int8', 1, function(init){
  return function Int8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],251:[function(require,module,exports){
require('./_typed-array')('Uint16', 2, function(init){
  return function Uint16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],252:[function(require,module,exports){
require('./_typed-array')('Uint32', 4, function(init){
  return function Uint32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],253:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function(init){
  return function Uint8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],254:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function(init){
  return function Uint8ClampedArray(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
}, true);
},{"./_typed-array":111}],255:[function(require,module,exports){
'use strict';
var each         = require('./_array-methods')(0)
  , redefine     = require('./_redefine')
  , meta         = require('./_meta')
  , assign       = require('./_object-assign')
  , weak         = require('./_collection-weak')
  , isObject     = require('./_is-object')
  , getWeak      = meta.getWeak
  , isExtensible = Object.isExtensible
  , uncaughtFrozenStore = weak.ufstore
  , tmp          = {}
  , InternalMap;

var wrapper = function(get){
  return function WeakMap(){
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      var data = getWeak(key);
      if(data === true)return uncaughtFrozenStore(this).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')('WeakMap', wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  InternalMap = weak.getConstructor(wrapper);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on internal weakmap shim
      if(isObject(a) && !isExtensible(a)){
        if(!this._f)this._f = new InternalMap;
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./_array-methods":12,"./_collection":22,"./_collection-weak":21,"./_is-object":49,"./_meta":62,"./_object-assign":65,"./_redefine":87}],256:[function(require,module,exports){
'use strict';
var weak = require('./_collection-weak');

// 23.4 WeakSet Objects
require('./_collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./_collection":22,"./_collection-weak":21}],257:[function(require,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export   = require('./_export')
  , $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');
},{"./_add-to-unscopables":5,"./_array-includes":11,"./_export":32}],258:[function(require,module,exports){
// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export   = require('./_export')
  , microtask = require('./_microtask')()
  , process   = require('./_global').process
  , isNode    = require('./_cof')(process) == 'process';

$export($export.G, {
  asap: function asap(fn){
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});
},{"./_cof":18,"./_export":32,"./_global":38,"./_microtask":64}],259:[function(require,module,exports){
// https://github.com/ljharb/proposal-is-error
var $export = require('./_export')
  , cof     = require('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it){
    return cof(it) === 'Error';
  }
});
},{"./_cof":18,"./_export":32}],260:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./_export');

$export($export.P + $export.R, 'Map', {toJSON: require('./_collection-to-json')('Map')});
},{"./_collection-to-json":20,"./_export":32}],261:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});
},{"./_export":32}],262:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  imulh: function imulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >> 16
      , v1 = $v >> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});
},{"./_export":32}],263:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});
},{"./_export":32}],264:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  umulh: function umulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >>> 16
      , v1 = $v >>> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});
},{"./_export":32}],265:[function(require,module,exports){
'use strict';
var $export         = require('./_export')
  , toObject        = require('./_to-object')
  , aFunction       = require('./_a-function')
  , $defineProperty = require('./_object-dp');

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter){
    $defineProperty.f(toObject(this), P, {get: aFunction(getter), enumerable: true, configurable: true});
  }
});
},{"./_a-function":3,"./_descriptors":28,"./_export":32,"./_object-dp":67,"./_object-forced-pam":69,"./_to-object":109}],266:[function(require,module,exports){
'use strict';
var $export         = require('./_export')
  , toObject        = require('./_to-object')
  , aFunction       = require('./_a-function')
  , $defineProperty = require('./_object-dp');

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter){
    $defineProperty.f(toObject(this), P, {set: aFunction(setter), enumerable: true, configurable: true});
  }
});
},{"./_a-function":3,"./_descriptors":28,"./_export":32,"./_object-dp":67,"./_object-forced-pam":69,"./_to-object":109}],267:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export  = require('./_export')
  , $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});
},{"./_export":32,"./_object-to-array":79}],268:[function(require,module,exports){
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export        = require('./_export')
  , ownKeys        = require('./_own-keys')
  , toIObject      = require('./_to-iobject')
  , gOPD           = require('./_object-gopd')
  , createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , getDesc = gOPD.f
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key;
    while(keys.length > i)createProperty(result, key = keys[i++], getDesc(O, key));
    return result;
  }
});
},{"./_create-property":24,"./_export":32,"./_object-gopd":70,"./_own-keys":80,"./_to-iobject":107}],269:[function(require,module,exports){
'use strict';
var $export                  = require('./_export')
  , toObject                 = require('./_to-object')
  , toPrimitive              = require('./_to-primitive')
  , getPrototypeOf           = require('./_object-gpo')
  , getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupGetter__: function __lookupGetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.get;
    } while(O = getPrototypeOf(O));
  }
});
},{"./_descriptors":28,"./_export":32,"./_object-forced-pam":69,"./_object-gopd":70,"./_object-gpo":74,"./_to-object":109,"./_to-primitive":110}],270:[function(require,module,exports){
'use strict';
var $export                  = require('./_export')
  , toObject                 = require('./_to-object')
  , toPrimitive              = require('./_to-primitive')
  , getPrototypeOf           = require('./_object-gpo')
  , getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupSetter__: function __lookupSetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.set;
    } while(O = getPrototypeOf(O));
  }
});
},{"./_descriptors":28,"./_export":32,"./_object-forced-pam":69,"./_object-gopd":70,"./_object-gpo":74,"./_to-object":109,"./_to-primitive":110}],271:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export')
  , $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});
},{"./_export":32,"./_object-to-array":79}],272:[function(require,module,exports){
'use strict';
// https://github.com/zenparsing/es-observable
var $export     = require('./_export')
  , global      = require('./_global')
  , core        = require('./_core')
  , microtask   = require('./_microtask')()
  , OBSERVABLE  = require('./_wks')('observable')
  , aFunction   = require('./_a-function')
  , anObject    = require('./_an-object')
  , anInstance  = require('./_an-instance')
  , redefineAll = require('./_redefine-all')
  , hide        = require('./_hide')
  , forOf       = require('./_for-of')
  , RETURN      = forOf.RETURN;

var getMethod = function(fn){
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function(subscription){
  var cleanup = subscription._c;
  if(cleanup){
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function(subscription){
  return subscription._o === undefined;
};

var closeSubscription = function(subscription){
  if(!subscriptionClosed(subscription)){
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function(observer, subscriber){
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup      = subscriber(observer)
      , subscription = cleanup;
    if(cleanup != null){
      if(typeof cleanup.unsubscribe === 'function')cleanup = function(){ subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch(e){
    observer.error(e);
    return;
  } if(subscriptionClosed(this))cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe(){ closeSubscription(this); }
});

var SubscriptionObserver = function(subscription){
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if(m)return m.call(observer, value);
      } catch(e){
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value){
    var subscription = this._s;
    if(subscriptionClosed(subscription))throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if(!m)throw value;
      value = m.call(observer, value);
    } catch(e){
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch(e){
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber){
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer){
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn){
    var that = this;
    return new (core.Promise || global.Promise)(function(resolve, reject){
      aFunction(fn);
      var subscription = that.subscribe({
        next : function(value){
          try {
            return fn(value);
          } catch(e){
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x){
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if(method){
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function(observer){
        return observable.subscribe(observer);
      });
    }
    return new C(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          try {
            if(forOf(x, false, function(it){
              observer.next(it);
              if(done)return RETURN;
            }) === RETURN)return;
          } catch(e){
            if(done)throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  },
  of: function of(){
    for(var i = 0, l = arguments.length, items = Array(l); i < l;)items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          for(var i = 0; i < items.length; ++i){
            observer.next(items[i]);
            if(done)return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function(){ return this; });

$export($export.G, {Observable: $Observable});

require('./_set-species')('Observable');
},{"./_a-function":3,"./_an-instance":6,"./_an-object":7,"./_core":23,"./_export":32,"./_for-of":37,"./_global":38,"./_hide":40,"./_microtask":64,"./_redefine-all":86,"./_set-species":91,"./_wks":117}],273:[function(require,module,exports){
var metadata                  = require('./_metadata')
  , anObject                  = require('./_an-object')
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey){
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
}});
},{"./_an-object":7,"./_metadata":63}],274:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , toMetaKey              = metadata.key
  , getOrCreateMetadataMap = metadata.map
  , store                  = metadata.store;

metadata.exp({deleteMetadata: function deleteMetadata(metadataKey, target /*, targetKey */){
  var targetKey   = arguments.length < 3 ? undefined : toMetaKey(arguments[2])
    , metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if(metadataMap === undefined || !metadataMap['delete'](metadataKey))return false;
  if(metadataMap.size)return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
}});
},{"./_an-object":7,"./_metadata":63}],275:[function(require,module,exports){
var Set                     = require('./es6.set')
  , from                    = require('./_array-from-iterable')
  , metadata                = require('./_metadata')
  , anObject                = require('./_an-object')
  , getPrototypeOf          = require('./_object-gpo')
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

var ordinaryMetadataKeys = function(O, P){
  var oKeys  = ordinaryOwnMetadataKeys(O, P)
    , parent = getPrototypeOf(O);
  if(parent === null)return oKeys;
  var pKeys  = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({getMetadataKeys: function getMetadataKeys(target /*, targetKey */){
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});
},{"./_an-object":7,"./_array-from-iterable":10,"./_metadata":63,"./_object-gpo":74,"./es6.set":220}],276:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , getPrototypeOf         = require('./_object-gpo')
  , ordinaryHasOwnMetadata = metadata.has
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

var ordinaryGetMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({getMetadata: function getMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":7,"./_metadata":63,"./_object-gpo":74}],277:[function(require,module,exports){
var metadata                = require('./_metadata')
  , anObject                = require('./_an-object')
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

metadata.exp({getOwnMetadataKeys: function getOwnMetadataKeys(target /*, targetKey */){
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});
},{"./_an-object":7,"./_metadata":63}],278:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

metadata.exp({getOwnMetadata: function getOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":7,"./_metadata":63}],279:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , getPrototypeOf         = require('./_object-gpo')
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

var ordinaryHasMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({hasMetadata: function hasMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":7,"./_metadata":63,"./_object-gpo":74}],280:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

metadata.exp({hasOwnMetadata: function hasOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":7,"./_metadata":63}],281:[function(require,module,exports){
var metadata                  = require('./_metadata')
  , anObject                  = require('./_an-object')
  , aFunction                 = require('./_a-function')
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({metadata: function metadata(metadataKey, metadataValue){
  return function decorator(target, targetKey){
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
}});
},{"./_a-function":3,"./_an-object":7,"./_metadata":63}],282:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./_export');

$export($export.P + $export.R, 'Set', {toJSON: require('./_collection-to-json')('Set')});
},{"./_collection-to-json":20,"./_export":32}],283:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./_export')
  , $at     = require('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./_export":32,"./_string-at":97}],284:[function(require,module,exports){
'use strict';
// https://tc39.github.io/String.prototype.matchAll/
var $export     = require('./_export')
  , defined     = require('./_defined')
  , toLength    = require('./_to-length')
  , isRegExp    = require('./_is-regexp')
  , getFlags    = require('./_flags')
  , RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function(regexp, string){
  this._r = regexp;
  this._s = string;
};

require('./_iter-create')($RegExpStringIterator, 'RegExp String', function next(){
  var match = this._r.exec(this._s);
  return {value: match, done: match === null};
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp){
    defined(this);
    if(!isRegExp(regexp))throw TypeError(regexp + ' is not a regexp!');
    var S     = String(this)
      , flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp)
      , rx    = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});
},{"./_defined":27,"./_export":32,"./_flags":36,"./_is-regexp":50,"./_iter-create":52,"./_to-length":108}],285:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export')
  , $pad    = require('./_string-pad');

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});
},{"./_export":32,"./_string-pad":100}],286:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export')
  , $pad    = require('./_string-pad');

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});
},{"./_export":32,"./_string-pad":100}],287:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
}, 'trimStart');
},{"./_string-trim":102}],288:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
}, 'trimEnd');
},{"./_string-trim":102}],289:[function(require,module,exports){
require('./_wks-define')('asyncIterator');
},{"./_wks-define":115}],290:[function(require,module,exports){
require('./_wks-define')('observable');
},{"./_wks-define":115}],291:[function(require,module,exports){
// https://github.com/ljharb/proposal-global
var $export = require('./_export');

$export($export.S, 'System', {global: require('./_global')});
},{"./_export":32,"./_global":38}],292:[function(require,module,exports){
var $iterators    = require('./es6.array.iterator')
  , redefine      = require('./_redefine')
  , global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , wks           = require('./_wks')
  , ITERATOR      = wks('iterator')
  , TO_STRING_TAG = wks('toStringTag')
  , ArrayValues   = Iterators.Array;

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype
    , key;
  if(proto){
    if(!proto[ITERATOR])hide(proto, ITERATOR, ArrayValues);
    if(!proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    for(key in $iterators)if(!proto[key])redefine(proto, key, $iterators[key], true);
  }
}
},{"./_global":38,"./_hide":40,"./_iterators":56,"./_redefine":87,"./_wks":117,"./es6.array.iterator":130}],293:[function(require,module,exports){
var $export = require('./_export')
  , $task   = require('./_task');
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./_export":32,"./_task":104}],294:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global     = require('./_global')
  , $export    = require('./_export')
  , invoke     = require('./_invoke')
  , partial    = require('./_partial')
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
},{"./_export":32,"./_global":38,"./_invoke":44,"./_partial":83}],295:[function(require,module,exports){
require('./modules/es6.symbol');
require('./modules/es6.object.create');
require('./modules/es6.object.define-property');
require('./modules/es6.object.define-properties');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.function.bind');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.parse-int');
require('./modules/es6.parse-float');
require('./modules/es6.number.constructor');
require('./modules/es6.number.to-fixed');
require('./modules/es6.number.to-precision');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.string.anchor');
require('./modules/es6.string.big');
require('./modules/es6.string.blink');
require('./modules/es6.string.bold');
require('./modules/es6.string.fixed');
require('./modules/es6.string.fontcolor');
require('./modules/es6.string.fontsize');
require('./modules/es6.string.italics');
require('./modules/es6.string.link');
require('./modules/es6.string.small');
require('./modules/es6.string.strike');
require('./modules/es6.string.sub');
require('./modules/es6.string.sup');
require('./modules/es6.date.now');
require('./modules/es6.date.to-json');
require('./modules/es6.date.to-iso-string');
require('./modules/es6.date.to-string');
require('./modules/es6.date.to-primitive');
require('./modules/es6.array.is-array');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.join');
require('./modules/es6.array.slice');
require('./modules/es6.array.sort');
require('./modules/es6.array.for-each');
require('./modules/es6.array.map');
require('./modules/es6.array.filter');
require('./modules/es6.array.some');
require('./modules/es6.array.every');
require('./modules/es6.array.reduce');
require('./modules/es6.array.reduce-right');
require('./modules/es6.array.index-of');
require('./modules/es6.array.last-index-of');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.array.species');
require('./modules/es6.array.iterator');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.to-string');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.typed.array-buffer');
require('./modules/es6.typed.data-view');
require('./modules/es6.typed.int8-array');
require('./modules/es6.typed.uint8-array');
require('./modules/es6.typed.uint8-clamped-array');
require('./modules/es6.typed.int16-array');
require('./modules/es6.typed.uint16-array');
require('./modules/es6.typed.int32-array');
require('./modules/es6.typed.uint32-array');
require('./modules/es6.typed.float32-array');
require('./modules/es6.typed.float64-array');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-start');
require('./modules/es7.string.pad-end');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.string.match-all');
require('./modules/es7.symbol.async-iterator');
require('./modules/es7.symbol.observable');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.object.define-getter');
require('./modules/es7.object.define-setter');
require('./modules/es7.object.lookup-getter');
require('./modules/es7.object.lookup-setter');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/es7.system.global');
require('./modules/es7.error.is-error');
require('./modules/es7.math.iaddh');
require('./modules/es7.math.isubh');
require('./modules/es7.math.imulh');
require('./modules/es7.math.umulh');
require('./modules/es7.reflect.define-metadata');
require('./modules/es7.reflect.delete-metadata');
require('./modules/es7.reflect.get-metadata');
require('./modules/es7.reflect.get-metadata-keys');
require('./modules/es7.reflect.get-own-metadata');
require('./modules/es7.reflect.get-own-metadata-keys');
require('./modules/es7.reflect.has-metadata');
require('./modules/es7.reflect.has-own-metadata');
require('./modules/es7.reflect.metadata');
require('./modules/es7.asap');
require('./modules/es7.observable');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/_core');
},{"./modules/_core":23,"./modules/es6.array.copy-within":120,"./modules/es6.array.every":121,"./modules/es6.array.fill":122,"./modules/es6.array.filter":123,"./modules/es6.array.find":125,"./modules/es6.array.find-index":124,"./modules/es6.array.for-each":126,"./modules/es6.array.from":127,"./modules/es6.array.index-of":128,"./modules/es6.array.is-array":129,"./modules/es6.array.iterator":130,"./modules/es6.array.join":131,"./modules/es6.array.last-index-of":132,"./modules/es6.array.map":133,"./modules/es6.array.of":134,"./modules/es6.array.reduce":136,"./modules/es6.array.reduce-right":135,"./modules/es6.array.slice":137,"./modules/es6.array.some":138,"./modules/es6.array.sort":139,"./modules/es6.array.species":140,"./modules/es6.date.now":141,"./modules/es6.date.to-iso-string":142,"./modules/es6.date.to-json":143,"./modules/es6.date.to-primitive":144,"./modules/es6.date.to-string":145,"./modules/es6.function.bind":146,"./modules/es6.function.has-instance":147,"./modules/es6.function.name":148,"./modules/es6.map":149,"./modules/es6.math.acosh":150,"./modules/es6.math.asinh":151,"./modules/es6.math.atanh":152,"./modules/es6.math.cbrt":153,"./modules/es6.math.clz32":154,"./modules/es6.math.cosh":155,"./modules/es6.math.expm1":156,"./modules/es6.math.fround":157,"./modules/es6.math.hypot":158,"./modules/es6.math.imul":159,"./modules/es6.math.log10":160,"./modules/es6.math.log1p":161,"./modules/es6.math.log2":162,"./modules/es6.math.sign":163,"./modules/es6.math.sinh":164,"./modules/es6.math.tanh":165,"./modules/es6.math.trunc":166,"./modules/es6.number.constructor":167,"./modules/es6.number.epsilon":168,"./modules/es6.number.is-finite":169,"./modules/es6.number.is-integer":170,"./modules/es6.number.is-nan":171,"./modules/es6.number.is-safe-integer":172,"./modules/es6.number.max-safe-integer":173,"./modules/es6.number.min-safe-integer":174,"./modules/es6.number.parse-float":175,"./modules/es6.number.parse-int":176,"./modules/es6.number.to-fixed":177,"./modules/es6.number.to-precision":178,"./modules/es6.object.assign":179,"./modules/es6.object.create":180,"./modules/es6.object.define-properties":181,"./modules/es6.object.define-property":182,"./modules/es6.object.freeze":183,"./modules/es6.object.get-own-property-descriptor":184,"./modules/es6.object.get-own-property-names":185,"./modules/es6.object.get-prototype-of":186,"./modules/es6.object.is":190,"./modules/es6.object.is-extensible":187,"./modules/es6.object.is-frozen":188,"./modules/es6.object.is-sealed":189,"./modules/es6.object.keys":191,"./modules/es6.object.prevent-extensions":192,"./modules/es6.object.seal":193,"./modules/es6.object.set-prototype-of":194,"./modules/es6.object.to-string":195,"./modules/es6.parse-float":196,"./modules/es6.parse-int":197,"./modules/es6.promise":198,"./modules/es6.reflect.apply":199,"./modules/es6.reflect.construct":200,"./modules/es6.reflect.define-property":201,"./modules/es6.reflect.delete-property":202,"./modules/es6.reflect.enumerate":203,"./modules/es6.reflect.get":206,"./modules/es6.reflect.get-own-property-descriptor":204,"./modules/es6.reflect.get-prototype-of":205,"./modules/es6.reflect.has":207,"./modules/es6.reflect.is-extensible":208,"./modules/es6.reflect.own-keys":209,"./modules/es6.reflect.prevent-extensions":210,"./modules/es6.reflect.set":212,"./modules/es6.reflect.set-prototype-of":211,"./modules/es6.regexp.constructor":213,"./modules/es6.regexp.flags":214,"./modules/es6.regexp.match":215,"./modules/es6.regexp.replace":216,"./modules/es6.regexp.search":217,"./modules/es6.regexp.split":218,"./modules/es6.regexp.to-string":219,"./modules/es6.set":220,"./modules/es6.string.anchor":221,"./modules/es6.string.big":222,"./modules/es6.string.blink":223,"./modules/es6.string.bold":224,"./modules/es6.string.code-point-at":225,"./modules/es6.string.ends-with":226,"./modules/es6.string.fixed":227,"./modules/es6.string.fontcolor":228,"./modules/es6.string.fontsize":229,"./modules/es6.string.from-code-point":230,"./modules/es6.string.includes":231,"./modules/es6.string.italics":232,"./modules/es6.string.iterator":233,"./modules/es6.string.link":234,"./modules/es6.string.raw":235,"./modules/es6.string.repeat":236,"./modules/es6.string.small":237,"./modules/es6.string.starts-with":238,"./modules/es6.string.strike":239,"./modules/es6.string.sub":240,"./modules/es6.string.sup":241,"./modules/es6.string.trim":242,"./modules/es6.symbol":243,"./modules/es6.typed.array-buffer":244,"./modules/es6.typed.data-view":245,"./modules/es6.typed.float32-array":246,"./modules/es6.typed.float64-array":247,"./modules/es6.typed.int16-array":248,"./modules/es6.typed.int32-array":249,"./modules/es6.typed.int8-array":250,"./modules/es6.typed.uint16-array":251,"./modules/es6.typed.uint32-array":252,"./modules/es6.typed.uint8-array":253,"./modules/es6.typed.uint8-clamped-array":254,"./modules/es6.weak-map":255,"./modules/es6.weak-set":256,"./modules/es7.array.includes":257,"./modules/es7.asap":258,"./modules/es7.error.is-error":259,"./modules/es7.map.to-json":260,"./modules/es7.math.iaddh":261,"./modules/es7.math.imulh":262,"./modules/es7.math.isubh":263,"./modules/es7.math.umulh":264,"./modules/es7.object.define-getter":265,"./modules/es7.object.define-setter":266,"./modules/es7.object.entries":267,"./modules/es7.object.get-own-property-descriptors":268,"./modules/es7.object.lookup-getter":269,"./modules/es7.object.lookup-setter":270,"./modules/es7.object.values":271,"./modules/es7.observable":272,"./modules/es7.reflect.define-metadata":273,"./modules/es7.reflect.delete-metadata":274,"./modules/es7.reflect.get-metadata":276,"./modules/es7.reflect.get-metadata-keys":275,"./modules/es7.reflect.get-own-metadata":278,"./modules/es7.reflect.get-own-metadata-keys":277,"./modules/es7.reflect.has-metadata":279,"./modules/es7.reflect.has-own-metadata":280,"./modules/es7.reflect.metadata":281,"./modules/es7.set.to-json":282,"./modules/es7.string.at":283,"./modules/es7.string.match-all":284,"./modules/es7.string.pad-end":285,"./modules/es7.string.pad-start":286,"./modules/es7.string.trim-left":287,"./modules/es7.string.trim-right":288,"./modules/es7.symbol.async-iterator":289,"./modules/es7.symbol.observable":290,"./modules/es7.system.global":291,"./modules/web.dom.iterable":292,"./modules/web.immediate":293,"./modules/web.timers":294}],296:[function(require,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],297:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Css = function () {
  function Css() {
    _classCallCheck(this, Css);
  }

  _createClass(Css, [{
    key: 'rules',


    //
    // Returns CSS rules.
    //
    value: function rules() {
      if (this.style === null) {
        return null;
      }
      if (typeof this.style.sheet.cssRules !== 'undefined') {
        return this.style.sheet.cssRules;
      }
      return this.style.sheet.rules;
    }

    //
    // Remove a rule of index
    //

  }, {
    key: 'removeRule',
    value: function removeRule(index) {
      if (typeof this.style.sheet.deleteRule !== 'undefined') {
        return this.style.sheet.deleteRule(index);
      }
      return this.style.sheet.removeRule(index);
    }

    //
    // Add rule for selector with styles.
    //

  }, {
    key: 'addRule',
    value: function addRule(selector, styles) {
      if (this.style === null) {
        return null;
      }
      var len = this.rules().length;
      if (typeof styles === 'undefined') {
        var cssString = selector + ' {}';
        this.style.sheet.insertRule(cssString, len);
        return this.rules()[len].style;
      } else {
        var _cssString = selector + ' {';
        for (var key in styles) {
          _cssString += key + ': ' + styles[key] + ' !important;';
        }
        _cssString += '}';
        return this.style.sheet.insertRule(_cssString, len);
      }
    }

    //
    // Clear all rules
    //

  }, {
    key: 'clearRules',
    value: function clearRules() {
      if (this.style === null) {
        return;
      }
      while (this.rules().length != 0) {
        this.removeRule(0);
      }
    }

    //
    // Remove <style> element
    //

  }, {
    key: 'finalize',
    value: function finalize() {
      if (this.style === null) {
        return;
      }
      window.document.head.removeChild(this.style);
      this.style = null;
    }
  }], [{
    key: 'create',


    //
    // Create <style> element into tag with id and return Css object.
    //
    value: function create(id) {
      if (document.getElementById(id)) {
        throw new Error('The element \'#' + id + '\' is existing.  The id was conflicted.');
      }

      var style = document.createElement('style');
      style.appendChild(document.createTextNode(''));
      if (typeof id !== 'undefined') {
        style.id = id;
      }
      window.document.head.appendChild(style);

      var css = new Css();
      css.style = style;
      return css;
    }

    //
    // Find <style> element which has id, and return Css object.
    // If no element is found, return null.
    //

  }, {
    key: 'findById',
    value: function findById(id) {
      var ele = document.getElementById(id);
      if (ele === null) {
        return null;
      }

      var css = new Css();
      css.style = ele;
      return css;
    }

    //
    // Find <style> element which has id, and return Css object.
    // If no element is found, create <style> element and return Css object.
    //

  }, {
    key: 'findOrCreate',
    value: function findOrCreate(id) {
      var css = this.findById(id);
      if (css === null) {
        css = this.create(id);
      }
      return css;
    }
  }]);

  return Css;
}();

exports.default = Css;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNzcy5qcyJdLCJuYW1lcyI6WyJDc3MiLCJzdHlsZSIsInNoZWV0IiwiY3NzUnVsZXMiLCJydWxlcyIsImluZGV4IiwiZGVsZXRlUnVsZSIsInJlbW92ZVJ1bGUiLCJzZWxlY3RvciIsInN0eWxlcyIsImxlbiIsImxlbmd0aCIsImNzc1N0cmluZyIsImluc2VydFJ1bGUiLCJrZXkiLCJ3aW5kb3ciLCJkb2N1bWVudCIsImhlYWQiLCJyZW1vdmVDaGlsZCIsImlkIiwiZ2V0RWxlbWVudEJ5SWQiLCJFcnJvciIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZVRleHROb2RlIiwiY3NzIiwiZWxlIiwiZmluZEJ5SWQiLCJjcmVhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBcUJBLEc7Ozs7Ozs7OztBQWlEbkI7QUFDQTtBQUNBOzRCQUNRO0FBQ04sVUFBSSxLQUFLQyxLQUFMLEtBQWUsSUFBbkIsRUFBeUI7QUFBRSxlQUFPLElBQVA7QUFBYztBQUN6QyxVQUFJLE9BQU8sS0FBS0EsS0FBTCxDQUFXQyxLQUFYLENBQWlCQyxRQUF4QixLQUFxQyxXQUF6QyxFQUFzRDtBQUNwRCxlQUFPLEtBQUtGLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQkMsUUFBeEI7QUFDRDtBQUNELGFBQU8sS0FBS0YsS0FBTCxDQUFXQyxLQUFYLENBQWlCRSxLQUF4QjtBQUNEOztBQUVEO0FBQ0E7QUFDQTs7OzsrQkFDV0MsSyxFQUFPO0FBQ2hCLFVBQUksT0FBTyxLQUFLSixLQUFMLENBQVdDLEtBQVgsQ0FBaUJJLFVBQXhCLEtBQXVDLFdBQTNDLEVBQXdEO0FBQ3RELGVBQU8sS0FBS0wsS0FBTCxDQUFXQyxLQUFYLENBQWlCSSxVQUFqQixDQUE0QkQsS0FBNUIsQ0FBUDtBQUNEO0FBQ0QsYUFBTyxLQUFLSixLQUFMLENBQVdDLEtBQVgsQ0FBaUJLLFVBQWpCLENBQTRCRixLQUE1QixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBOzs7OzRCQUNRRyxRLEVBQVVDLE0sRUFBUTtBQUN4QixVQUFJLEtBQUtSLEtBQUwsS0FBZSxJQUFuQixFQUF5QjtBQUFFLGVBQU8sSUFBUDtBQUFjO0FBQ3pDLFVBQUlTLE1BQU0sS0FBS04sS0FBTCxHQUFhTyxNQUF2QjtBQUNBLFVBQUksT0FBT0YsTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUNqQyxZQUFJRyxZQUFlSixRQUFmLFFBQUo7QUFDQSxhQUFLUCxLQUFMLENBQVdDLEtBQVgsQ0FBaUJXLFVBQWpCLENBQTRCRCxTQUE1QixFQUF1Q0YsR0FBdkM7QUFDQSxlQUFPLEtBQUtOLEtBQUwsR0FBYU0sR0FBYixFQUFrQlQsS0FBekI7QUFDRCxPQUpELE1BSU87QUFDTCxZQUFJVyxhQUFlSixRQUFmLE9BQUo7QUFDQSxhQUFLLElBQUlNLEdBQVQsSUFBZ0JMLE1BQWhCLEVBQXdCO0FBQ3RCRyx3QkFBZ0JFLEdBQWhCLFVBQXdCTCxPQUFPSyxHQUFQLENBQXhCO0FBQ0Q7QUFDREYsc0JBQWEsR0FBYjtBQUNBLGVBQU8sS0FBS1gsS0FBTCxDQUFXQyxLQUFYLENBQWlCVyxVQUFqQixDQUE0QkQsVUFBNUIsRUFBdUNGLEdBQXZDLENBQVA7QUFDRDtBQUNGOztBQUVEO0FBQ0E7QUFDQTs7OztpQ0FDYTtBQUNYLFVBQUksS0FBS1QsS0FBTCxLQUFlLElBQW5CLEVBQXlCO0FBQUU7QUFBUztBQUNwQyxhQUFPLEtBQUtHLEtBQUwsR0FBYU8sTUFBYixJQUF1QixDQUE5QixFQUFpQztBQUMvQixhQUFLSixVQUFMLENBQWdCLENBQWhCO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7Ozs7K0JBQ1c7QUFDVCxVQUFJLEtBQUtOLEtBQUwsS0FBZSxJQUFuQixFQUF5QjtBQUFFO0FBQVM7QUFDcENjLGFBQU9DLFFBQVAsQ0FBZ0JDLElBQWhCLENBQXFCQyxXQUFyQixDQUFpQyxLQUFLakIsS0FBdEM7QUFDQSxXQUFLQSxLQUFMLEdBQWEsSUFBYjtBQUNEOzs7OztBQXpHRDtBQUNBO0FBQ0E7MkJBQ2NrQixFLEVBQUk7QUFDaEIsVUFBSUgsU0FBU0ksY0FBVCxDQUF3QkQsRUFBeEIsQ0FBSixFQUFpQztBQUMvQixjQUFNLElBQUlFLEtBQUoscUJBQTJCRixFQUEzQiw2Q0FBTjtBQUNEOztBQUVELFVBQUlsQixRQUFRZSxTQUFTTSxhQUFULENBQXVCLE9BQXZCLENBQVo7QUFDQXJCLFlBQU1zQixXQUFOLENBQWtCUCxTQUFTUSxjQUFULENBQXdCLEVBQXhCLENBQWxCO0FBQ0EsVUFBSSxPQUFPTCxFQUFQLEtBQWMsV0FBbEIsRUFBK0I7QUFDN0JsQixjQUFNa0IsRUFBTixHQUFXQSxFQUFYO0FBQ0Q7QUFDREosYUFBT0MsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJNLFdBQXJCLENBQWlDdEIsS0FBakM7O0FBRUEsVUFBSXdCLE1BQU0sSUFBSXpCLEdBQUosRUFBVjtBQUNBeUIsVUFBSXhCLEtBQUosR0FBWUEsS0FBWjtBQUNBLGFBQU93QixHQUFQO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7Ozs7NkJBQ2dCTixFLEVBQUk7QUFDbEIsVUFBSU8sTUFBTVYsU0FBU0ksY0FBVCxDQUF3QkQsRUFBeEIsQ0FBVjtBQUNBLFVBQUlPLFFBQVEsSUFBWixFQUFrQjtBQUNoQixlQUFPLElBQVA7QUFDRDs7QUFFRCxVQUFJRCxNQUFNLElBQUl6QixHQUFKLEVBQVY7QUFDQXlCLFVBQUl4QixLQUFKLEdBQVl5QixHQUFaO0FBQ0EsYUFBT0QsR0FBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBOzs7O2lDQUNvQk4sRSxFQUFJO0FBQ3RCLFVBQUlNLE1BQU0sS0FBS0UsUUFBTCxDQUFjUixFQUFkLENBQVY7QUFDQSxVQUFJTSxRQUFRLElBQVosRUFBa0I7QUFDaEJBLGNBQU0sS0FBS0csTUFBTCxDQUFZVCxFQUFaLENBQU47QUFDRDtBQUNELGFBQU9NLEdBQVA7QUFDRDs7Ozs7O2tCQS9Da0J6QixHIiwiZmlsZSI6ImNzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIENzcyB7XG5cbiAgLy9cbiAgLy8gQ3JlYXRlIDxzdHlsZT4gZWxlbWVudCBpbnRvIHRhZyB3aXRoIGlkIGFuZCByZXR1cm4gQ3NzIG9iamVjdC5cbiAgLy9cbiAgc3RhdGljIGNyZWF0ZShpZCkge1xuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGVsZW1lbnQgJyMke2lkfScgaXMgZXhpc3RpbmcuICBUaGUgaWQgd2FzIGNvbmZsaWN0ZWQuYCk7XG4gICAgfVxuXG4gICAgbGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpO1xuICAgIGlmICh0eXBlb2YgaWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBzdHlsZS5pZCA9IGlkO1xuICAgIH1cbiAgICB3aW5kb3cuZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cbiAgICBsZXQgY3NzID0gbmV3IENzcygpO1xuICAgIGNzcy5zdHlsZSA9IHN0eWxlO1xuICAgIHJldHVybiBjc3M7XG4gIH1cblxuICAvL1xuICAvLyBGaW5kIDxzdHlsZT4gZWxlbWVudCB3aGljaCBoYXMgaWQsIGFuZCByZXR1cm4gQ3NzIG9iamVjdC5cbiAgLy8gSWYgbm8gZWxlbWVudCBpcyBmb3VuZCwgcmV0dXJuIG51bGwuXG4gIC8vXG4gIHN0YXRpYyBmaW5kQnlJZChpZCkge1xuICAgIGxldCBlbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgaWYgKGVsZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGNzcyA9IG5ldyBDc3MoKTtcbiAgICBjc3Muc3R5bGUgPSBlbGU7XG4gICAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIC8vXG4gIC8vIEZpbmQgPHN0eWxlPiBlbGVtZW50IHdoaWNoIGhhcyBpZCwgYW5kIHJldHVybiBDc3Mgb2JqZWN0LlxuICAvLyBJZiBubyBlbGVtZW50IGlzIGZvdW5kLCBjcmVhdGUgPHN0eWxlPiBlbGVtZW50IGFuZCByZXR1cm4gQ3NzIG9iamVjdC5cbiAgLy9cbiAgc3RhdGljIGZpbmRPckNyZWF0ZShpZCkge1xuICAgIGxldCBjc3MgPSB0aGlzLmZpbmRCeUlkKGlkKTtcbiAgICBpZiAoY3NzID09PSBudWxsKSB7XG4gICAgICBjc3MgPSB0aGlzLmNyZWF0ZShpZCk7XG4gICAgfVxuICAgIHJldHVybiBjc3M7XG4gIH1cblxuICAvL1xuICAvLyBSZXR1cm5zIENTUyBydWxlcy5cbiAgLy9cbiAgcnVsZXMoKSB7XG4gICAgaWYgKHRoaXMuc3R5bGUgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBpZiAodHlwZW9mIHRoaXMuc3R5bGUuc2hlZXQuY3NzUnVsZXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHlsZS5zaGVldC5jc3NSdWxlcztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3R5bGUuc2hlZXQucnVsZXM7XG4gIH1cblxuICAvL1xuICAvLyBSZW1vdmUgYSBydWxlIG9mIGluZGV4XG4gIC8vXG4gIHJlbW92ZVJ1bGUoaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuc3R5bGUuc2hlZXQuZGVsZXRlUnVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0eWxlLnNoZWV0LmRlbGV0ZVJ1bGUoaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdHlsZS5zaGVldC5yZW1vdmVSdWxlKGluZGV4KTtcbiAgfVxuXG4gIC8vXG4gIC8vIEFkZCBydWxlIGZvciBzZWxlY3RvciB3aXRoIHN0eWxlcy5cbiAgLy9cbiAgYWRkUnVsZShzZWxlY3Rvciwgc3R5bGVzKSB7XG4gICAgaWYgKHRoaXMuc3R5bGUgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBsZXQgbGVuID0gdGhpcy5ydWxlcygpLmxlbmd0aDtcbiAgICBpZiAodHlwZW9mIHN0eWxlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGxldCBjc3NTdHJpbmcgPSBgJHtzZWxlY3Rvcn0ge31gO1xuICAgICAgdGhpcy5zdHlsZS5zaGVldC5pbnNlcnRSdWxlKGNzc1N0cmluZywgbGVuKTtcbiAgICAgIHJldHVybiB0aGlzLnJ1bGVzKClbbGVuXS5zdHlsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGNzc1N0cmluZyA9IGAke3NlbGVjdG9yfSB7YDtcbiAgICAgIGZvciAobGV0IGtleSBpbiBzdHlsZXMpIHtcbiAgICAgICAgY3NzU3RyaW5nICs9IGAke2tleX06ICR7c3R5bGVzW2tleV19ICFpbXBvcnRhbnQ7YDtcbiAgICAgIH1cbiAgICAgIGNzc1N0cmluZyArPSAnfSc7XG4gICAgICByZXR1cm4gdGhpcy5zdHlsZS5zaGVldC5pbnNlcnRSdWxlKGNzc1N0cmluZywgbGVuKTtcbiAgICB9XG4gIH1cblxuICAvL1xuICAvLyBDbGVhciBhbGwgcnVsZXNcbiAgLy9cbiAgY2xlYXJSdWxlcygpIHtcbiAgICBpZiAodGhpcy5zdHlsZSA9PT0gbnVsbCkgeyByZXR1cm47IH1cbiAgICB3aGlsZSAodGhpcy5ydWxlcygpLmxlbmd0aCAhPSAwKSB7XG4gICAgICB0aGlzLnJlbW92ZVJ1bGUoMCk7XG4gICAgfVxuICB9XG5cbiAgLy9cbiAgLy8gUmVtb3ZlIDxzdHlsZT4gZWxlbWVudFxuICAvL1xuICBmaW5hbGl6ZSgpIHtcbiAgICBpZiAodGhpcy5zdHlsZSA9PT0gbnVsbCkgeyByZXR1cm47IH1cbiAgICB3aW5kb3cuZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZCh0aGlzLnN0eWxlKTtcbiAgICB0aGlzLnN0eWxlID0gbnVsbDtcbiAgfVxufVxuIl19
},{}],298:[function(require,module,exports){
'use strict';

var _nucleus = require('./nucleus');

var _nucleus2 = _interopRequireDefault(_nucleus);

var _viewer = require('./viewer');

var _viewer2 = _interopRequireDefault(_viewer);

var _page_effect = require('./page_effect');

var PageEffect = _interopRequireWildcard(_page_effect);

var _plugin = require('./plugin');

var _plugin2 = _interopRequireDefault(_plugin);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// To support ES6 classes
require('babel-polyfill');

var nucleusInstance = new _nucleus2.default();
window.Libretto = {
  registerPageEffect: PageEffect.registerPageEffect,
  loadPageEffect: PageEffect.loadPageEffect,
  Plugin: _plugin2.default,
  nucleus: function nucleus() {
    return nucleusInstance;
  }
};

new _viewer2.default();

// Load plugins
require('./plugins/2d-animations');
require('./plugins/auto_zoom.js');
require('./plugins/location.js');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfOTg5OTU3NWEuanMiXSwibmFtZXMiOlsiUGFnZUVmZmVjdCIsInJlcXVpcmUiLCJudWNsZXVzSW5zdGFuY2UiLCJ3aW5kb3ciLCJMaWJyZXR0byIsInJlZ2lzdGVyUGFnZUVmZmVjdCIsImxvYWRQYWdlRWZmZWN0IiwiUGx1Z2luIiwibnVjbGV1cyJdLCJtYXBwaW5ncyI6Ijs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLFU7O0FBQ1o7Ozs7Ozs7O0FBTkE7QUFDQUMsUUFBUSxnQkFBUjs7QUFPQSxJQUFJQyxrQkFBa0IsdUJBQXRCO0FBQ0FDLE9BQU9DLFFBQVAsR0FBa0I7QUFDaEJDLHNCQUFvQkwsV0FBV0ssa0JBRGY7QUFFaEJDLGtCQUFnQk4sV0FBV00sY0FGWDtBQUdoQkMsMEJBSGdCO0FBSWhCQyxXQUFTO0FBQUEsV0FBTU4sZUFBTjtBQUFBO0FBSk8sQ0FBbEI7O0FBT0E7O0FBRUE7QUFDQUQsUUFBUSx5QkFBUjtBQUNBQSxRQUFRLHdCQUFSO0FBQ0FBLFFBQVEsdUJBQVIiLCJmaWxlIjoiZmFrZV85ODk5NTc1YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRvIHN1cHBvcnQgRVM2IGNsYXNzZXNcbnJlcXVpcmUoJ2JhYmVsLXBvbHlmaWxsJyk7XG5cbmltcG9ydCBOdWNsZXVzIGZyb20gJy4vbnVjbGV1cyc7XG5pbXBvcnQgVmlld2VyIGZyb20gJy4vdmlld2VyJztcbmltcG9ydCAqIGFzIFBhZ2VFZmZlY3QgZnJvbSAnLi9wYWdlX2VmZmVjdCc7XG5pbXBvcnQgUGx1Z2luIGZyb20gJy4vcGx1Z2luJztcblxubGV0IG51Y2xldXNJbnN0YW5jZSA9IG5ldyBOdWNsZXVzKCk7XG53aW5kb3cuTGlicmV0dG8gPSB7XG4gIHJlZ2lzdGVyUGFnZUVmZmVjdDogUGFnZUVmZmVjdC5yZWdpc3RlclBhZ2VFZmZlY3QsXG4gIGxvYWRQYWdlRWZmZWN0OiBQYWdlRWZmZWN0LmxvYWRQYWdlRWZmZWN0LFxuICBQbHVnaW4sXG4gIG51Y2xldXM6ICgpID0+IG51Y2xldXNJbnN0YW5jZVxufTtcblxubmV3IFZpZXdlcigpO1xuXG4vLyBMb2FkIHBsdWdpbnNcbnJlcXVpcmUoJy4vcGx1Z2lucy8yZC1hbmltYXRpb25zJyk7XG5yZXF1aXJlKCcuL3BsdWdpbnMvYXV0b196b29tLmpzJyk7XG5yZXF1aXJlKCcuL3BsdWdpbnMvbG9jYXRpb24uanMnKTtcbiJdfQ==
},{"./nucleus":300,"./page_effect":302,"./plugin":304,"./plugins/2d-animations":305,"./plugins/auto_zoom.js":306,"./plugins/location.js":308,"./viewer":309,"babel-polyfill":1}],299:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Libretto.Keyframe class
//
// The Libretto.Keyframe class provides the keyframe of the animation.
// The animation mechanism is very simple, the style (css) of the element in
// HTML will be overwritten when the keyframe is fired.  To use it, create a
// Libretto.Keyframe from the HTML element object which described as <keyframe>
// tag in HTML.  The <keyframe> tag is distinctive specification in Libretto.js.
// The keyframe will be fired with start() method.

var Keyframe = function () {
  // Constructs a Keyframe object with the given element which is a element
  // contained in <keyframe>.
  function Keyframe(element) {
    _classCallCheck(this, Keyframe);

    if (!(element instanceof Element)) {
      throw new TypeError('Argument 1 does not implement interface Element');
    }
    this.element = element;
  }

  // Returns the target of the keyframe.


  _createClass(Keyframe, [{
    key: 'target',
    value: function target() {
      return this.element.getAttribute('target');
    }

    // Returns the duration of the animation as text.  Return null If the
    // duration is note speficied.

  }, {
    key: 'duration',
    value: function duration() {
      return this.element.getAttribute('duration');
    }
  }, {
    key: 'properties',
    value: function properties() {
      var obj = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Array.prototype.slice.call(this.element.attributes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var attr = _step.value;

          if (attr.nodeName !== 'target' && attr.nodeName !== 'duration') {
            obj[attr.nodeName] = attr.value;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return obj;
    }
  }, {
    key: 'delay',
    value: function delay() {
      return this.element.getAttribute('delay');
    }
  }, {
    key: 'timing',
    value: function timing() {
      return this.element.getAttribute('timing');
    }

    // Converts time descrived as string to millisecond
    // timeToMs("200ms")    // return 200
    // timeToMs("5s")       // return 5000
    // timeToMs("1.4s")     // return 1400

  }], [{
    key: 'timeToMillisecond',
    value: function timeToMillisecond(time) {
      if (time.length === 0) {
        return null;
      }
      var msec1 = Number(time.split('ms')[0]);
      var msec2 = time.split('s')[0] * 1000;
      var num = msec1 || msec2;
      if (isNaN(num)) {
        return null;
      }
      return num;
    }
  }]);

  return Keyframe;
}();

exports.default = Keyframe;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImtleWZyYW1lLmpzIl0sIm5hbWVzIjpbIktleWZyYW1lIiwiZWxlbWVudCIsIkVsZW1lbnQiLCJUeXBlRXJyb3IiLCJnZXRBdHRyaWJ1dGUiLCJvYmoiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsImF0dHJpYnV0ZXMiLCJhdHRyIiwibm9kZU5hbWUiLCJ2YWx1ZSIsInRpbWUiLCJsZW5ndGgiLCJtc2VjMSIsIk51bWJlciIsInNwbGl0IiwibXNlYzIiLCJudW0iLCJpc05hTiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0lBRXFCQSxRO0FBQ25CO0FBQ0E7QUFDQSxvQkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUNuQixRQUFJLEVBQUVBLG1CQUFtQkMsT0FBckIsQ0FBSixFQUFtQztBQUNqQyxZQUFNLElBQUlDLFNBQUosQ0FBYyxpREFBZCxDQUFOO0FBQ0Q7QUFDRCxTQUFLRixPQUFMLEdBQWVBLE9BQWY7QUFDRDs7QUFFRDs7Ozs7NkJBQ1M7QUFDUCxhQUFPLEtBQUtBLE9BQUwsQ0FBYUcsWUFBYixDQUEwQixRQUExQixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQTs7OzsrQkFDVztBQUNULGFBQU8sS0FBS0gsT0FBTCxDQUFhRyxZQUFiLENBQTBCLFVBQTFCLENBQVA7QUFDRDs7O2lDQUVZO0FBQ1gsVUFBSUMsTUFBTSxFQUFWO0FBRFc7QUFBQTtBQUFBOztBQUFBO0FBRVgsNkJBQWlCQyxNQUFNQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsSUFBdEIsQ0FBMkIsS0FBS1IsT0FBTCxDQUFhUyxVQUF4QyxDQUFqQiw4SEFBc0U7QUFBQSxjQUE3REMsSUFBNkQ7O0FBQ3BFLGNBQUlBLEtBQUtDLFFBQUwsS0FBa0IsUUFBbEIsSUFBOEJELEtBQUtDLFFBQUwsS0FBa0IsVUFBcEQsRUFBZ0U7QUFDOURQLGdCQUFJTSxLQUFLQyxRQUFULElBQXFCRCxLQUFLRSxLQUExQjtBQUNEO0FBQ0Y7QUFOVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU9YLGFBQU9SLEdBQVA7QUFDRDs7OzRCQUVPO0FBQ04sYUFBTyxLQUFLSixPQUFMLENBQWFHLFlBQWIsQ0FBMEIsT0FBMUIsQ0FBUDtBQUNEOzs7NkJBRVE7QUFDUCxhQUFPLEtBQUtILE9BQUwsQ0FBYUcsWUFBYixDQUEwQixRQUExQixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7Ozs7c0NBQ3lCVSxJLEVBQU07QUFDN0IsVUFBSUEsS0FBS0MsTUFBTCxLQUFnQixDQUFwQixFQUF1QjtBQUFFLGVBQU8sSUFBUDtBQUFjO0FBQ3ZDLFVBQUlDLFFBQVFDLE9BQU9ILEtBQUtJLEtBQUwsQ0FBVyxJQUFYLEVBQWlCLENBQWpCLENBQVAsQ0FBWjtBQUNBLFVBQUlDLFFBQVFMLEtBQUtJLEtBQUwsQ0FBVyxHQUFYLEVBQWdCLENBQWhCLElBQXFCLElBQWpDO0FBQ0EsVUFBSUUsTUFBTUosU0FBU0csS0FBbkI7QUFDQSxVQUFJRSxNQUFNRCxHQUFOLENBQUosRUFBZ0I7QUFBRSxlQUFPLElBQVA7QUFBYztBQUNoQyxhQUFPQSxHQUFQO0FBQ0Q7Ozs7OztrQkFsRGtCcEIsUSIsImZpbGUiOiJrZXlmcmFtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExpYnJldHRvLktleWZyYW1lIGNsYXNzXG4vL1xuLy8gVGhlIExpYnJldHRvLktleWZyYW1lIGNsYXNzIHByb3ZpZGVzIHRoZSBrZXlmcmFtZSBvZiB0aGUgYW5pbWF0aW9uLlxuLy8gVGhlIGFuaW1hdGlvbiBtZWNoYW5pc20gaXMgdmVyeSBzaW1wbGUsIHRoZSBzdHlsZSAoY3NzKSBvZiB0aGUgZWxlbWVudCBpblxuLy8gSFRNTCB3aWxsIGJlIG92ZXJ3cml0dGVuIHdoZW4gdGhlIGtleWZyYW1lIGlzIGZpcmVkLiAgVG8gdXNlIGl0LCBjcmVhdGUgYVxuLy8gTGlicmV0dG8uS2V5ZnJhbWUgZnJvbSB0aGUgSFRNTCBlbGVtZW50IG9iamVjdCB3aGljaCBkZXNjcmliZWQgYXMgPGtleWZyYW1lPlxuLy8gdGFnIGluIEhUTUwuICBUaGUgPGtleWZyYW1lPiB0YWcgaXMgZGlzdGluY3RpdmUgc3BlY2lmaWNhdGlvbiBpbiBMaWJyZXR0by5qcy5cbi8vIFRoZSBrZXlmcmFtZSB3aWxsIGJlIGZpcmVkIHdpdGggc3RhcnQoKSBtZXRob2QuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleWZyYW1lIHtcbiAgLy8gQ29uc3RydWN0cyBhIEtleWZyYW1lIG9iamVjdCB3aXRoIHRoZSBnaXZlbiBlbGVtZW50IHdoaWNoIGlzIGEgZWxlbWVudFxuICAvLyBjb250YWluZWQgaW4gPGtleWZyYW1lPi5cbiAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuICAgIGlmICghKGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgMSBkb2VzIG5vdCBpbXBsZW1lbnQgaW50ZXJmYWNlIEVsZW1lbnQnKTtcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIHRhcmdldCBvZiB0aGUga2V5ZnJhbWUuXG4gIHRhcmdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgndGFyZ2V0Jyk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBkdXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uIGFzIHRleHQuICBSZXR1cm4gbnVsbCBJZiB0aGVcbiAgLy8gZHVyYXRpb24gaXMgbm90ZSBzcGVmaWNpZWQuXG4gIGR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkdXJhdGlvbicpO1xuICB9XG5cbiAgcHJvcGVydGllcygpIHtcbiAgICBsZXQgb2JqID0ge307XG4gICAgZm9yIChsZXQgYXR0ciBvZiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmVsZW1lbnQuYXR0cmlidXRlcykpIHtcbiAgICAgIGlmIChhdHRyLm5vZGVOYW1lICE9PSAndGFyZ2V0JyAmJiBhdHRyLm5vZGVOYW1lICE9PSAnZHVyYXRpb24nKSB7XG4gICAgICAgIG9ialthdHRyLm5vZGVOYW1lXSA9IGF0dHIudmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBkZWxheSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnZGVsYXknKTtcbiAgfVxuXG4gIHRpbWluZygpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgndGltaW5nJyk7XG4gIH1cblxuICAvLyBDb252ZXJ0cyB0aW1lIGRlc2NyaXZlZCBhcyBzdHJpbmcgdG8gbWlsbGlzZWNvbmRcbiAgLy8gdGltZVRvTXMoXCIyMDBtc1wiKSAgICAvLyByZXR1cm4gMjAwXG4gIC8vIHRpbWVUb01zKFwiNXNcIikgICAgICAgLy8gcmV0dXJuIDUwMDBcbiAgLy8gdGltZVRvTXMoXCIxLjRzXCIpICAgICAvLyByZXR1cm4gMTQwMFxuICBzdGF0aWMgdGltZVRvTWlsbGlzZWNvbmQodGltZSkge1xuICAgIGlmICh0aW1lLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGxldCBtc2VjMSA9IE51bWJlcih0aW1lLnNwbGl0KCdtcycpWzBdKTtcbiAgICBsZXQgbXNlYzIgPSB0aW1lLnNwbGl0KCdzJylbMF0gKiAxMDAwO1xuICAgIGxldCBudW0gPSBtc2VjMSB8fCBtc2VjMjtcbiAgICBpZiAoaXNOYU4obnVtKSkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiBudW07XG4gIH1cblxufVxuIl19
},{}],300:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _page = require('./page');

var _page2 = _interopRequireDefault(_page);

var _keyframe = require('./keyframe');

var _keyframe2 = _interopRequireDefault(_keyframe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Nucleus = function () {

  //
  // Initializes internal variables and HTML contents.
  //
  function Nucleus() {
    var _this = this;

    _classCallCheck(this, Nucleus);

    var eventTarget = document.createDocumentFragment();
    ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(function (method) {
      _this[method] = eventTarget[method].bind(eventTarget);
    }, this);

    this.nextKeyframe = null;
    this.currentIndex = null;
    this.pageTransition = null;
  }

  _createClass(Nucleus, [{
    key: 'getPageIndex',
    value: function getPageIndex() {
      return this.currentIndex;
    }

    //
    // Animate the element of page to next.
    //

  }, {
    key: 'step',
    value: function step() {
      if (this.nextKeyframe) {
        this.execNextKeyframe();
      } else if (this.currentIndex + 1 >= _page2.default.count()) {
        return;
      } else {
        var from = this.currentIndex;
        var to = this.currentIndex + 1;
        var transitEvent = new CustomEvent('page.transit', {
          detail: { from: from, to: to }
        });
        var changedEvent = new CustomEvent('page.changed', {
          detail: { from: from, to: to }
        });
        this.currentIndex += 1;
        var currentPage = _page2.default.pageAt(this.currentIndex);
        this.nextKeyframe = currentPage.element.querySelector('animation > keyframe');

        this.dispatchEvent(transitEvent);
        this.dispatchEvent(changedEvent);
      }
    }

    //
    // Skips to specified page without animation.
    //

  }, {
    key: 'skipTo',
    value: function skipTo(index) {
      var pageCount = _page2.default.count();
      if (pageCount === 0) {
        return;
      }

      index = Math.max(0, index);
      index = Math.min(pageCount - 1, index);
      if (index === this.currentIndex) {
        return;
      }

      var from = this.currentIndex;
      var to = index;
      var skipEvent = new CustomEvent('page.skip', {
        detail: { from: from, to: to }
      });
      var changedEvent = new CustomEvent('page.changed', {
        detail: { from: from, to: to }
      });
      this.currentIndex = index;
      var currentPage = _page2.default.pageAt(this.currentIndex);
      this.nextKeyframe = currentPage.element.querySelector('animation > keyframe');
      this.dispatchEvent(skipEvent);
      this.dispatchEvent(changedEvent);
    }
  }, {
    key: 'execNextKeyframe',
    value: function execNextKeyframe() {
      // grouping and calculating delays
      var totalDelay = 0;
      while (true) {
        var keyframe = new _keyframe2.default(this.nextKeyframe);
        var delay = totalDelay;
        if (!keyframe.delay()) {
          delay = totalDelay;
        }
        var target = keyframe.target();
        if (target === null) {
          console.warn('The animation target is not specified.');
        }
        var properties = keyframe.properties();
        var duration = keyframe.duration();
        properties['transition-delay'] = delay + 'ms';
        properties['transition-duration'] = duration;
        target = 'section:nth-of-type(' + (this.currentIndex + 1) + ') ' + target;
        var e = new CustomEvent('keyframe.play', {
          detail: { target: target, properties: properties }
        });
        this.dispatchEvent(e);

        this.nextKeyframe = this.nextKeyframe.nextElementSibling;
        if (!this.nextKeyframe) {
          break;
        }
        var next = new _keyframe2.default(this.nextKeyframe);
        if (next.timing() !== 'with' && next.timing() !== 'after') {
          break;
        } else if (next.timing() === 'after') {
          totalDelay += _keyframe2.default.timeToMillisecond(keyframe.duration());
        }
      }
    }

    //
    // Skips to next page without animation.
    //

  }, {
    key: 'skipNext',
    value: function skipNext() {
      this.skipTo(this.currentIndex + 1);
    }

    //
    // Skips to previous page without animation.
    //

  }, {
    key: 'skipPrev',
    value: function skipPrev() {
      this.skipTo(this.currentIndex - 1);
    }
  }]);

  return Nucleus;
}();

exports.default = Nucleus;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm51Y2xldXMuanMiXSwibmFtZXMiOlsiTnVjbGV1cyIsImV2ZW50VGFyZ2V0IiwiZG9jdW1lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwiZm9yRWFjaCIsIm1ldGhvZCIsImJpbmQiLCJuZXh0S2V5ZnJhbWUiLCJjdXJyZW50SW5kZXgiLCJwYWdlVHJhbnNpdGlvbiIsImV4ZWNOZXh0S2V5ZnJhbWUiLCJjb3VudCIsImZyb20iLCJ0byIsInRyYW5zaXRFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiY2hhbmdlZEV2ZW50IiwiY3VycmVudFBhZ2UiLCJwYWdlQXQiLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImRpc3BhdGNoRXZlbnQiLCJpbmRleCIsInBhZ2VDb3VudCIsIk1hdGgiLCJtYXgiLCJtaW4iLCJza2lwRXZlbnQiLCJ0b3RhbERlbGF5Iiwia2V5ZnJhbWUiLCJkZWxheSIsInRhcmdldCIsImNvbnNvbGUiLCJ3YXJuIiwicHJvcGVydGllcyIsImR1cmF0aW9uIiwiZSIsIm5leHRFbGVtZW50U2libGluZyIsIm5leHQiLCJ0aW1pbmciLCJ0aW1lVG9NaWxsaXNlY29uZCIsInNraXBUbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7OztJQUVxQkEsTzs7QUFFbkI7QUFDQTtBQUNBO0FBQ0EscUJBQWM7QUFBQTs7QUFBQTs7QUFDWixRQUFJQyxjQUFjQyxTQUFTQyxzQkFBVCxFQUFsQjtBQUNBLEtBQUMsa0JBQUQsRUFDQyxlQURELEVBRUMscUJBRkQsRUFHRUMsT0FIRixDQUdVLFVBQUNDLE1BQUQsRUFBWTtBQUNwQixZQUFLQSxNQUFMLElBQWVKLFlBQVlJLE1BQVosRUFBb0JDLElBQXBCLENBQXlCTCxXQUF6QixDQUFmO0FBQ0QsS0FMRCxFQUtHLElBTEg7O0FBT0EsU0FBS00sWUFBTCxHQUFvQixJQUFwQjtBQUNBLFNBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxTQUFLQyxjQUFMLEdBQXNCLElBQXRCO0FBQ0Q7Ozs7bUNBRWM7QUFDYixhQUFPLEtBQUtELFlBQVo7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7Ozs7MkJBQ087QUFDTCxVQUFJLEtBQUtELFlBQVQsRUFBdUI7QUFDckIsYUFBS0csZ0JBQUw7QUFDRCxPQUZELE1BRU8sSUFBSSxLQUFLRixZQUFMLEdBQW9CLENBQXBCLElBQXlCLGVBQUtHLEtBQUwsRUFBN0IsRUFBMkM7QUFDaEQ7QUFDRCxPQUZNLE1BRUE7QUFDTCxZQUFJQyxPQUFPLEtBQUtKLFlBQWhCO0FBQ0EsWUFBSUssS0FBSyxLQUFLTCxZQUFMLEdBQW9CLENBQTdCO0FBQ0EsWUFBSU0sZUFBZSxJQUFJQyxXQUFKLENBQWdCLGNBQWhCLEVBQWdDO0FBQ2pEQyxrQkFBUSxFQUFDSixVQUFELEVBQU9DLE1BQVA7QUFEeUMsU0FBaEMsQ0FBbkI7QUFHQSxZQUFJSSxlQUFlLElBQUlGLFdBQUosQ0FBZ0IsY0FBaEIsRUFBZ0M7QUFDakRDLGtCQUFRLEVBQUNKLFVBQUQsRUFBT0MsTUFBUDtBQUR5QyxTQUFoQyxDQUFuQjtBQUdBLGFBQUtMLFlBQUwsSUFBcUIsQ0FBckI7QUFDQSxZQUFJVSxjQUFjLGVBQUtDLE1BQUwsQ0FBWSxLQUFLWCxZQUFqQixDQUFsQjtBQUNBLGFBQUtELFlBQUwsR0FBb0JXLFlBQVlFLE9BQVosQ0FBb0JDLGFBQXBCLENBQWtDLHNCQUFsQyxDQUFwQjs7QUFFQSxhQUFLQyxhQUFMLENBQW1CUixZQUFuQjtBQUNBLGFBQUtRLGFBQUwsQ0FBbUJMLFlBQW5CO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7Ozs7MkJBQ09NLEssRUFBTztBQUNaLFVBQUlDLFlBQVksZUFBS2IsS0FBTCxFQUFoQjtBQUNBLFVBQUlhLGNBQWMsQ0FBbEIsRUFBcUI7QUFBRTtBQUFTOztBQUVoQ0QsY0FBUUUsS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWUgsS0FBWixDQUFSO0FBQ0FBLGNBQVFFLEtBQUtFLEdBQUwsQ0FBU0gsWUFBWSxDQUFyQixFQUF3QkQsS0FBeEIsQ0FBUjtBQUNBLFVBQUlBLFVBQVUsS0FBS2YsWUFBbkIsRUFBaUM7QUFBRTtBQUFTOztBQUU1QyxVQUFJSSxPQUFPLEtBQUtKLFlBQWhCO0FBQ0EsVUFBSUssS0FBS1UsS0FBVDtBQUNBLFVBQUlLLFlBQVksSUFBSWIsV0FBSixDQUFnQixXQUFoQixFQUE2QjtBQUMzQ0MsZ0JBQVEsRUFBQ0osVUFBRCxFQUFPQyxNQUFQO0FBRG1DLE9BQTdCLENBQWhCO0FBR0EsVUFBSUksZUFBZSxJQUFJRixXQUFKLENBQWdCLGNBQWhCLEVBQWdDO0FBQ2pEQyxnQkFBUSxFQUFDSixVQUFELEVBQU9DLE1BQVA7QUFEeUMsT0FBaEMsQ0FBbkI7QUFHQSxXQUFLTCxZQUFMLEdBQW9CZSxLQUFwQjtBQUNBLFVBQUlMLGNBQWMsZUFBS0MsTUFBTCxDQUFZLEtBQUtYLFlBQWpCLENBQWxCO0FBQ0EsV0FBS0QsWUFBTCxHQUFvQlcsWUFBWUUsT0FBWixDQUFvQkMsYUFBcEIsQ0FBa0Msc0JBQWxDLENBQXBCO0FBQ0EsV0FBS0MsYUFBTCxDQUFtQk0sU0FBbkI7QUFDQSxXQUFLTixhQUFMLENBQW1CTCxZQUFuQjtBQUNEOzs7dUNBRWtCO0FBQ2pCO0FBQ0EsVUFBSVksYUFBYSxDQUFqQjtBQUNBLGFBQU8sSUFBUCxFQUFhO0FBQ1gsWUFBSUMsV0FBVyx1QkFBYSxLQUFLdkIsWUFBbEIsQ0FBZjtBQUNBLFlBQUl3QixRQUFRRixVQUFaO0FBQ0EsWUFBSSxDQUFDQyxTQUFTQyxLQUFULEVBQUwsRUFBdUI7QUFDckJBLGtCQUFRRixVQUFSO0FBQ0Q7QUFDRCxZQUFJRyxTQUFTRixTQUFTRSxNQUFULEVBQWI7QUFDQSxZQUFJQSxXQUFXLElBQWYsRUFBcUI7QUFDbkJDLGtCQUFRQyxJQUFSLENBQWEsd0NBQWI7QUFDRDtBQUNELFlBQUlDLGFBQWFMLFNBQVNLLFVBQVQsRUFBakI7QUFDQSxZQUFJQyxXQUFXTixTQUFTTSxRQUFULEVBQWY7QUFDQUQsbUJBQVcsa0JBQVgsSUFBb0NKLEtBQXBDO0FBQ0FJLG1CQUFXLHFCQUFYLElBQW9DQyxRQUFwQztBQUNBSiwyQ0FBZ0MsS0FBS3hCLFlBQUwsR0FBb0IsQ0FBcEQsV0FBMER3QixNQUExRDtBQUNBLFlBQUlLLElBQUksSUFBSXRCLFdBQUosQ0FBZ0IsZUFBaEIsRUFBaUM7QUFDdkNDLGtCQUFRLEVBQUNnQixjQUFELEVBQVNHLHNCQUFUO0FBRCtCLFNBQWpDLENBQVI7QUFHQSxhQUFLYixhQUFMLENBQW1CZSxDQUFuQjs7QUFFQSxhQUFLOUIsWUFBTCxHQUFvQixLQUFLQSxZQUFMLENBQWtCK0Isa0JBQXRDO0FBQ0EsWUFBSSxDQUFDLEtBQUsvQixZQUFWLEVBQXdCO0FBQ3RCO0FBQ0Q7QUFDRCxZQUFJZ0MsT0FBTyx1QkFBYSxLQUFLaEMsWUFBbEIsQ0FBWDtBQUNBLFlBQUlnQyxLQUFLQyxNQUFMLE9BQWtCLE1BQWxCLElBQTRCRCxLQUFLQyxNQUFMLE9BQWtCLE9BQWxELEVBQTJEO0FBQ3pEO0FBQ0QsU0FGRCxNQUVPLElBQUlELEtBQUtDLE1BQUwsT0FBa0IsT0FBdEIsRUFBK0I7QUFDcENYLHdCQUFjLG1CQUFTWSxpQkFBVCxDQUEyQlgsU0FBU00sUUFBVCxFQUEzQixDQUFkO0FBQ0Q7QUFDRjtBQUNGOztBQUVEO0FBQ0E7QUFDQTs7OzsrQkFDVztBQUNULFdBQUtNLE1BQUwsQ0FBWSxLQUFLbEMsWUFBTCxHQUFvQixDQUFoQztBQUNEOztBQUVEO0FBQ0E7QUFDQTs7OzsrQkFDVztBQUNULFdBQUtrQyxNQUFMLENBQVksS0FBS2xDLFlBQUwsR0FBb0IsQ0FBaEM7QUFDRDs7Ozs7O2tCQTNIa0JSLE8iLCJmaWxlIjoibnVjbGV1cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYWdlIGZyb20gJy4vcGFnZSc7XG5pbXBvcnQgS2V5ZnJhbWUgZnJvbSAnLi9rZXlmcmFtZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE51Y2xldXMge1xuXG4gIC8vXG4gIC8vIEluaXRpYWxpemVzIGludGVybmFsIHZhcmlhYmxlcyBhbmQgSFRNTCBjb250ZW50cy5cbiAgLy9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgbGV0IGV2ZW50VGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIFsnYWRkRXZlbnRMaXN0ZW5lcicsXG4gICAgICdkaXNwYXRjaEV2ZW50JyxcbiAgICAgJ3JlbW92ZUV2ZW50TGlzdGVuZXInXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICAgIHRoaXNbbWV0aG9kXSA9IGV2ZW50VGFyZ2V0W21ldGhvZF0uYmluZChldmVudFRhcmdldCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLm5leHRLZXlmcmFtZSA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50SW5kZXggPSBudWxsO1xuICAgIHRoaXMucGFnZVRyYW5zaXRpb24gPSBudWxsO1xuICB9XG5cbiAgZ2V0UGFnZUluZGV4KCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRJbmRleDtcbiAgfVxuXG4gIC8vXG4gIC8vIEFuaW1hdGUgdGhlIGVsZW1lbnQgb2YgcGFnZSB0byBuZXh0LlxuICAvL1xuICBzdGVwKCkge1xuICAgIGlmICh0aGlzLm5leHRLZXlmcmFtZSkge1xuICAgICAgdGhpcy5leGVjTmV4dEtleWZyYW1lKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRJbmRleCArIDEgPj0gUGFnZS5jb3VudCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBmcm9tID0gdGhpcy5jdXJyZW50SW5kZXg7XG4gICAgICBsZXQgdG8gPSB0aGlzLmN1cnJlbnRJbmRleCArIDE7XG4gICAgICBsZXQgdHJhbnNpdEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdwYWdlLnRyYW5zaXQnLCB7XG4gICAgICAgIGRldGFpbDoge2Zyb20sIHRvfVxuICAgICAgfSk7XG4gICAgICBsZXQgY2hhbmdlZEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdwYWdlLmNoYW5nZWQnLCB7XG4gICAgICAgIGRldGFpbDoge2Zyb20sIHRvfVxuICAgICAgfSk7XG4gICAgICB0aGlzLmN1cnJlbnRJbmRleCArPSAxO1xuICAgICAgbGV0IGN1cnJlbnRQYWdlID0gUGFnZS5wYWdlQXQodGhpcy5jdXJyZW50SW5kZXgpO1xuICAgICAgdGhpcy5uZXh0S2V5ZnJhbWUgPSBjdXJyZW50UGFnZS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2FuaW1hdGlvbiA+IGtleWZyYW1lJyk7XG5cbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCh0cmFuc2l0RXZlbnQpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGNoYW5nZWRFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLy9cbiAgLy8gU2tpcHMgdG8gc3BlY2lmaWVkIHBhZ2Ugd2l0aG91dCBhbmltYXRpb24uXG4gIC8vXG4gIHNraXBUbyhpbmRleCkge1xuICAgIGxldCBwYWdlQ291bnQgPSBQYWdlLmNvdW50KCk7XG4gICAgaWYgKHBhZ2VDb3VudCA9PT0gMCkgeyByZXR1cm47IH1cblxuICAgIGluZGV4ID0gTWF0aC5tYXgoMCwgaW5kZXgpO1xuICAgIGluZGV4ID0gTWF0aC5taW4ocGFnZUNvdW50IC0gMSwgaW5kZXgpO1xuICAgIGlmIChpbmRleCA9PT0gdGhpcy5jdXJyZW50SW5kZXgpIHsgcmV0dXJuOyB9XG5cbiAgICBsZXQgZnJvbSA9IHRoaXMuY3VycmVudEluZGV4O1xuICAgIGxldCB0byA9IGluZGV4O1xuICAgIGxldCBza2lwRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3BhZ2Uuc2tpcCcsIHtcbiAgICAgIGRldGFpbDoge2Zyb20sIHRvfVxuICAgIH0pO1xuICAgIGxldCBjaGFuZ2VkRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3BhZ2UuY2hhbmdlZCcsIHtcbiAgICAgIGRldGFpbDoge2Zyb20sIHRvfVxuICAgIH0pO1xuICAgIHRoaXMuY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgbGV0IGN1cnJlbnRQYWdlID0gUGFnZS5wYWdlQXQodGhpcy5jdXJyZW50SW5kZXgpO1xuICAgIHRoaXMubmV4dEtleWZyYW1lID0gY3VycmVudFBhZ2UuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhbmltYXRpb24gPiBrZXlmcmFtZScpO1xuICAgIHRoaXMuZGlzcGF0Y2hFdmVudChza2lwRXZlbnQpO1xuICAgIHRoaXMuZGlzcGF0Y2hFdmVudChjaGFuZ2VkRXZlbnQpO1xuICB9XG5cbiAgZXhlY05leHRLZXlmcmFtZSgpIHtcbiAgICAvLyBncm91cGluZyBhbmQgY2FsY3VsYXRpbmcgZGVsYXlzXG4gICAgbGV0IHRvdGFsRGVsYXkgPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQga2V5ZnJhbWUgPSBuZXcgS2V5ZnJhbWUodGhpcy5uZXh0S2V5ZnJhbWUpO1xuICAgICAgbGV0IGRlbGF5ID0gdG90YWxEZWxheTtcbiAgICAgIGlmICgha2V5ZnJhbWUuZGVsYXkoKSkge1xuICAgICAgICBkZWxheSA9IHRvdGFsRGVsYXk7XG4gICAgICB9XG4gICAgICBsZXQgdGFyZ2V0ID0ga2V5ZnJhbWUudGFyZ2V0KCk7XG4gICAgICBpZiAodGFyZ2V0ID09PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignVGhlIGFuaW1hdGlvbiB0YXJnZXQgaXMgbm90IHNwZWNpZmllZC4nKTtcbiAgICAgIH1cbiAgICAgIGxldCBwcm9wZXJ0aWVzID0ga2V5ZnJhbWUucHJvcGVydGllcygpO1xuICAgICAgbGV0IGR1cmF0aW9uID0ga2V5ZnJhbWUuZHVyYXRpb24oKTtcbiAgICAgIHByb3BlcnRpZXNbJ3RyYW5zaXRpb24tZGVsYXknXSA9IGAke2RlbGF5fW1zYDtcbiAgICAgIHByb3BlcnRpZXNbJ3RyYW5zaXRpb24tZHVyYXRpb24nXSA9IGR1cmF0aW9uO1xuICAgICAgdGFyZ2V0ID0gYHNlY3Rpb246bnRoLW9mLXR5cGUoJHt0aGlzLmN1cnJlbnRJbmRleCArIDF9KSAke3RhcmdldH1gO1xuICAgICAgbGV0IGUgPSBuZXcgQ3VzdG9tRXZlbnQoJ2tleWZyYW1lLnBsYXknLCB7XG4gICAgICAgIGRldGFpbDoge3RhcmdldCwgcHJvcGVydGllc31cbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGUpO1xuXG4gICAgICB0aGlzLm5leHRLZXlmcmFtZSA9IHRoaXMubmV4dEtleWZyYW1lLm5leHRFbGVtZW50U2libGluZztcbiAgICAgIGlmICghdGhpcy5uZXh0S2V5ZnJhbWUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBsZXQgbmV4dCA9IG5ldyBLZXlmcmFtZSh0aGlzLm5leHRLZXlmcmFtZSk7XG4gICAgICBpZiAobmV4dC50aW1pbmcoKSAhPT0gJ3dpdGgnICYmIG5leHQudGltaW5nKCkgIT09ICdhZnRlcicpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2UgaWYgKG5leHQudGltaW5nKCkgPT09ICdhZnRlcicpIHtcbiAgICAgICAgdG90YWxEZWxheSArPSBLZXlmcmFtZS50aW1lVG9NaWxsaXNlY29uZChrZXlmcmFtZS5kdXJhdGlvbigpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvL1xuICAvLyBTa2lwcyB0byBuZXh0IHBhZ2Ugd2l0aG91dCBhbmltYXRpb24uXG4gIC8vXG4gIHNraXBOZXh0KCkge1xuICAgIHRoaXMuc2tpcFRvKHRoaXMuY3VycmVudEluZGV4ICsgMSk7XG4gIH1cblxuICAvL1xuICAvLyBTa2lwcyB0byBwcmV2aW91cyBwYWdlIHdpdGhvdXQgYW5pbWF0aW9uLlxuICAvL1xuICBza2lwUHJldigpIHtcbiAgICB0aGlzLnNraXBUbyh0aGlzLmN1cnJlbnRJbmRleCAtIDEpO1xuICB9XG59XG4iXX0=
},{"./keyframe":299,"./page":301}],301:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Page class
//
// The Page class provides the page of the slides.  The Page object is created
// from <section> node in HTML.  The css of the page is modified with show(),
// hide(), and neutralStyle() methods.

var Page = function () {
  function Page() {
    _classCallCheck(this, Page);
  }

  _createClass(Page, [{
    key: 'animationEffect',


    //
    // Returns the effect name of the page animation
    //
    value: function animationEffect() {
      return this.element.getAttribute('effect');
    }

    //
    // Returns the duration of the page animation
    //

  }, {
    key: 'animationDuration',
    value: function animationDuration() {
      return this.element.getAttribute('duration');
    }

    //
    // Returns all attributes.
    //

  }, {
    key: 'animationOptions',
    value: function animationOptions() {
      var obj = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Array.prototype.slice.call(this.element.attributes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var attr = _step.value;

          if (attr.nodeName != 'style' && attr.nodeName != 'effect' && attr.nodeName != 'duration') {
            obj[attr.nodeName] = attr.value;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return obj;
    }

    //
    // Returns index of the pages
    //

  }, {
    key: 'indexOf',
    value: function indexOf() {
      var sections = Page.sectionNodes();
      return sections.indexOf(this.element);
    }
  }], [{
    key: 'count',


    //
    // Returns the number of the pages in the document.
    //
    value: function count() {
      return this.sectionNodes().length;
    }

    //
    // Returns a Page object of specified index
    //

  }, {
    key: 'pageAt',
    value: function pageAt(index) {
      var element = this.sectionNodes()[index];
      if (typeof element === 'undefined') {
        throw new RangeError('Out of index in sections');
      }
      var obj = new Page();
      obj.element = element;
      return obj;
    }
  }, {
    key: 'sectionNodes',
    value: function sectionNodes() {
      var children = document.body.children;
      var nodes = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Array.prototype.slice.call(children)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var node = _step2.value;

          if (node.tagName.match(/section/i)) {
            nodes.push(node);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return nodes;
    }
  }]);

  return Page;
}();

exports.default = Page;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2UuanMiXSwibmFtZXMiOlsiUGFnZSIsImVsZW1lbnQiLCJnZXRBdHRyaWJ1dGUiLCJvYmoiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsImF0dHJpYnV0ZXMiLCJhdHRyIiwibm9kZU5hbWUiLCJ2YWx1ZSIsInNlY3Rpb25zIiwic2VjdGlvbk5vZGVzIiwiaW5kZXhPZiIsImxlbmd0aCIsImluZGV4IiwiUmFuZ2VFcnJvciIsImNoaWxkcmVuIiwiZG9jdW1lbnQiLCJib2R5Iiwibm9kZXMiLCJub2RlIiwidGFnTmFtZSIsIm1hdGNoIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0lBRXFCQSxJOzs7Ozs7Ozs7QUFpQ25CO0FBQ0E7QUFDQTtzQ0FDa0I7QUFDaEIsYUFBTyxLQUFLQyxPQUFMLENBQWFDLFlBQWIsQ0FBMEIsUUFBMUIsQ0FBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQTs7Ozt3Q0FDb0I7QUFDbEIsYUFBTyxLQUFLRCxPQUFMLENBQWFDLFlBQWIsQ0FBMEIsVUFBMUIsQ0FBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQTs7Ozt1Q0FDbUI7QUFDakIsVUFBSUMsTUFBTSxFQUFWO0FBRGlCO0FBQUE7QUFBQTs7QUFBQTtBQUVqQiw2QkFBaUJDLE1BQU1DLFNBQU4sQ0FBZ0JDLEtBQWhCLENBQXNCQyxJQUF0QixDQUEyQixLQUFLTixPQUFMLENBQWFPLFVBQXhDLENBQWpCLDhIQUFzRTtBQUFBLGNBQTdEQyxJQUE2RDs7QUFDcEUsY0FBSUEsS0FBS0MsUUFBTCxJQUFpQixPQUFqQixJQUNBRCxLQUFLQyxRQUFMLElBQWlCLFFBRGpCLElBRUFELEtBQUtDLFFBQUwsSUFBaUIsVUFGckIsRUFFaUM7QUFDL0JQLGdCQUFJTSxLQUFLQyxRQUFULElBQXFCRCxLQUFLRSxLQUExQjtBQUNEO0FBQ0Y7QUFSZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFTakIsYUFBT1IsR0FBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQTs7Ozs4QkFDVTtBQUNSLFVBQUlTLFdBQVdaLEtBQUthLFlBQUwsRUFBZjtBQUNBLGFBQU9ELFNBQVNFLE9BQVQsQ0FBaUIsS0FBS2IsT0FBdEIsQ0FBUDtBQUNEOzs7OztBQWxFRDtBQUNBO0FBQ0E7NEJBQ2U7QUFDYixhQUFPLEtBQUtZLFlBQUwsR0FBb0JFLE1BQTNCO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBOzs7OzJCQUNjQyxLLEVBQU87QUFDbkIsVUFBSWYsVUFBVSxLQUFLWSxZQUFMLEdBQW9CRyxLQUFwQixDQUFkO0FBQ0EsVUFBSSxPQUFPZixPQUFQLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ2xDLGNBQU0sSUFBSWdCLFVBQUosQ0FBZSwwQkFBZixDQUFOO0FBQ0Q7QUFDRCxVQUFJZCxNQUFNLElBQUlILElBQUosRUFBVjtBQUNBRyxVQUFJRixPQUFKLEdBQWNBLE9BQWQ7QUFDQSxhQUFPRSxHQUFQO0FBQ0Q7OzttQ0FFcUI7QUFDcEIsVUFBSWUsV0FBV0MsU0FBU0MsSUFBVCxDQUFjRixRQUE3QjtBQUNBLFVBQUlHLFFBQVEsRUFBWjtBQUZvQjtBQUFBO0FBQUE7O0FBQUE7QUFHcEIsOEJBQWlCakIsTUFBTUMsU0FBTixDQUFnQkMsS0FBaEIsQ0FBc0JDLElBQXRCLENBQTJCVyxRQUEzQixDQUFqQixtSUFBdUQ7QUFBQSxjQUE5Q0ksSUFBOEM7O0FBQ3JELGNBQUlBLEtBQUtDLE9BQUwsQ0FBYUMsS0FBYixDQUFtQixVQUFuQixDQUFKLEVBQW9DO0FBQ2xDSCxrQkFBTUksSUFBTixDQUFXSCxJQUFYO0FBQ0Q7QUFDRjtBQVBtQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVFwQixhQUFPRCxLQUFQO0FBQ0Q7Ozs7OztrQkEvQmtCckIsSSIsImZpbGUiOiJwYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gUGFnZSBjbGFzc1xuLy9cbi8vIFRoZSBQYWdlIGNsYXNzIHByb3ZpZGVzIHRoZSBwYWdlIG9mIHRoZSBzbGlkZXMuICBUaGUgUGFnZSBvYmplY3QgaXMgY3JlYXRlZFxuLy8gZnJvbSA8c2VjdGlvbj4gbm9kZSBpbiBIVE1MLiAgVGhlIGNzcyBvZiB0aGUgcGFnZSBpcyBtb2RpZmllZCB3aXRoIHNob3coKSxcbi8vIGhpZGUoKSwgYW5kIG5ldXRyYWxTdHlsZSgpIG1ldGhvZHMuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhZ2Uge1xuXG4gIC8vXG4gIC8vIFJldHVybnMgdGhlIG51bWJlciBvZiB0aGUgcGFnZXMgaW4gdGhlIGRvY3VtZW50LlxuICAvL1xuICBzdGF0aWMgY291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VjdGlvbk5vZGVzKCkubGVuZ3RoO1xuICB9XG5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIFBhZ2Ugb2JqZWN0IG9mIHNwZWNpZmllZCBpbmRleFxuICAvL1xuICBzdGF0aWMgcGFnZUF0KGluZGV4KSB7XG4gICAgbGV0IGVsZW1lbnQgPSB0aGlzLnNlY3Rpb25Ob2RlcygpW2luZGV4XTtcbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignT3V0IG9mIGluZGV4IGluIHNlY3Rpb25zJyk7XG4gICAgfVxuICAgIGxldCBvYmogPSBuZXcgUGFnZSgpO1xuICAgIG9iai5lbGVtZW50ID0gZWxlbWVudDtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgc3RhdGljIHNlY3Rpb25Ob2RlcygpIHtcbiAgICBsZXQgY2hpbGRyZW4gPSBkb2N1bWVudC5ib2R5LmNoaWxkcmVuO1xuICAgIGxldCBub2RlcyA9IFtdO1xuICAgIGZvciAobGV0IG5vZGUgb2YgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoY2hpbGRyZW4pKSB7XG4gICAgICBpZiAobm9kZS50YWdOYW1lLm1hdGNoKC9zZWN0aW9uL2kpKSB7XG4gICAgICAgIG5vZGVzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub2RlcztcbiAgfVxuXG4gIC8vXG4gIC8vIFJldHVybnMgdGhlIGVmZmVjdCBuYW1lIG9mIHRoZSBwYWdlIGFuaW1hdGlvblxuICAvL1xuICBhbmltYXRpb25FZmZlY3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2VmZmVjdCcpO1xuICB9XG5cbiAgLy9cbiAgLy8gUmV0dXJucyB0aGUgZHVyYXRpb24gb2YgdGhlIHBhZ2UgYW5pbWF0aW9uXG4gIC8vXG4gIGFuaW1hdGlvbkR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkdXJhdGlvbicpO1xuICB9XG5cbiAgLy9cbiAgLy8gUmV0dXJucyBhbGwgYXR0cmlidXRlcy5cbiAgLy9cbiAgYW5pbWF0aW9uT3B0aW9ucygpIHtcbiAgICBsZXQgb2JqID0ge307XG4gICAgZm9yIChsZXQgYXR0ciBvZiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmVsZW1lbnQuYXR0cmlidXRlcykpIHtcbiAgICAgIGlmIChhdHRyLm5vZGVOYW1lICE9ICdzdHlsZScgJiZcbiAgICAgICAgICBhdHRyLm5vZGVOYW1lICE9ICdlZmZlY3QnICYmXG4gICAgICAgICAgYXR0ci5ub2RlTmFtZSAhPSAnZHVyYXRpb24nKSB7XG4gICAgICAgIG9ialthdHRyLm5vZGVOYW1lXSA9IGF0dHIudmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICAvL1xuICAvLyBSZXR1cm5zIGluZGV4IG9mIHRoZSBwYWdlc1xuICAvL1xuICBpbmRleE9mKCkge1xuICAgIGxldCBzZWN0aW9ucyA9IFBhZ2Uuc2VjdGlvbk5vZGVzKCk7XG4gICAgcmV0dXJuIHNlY3Rpb25zLmluZGV4T2YodGhpcy5lbGVtZW50KTtcbiAgfVxufVxuIl19
},{}],302:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPageEffect = registerPageEffect;
exports.loadPageEffect = loadPageEffect;
var pageEffects = {};

function registerPageEffect(name, animation) {
  pageEffects[name.toLowerCase()] = animation;
}

function loadPageEffect(name) {
  name = name.toLowerCase();
  if (!pageEffects.hasOwnProperty(name)) return null;
  return pageEffects[name];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VfZWZmZWN0LmpzIl0sIm5hbWVzIjpbInJlZ2lzdGVyUGFnZUVmZmVjdCIsImxvYWRQYWdlRWZmZWN0IiwicGFnZUVmZmVjdHMiLCJuYW1lIiwiYW5pbWF0aW9uIiwidG9Mb3dlckNhc2UiLCJoYXNPd25Qcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFFZ0JBLGtCLEdBQUFBLGtCO1FBSUFDLGMsR0FBQUEsYztBQU5oQixJQUFJQyxjQUFjLEVBQWxCOztBQUVPLFNBQVNGLGtCQUFULENBQTRCRyxJQUE1QixFQUFrQ0MsU0FBbEMsRUFBNkM7QUFDbERGLGNBQVlDLEtBQUtFLFdBQUwsRUFBWixJQUFrQ0QsU0FBbEM7QUFDRDs7QUFFTSxTQUFTSCxjQUFULENBQXdCRSxJQUF4QixFQUE4QjtBQUNuQ0EsU0FBT0EsS0FBS0UsV0FBTCxFQUFQO0FBQ0EsTUFBSSxDQUFDSCxZQUFZSSxjQUFaLENBQTJCSCxJQUEzQixDQUFMLEVBQXVDLE9BQU8sSUFBUDtBQUN2QyxTQUFPRCxZQUFZQyxJQUFaLENBQVA7QUFDRCIsImZpbGUiOiJwYWdlX2VmZmVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBwYWdlRWZmZWN0cyA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJQYWdlRWZmZWN0KG5hbWUsIGFuaW1hdGlvbikge1xuICBwYWdlRWZmZWN0c1tuYW1lLnRvTG93ZXJDYXNlKCldID0gYW5pbWF0aW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZFBhZ2VFZmZlY3QobmFtZSkge1xuICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIXBhZ2VFZmZlY3RzLmhhc093blByb3BlcnR5KG5hbWUpKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHBhZ2VFZmZlY3RzW25hbWVdO1xufVxuIl19
},{}],303:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _css = require('./css');

var _css2 = _interopRequireDefault(_css);

var _page = require('./page');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PageTransition = function () {
  function PageTransition(prevIndex, nextIndex, cssId) {
    _classCallCheck(this, PageTransition);

    this.prevIndex = prevIndex;
    this.nextIndex = nextIndex;
    this.pageAnimeCss = _css2.default.findOrCreate(cssId);
  }

  _createClass(PageTransition, [{
    key: 'finalize',
    value: function finalize() {
      this.pageAnimeCss.finalize();
    }
  }, {
    key: 'switchPage',
    value: function switchPage(animationEnable) {
      if (animationEnable) {
        this.animatePage();
      } else {
        this.noAnimatePage();
      }
    }
  }, {
    key: 'noAnimatePage',
    value: function noAnimatePage() {
      this.execAnime();
    }
  }, {
    key: 'animatePage',
    value: function animatePage() {
      var nextPage = _page2.default.pageAt(this.nextIndex);
      var effectName = nextPage.animationEffect();
      var duration = nextPage.animationDuration();
      var options = nextPage.animationOptions();

      var effect = null;
      if (effectName !== null) {
        effect = Libretto.loadPageEffect(effectName);
        if (effect === null) {
          console.warn('No such page effect : ' + effectName);
        }
      }

      if (effect === null) {
        this.execAnime();
      } else {
        this.execAnime(effect, duration, options);
      }
    }
  }, {
    key: 'execAnime',
    value: function execAnime(effect, duration, options) {
      this.pageAnimeCss.clearRules();
      var prevStyle = null;
      if (this.prevIndex !== null) {
        prevStyle = this.pageAnimeCss.addRule('section:nth-of-type(' + (this.prevIndex + 1) + ')');
        prevStyle.visibility = 'visible';
        prevStyle.zIndex = 0;
      }
      var nextStyle = this.pageAnimeCss.addRule('section:nth-of-type(' + (this.nextIndex + 1) + ')');
      nextStyle.visibility = 'visible';
      nextStyle.zIndex = 1;

      if (typeof effect === 'undefined') {
        return;
      }
      if (effect.hasOwnProperty('before')) {
        effect.before(prevStyle, nextStyle, duration, options);
      }
      setTimeout(function () {
        effect.exec(prevStyle, nextStyle, duration, options);
      }, 50); // 50ms is hack to run on Firefox
    }
  }]);

  return PageTransition;
}();

exports.default = PageTransition;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VfdHJhbnNpdGlvbi5qcyJdLCJuYW1lcyI6WyJQYWdlVHJhbnNpdGlvbiIsInByZXZJbmRleCIsIm5leHRJbmRleCIsImNzc0lkIiwicGFnZUFuaW1lQ3NzIiwiZmluZE9yQ3JlYXRlIiwiZmluYWxpemUiLCJhbmltYXRpb25FbmFibGUiLCJhbmltYXRlUGFnZSIsIm5vQW5pbWF0ZVBhZ2UiLCJleGVjQW5pbWUiLCJuZXh0UGFnZSIsInBhZ2VBdCIsImVmZmVjdE5hbWUiLCJhbmltYXRpb25FZmZlY3QiLCJkdXJhdGlvbiIsImFuaW1hdGlvbkR1cmF0aW9uIiwib3B0aW9ucyIsImFuaW1hdGlvbk9wdGlvbnMiLCJlZmZlY3QiLCJMaWJyZXR0byIsImxvYWRQYWdlRWZmZWN0IiwiY29uc29sZSIsIndhcm4iLCJjbGVhclJ1bGVzIiwicHJldlN0eWxlIiwiYWRkUnVsZSIsInZpc2liaWxpdHkiLCJ6SW5kZXgiLCJuZXh0U3R5bGUiLCJoYXNPd25Qcm9wZXJ0eSIsImJlZm9yZSIsInNldFRpbWVvdXQiLCJleGVjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7O0lBRXFCQSxjO0FBQ25CLDBCQUFZQyxTQUFaLEVBQXVCQyxTQUF2QixFQUFrQ0MsS0FBbEMsRUFBeUM7QUFBQTs7QUFDdkMsU0FBS0YsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLFNBQUtFLFlBQUwsR0FBb0IsY0FBSUMsWUFBSixDQUFpQkYsS0FBakIsQ0FBcEI7QUFDRDs7OzsrQkFFVTtBQUNULFdBQUtDLFlBQUwsQ0FBa0JFLFFBQWxCO0FBQ0Q7OzsrQkFFVUMsZSxFQUFpQjtBQUMxQixVQUFJQSxlQUFKLEVBQXFCO0FBQ25CLGFBQUtDLFdBQUw7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLQyxhQUFMO0FBQ0Q7QUFDRjs7O29DQUVlO0FBQ2QsV0FBS0MsU0FBTDtBQUNEOzs7a0NBRWE7QUFDWixVQUFJQyxXQUFXLGVBQUtDLE1BQUwsQ0FBWSxLQUFLVixTQUFqQixDQUFmO0FBQ0EsVUFBSVcsYUFBYUYsU0FBU0csZUFBVCxFQUFqQjtBQUNBLFVBQUlDLFdBQVdKLFNBQVNLLGlCQUFULEVBQWY7QUFDQSxVQUFJQyxVQUFVTixTQUFTTyxnQkFBVCxFQUFkOztBQUVBLFVBQUlDLFNBQVMsSUFBYjtBQUNBLFVBQUlOLGVBQWUsSUFBbkIsRUFBeUI7QUFDdkJNLGlCQUFTQyxTQUFTQyxjQUFULENBQXdCUixVQUF4QixDQUFUO0FBQ0EsWUFBSU0sV0FBVyxJQUFmLEVBQXFCO0FBQ25CRyxrQkFBUUMsSUFBUiw0QkFBc0NWLFVBQXRDO0FBQ0Q7QUFDRjs7QUFFRCxVQUFJTSxXQUFXLElBQWYsRUFBcUI7QUFDbkIsYUFBS1QsU0FBTDtBQUNELE9BRkQsTUFFTztBQUNMLGFBQUtBLFNBQUwsQ0FBZVMsTUFBZixFQUF1QkosUUFBdkIsRUFBaUNFLE9BQWpDO0FBQ0Q7QUFDRjs7OzhCQUVTRSxNLEVBQVFKLFEsRUFBVUUsTyxFQUFTO0FBQ25DLFdBQUtiLFlBQUwsQ0FBa0JvQixVQUFsQjtBQUNBLFVBQUlDLFlBQVksSUFBaEI7QUFDQSxVQUFJLEtBQUt4QixTQUFMLEtBQW1CLElBQXZCLEVBQTZCO0FBQzNCd0Isb0JBQVksS0FBS3JCLFlBQUwsQ0FBa0JzQixPQUFsQiwyQkFBaUQsS0FBS3pCLFNBQUwsR0FBaUIsQ0FBbEUsUUFBWjtBQUNBd0Isa0JBQVVFLFVBQVYsR0FBdUIsU0FBdkI7QUFDQUYsa0JBQVVHLE1BQVYsR0FBbUIsQ0FBbkI7QUFDRDtBQUNELFVBQUlDLFlBQVksS0FBS3pCLFlBQUwsQ0FBa0JzQixPQUFsQiwyQkFBaUQsS0FBS3hCLFNBQUwsR0FBaUIsQ0FBbEUsUUFBaEI7QUFDQTJCLGdCQUFVRixVQUFWLEdBQXVCLFNBQXZCO0FBQ0FFLGdCQUFVRCxNQUFWLEdBQW1CLENBQW5COztBQUVBLFVBQUksT0FBT1QsTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUFFO0FBQVM7QUFDOUMsVUFBSUEsT0FBT1csY0FBUCxDQUFzQixRQUF0QixDQUFKLEVBQXFDO0FBQ25DWCxlQUFPWSxNQUFQLENBQWNOLFNBQWQsRUFBeUJJLFNBQXpCLEVBQW9DZCxRQUFwQyxFQUE4Q0UsT0FBOUM7QUFDRDtBQUNEZSxpQkFBVyxZQUFNO0FBQUViLGVBQU9jLElBQVAsQ0FBWVIsU0FBWixFQUF1QkksU0FBdkIsRUFBa0NkLFFBQWxDLEVBQTRDRSxPQUE1QztBQUF1RCxPQUExRSxFQUNVLEVBRFYsRUFoQm1DLENBaUJuQjtBQUNqQjs7Ozs7O2tCQTlEa0JqQixjIiwiZmlsZSI6InBhZ2VfdHJhbnNpdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDc3MgZnJvbSAnLi9jc3MnO1xuaW1wb3J0IFBhZ2UgZnJvbSAnLi9wYWdlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnZVRyYW5zaXRpb24ge1xuICBjb25zdHJ1Y3RvcihwcmV2SW5kZXgsIG5leHRJbmRleCwgY3NzSWQpIHtcbiAgICB0aGlzLnByZXZJbmRleCA9IHByZXZJbmRleDtcbiAgICB0aGlzLm5leHRJbmRleCA9IG5leHRJbmRleDtcbiAgICB0aGlzLnBhZ2VBbmltZUNzcyA9IENzcy5maW5kT3JDcmVhdGUoY3NzSWQpO1xuICB9XG5cbiAgZmluYWxpemUoKSB7XG4gICAgdGhpcy5wYWdlQW5pbWVDc3MuZmluYWxpemUoKTtcbiAgfVxuXG4gIHN3aXRjaFBhZ2UoYW5pbWF0aW9uRW5hYmxlKSB7XG4gICAgaWYgKGFuaW1hdGlvbkVuYWJsZSkge1xuICAgICAgdGhpcy5hbmltYXRlUGFnZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5vQW5pbWF0ZVBhZ2UoKTtcbiAgICB9XG4gIH1cblxuICBub0FuaW1hdGVQYWdlKCkge1xuICAgIHRoaXMuZXhlY0FuaW1lKCk7XG4gIH1cblxuICBhbmltYXRlUGFnZSgpIHtcbiAgICBsZXQgbmV4dFBhZ2UgPSBQYWdlLnBhZ2VBdCh0aGlzLm5leHRJbmRleCk7XG4gICAgbGV0IGVmZmVjdE5hbWUgPSBuZXh0UGFnZS5hbmltYXRpb25FZmZlY3QoKTtcbiAgICBsZXQgZHVyYXRpb24gPSBuZXh0UGFnZS5hbmltYXRpb25EdXJhdGlvbigpO1xuICAgIGxldCBvcHRpb25zID0gbmV4dFBhZ2UuYW5pbWF0aW9uT3B0aW9ucygpO1xuXG4gICAgbGV0IGVmZmVjdCA9IG51bGw7XG4gICAgaWYgKGVmZmVjdE5hbWUgIT09IG51bGwpIHtcbiAgICAgIGVmZmVjdCA9IExpYnJldHRvLmxvYWRQYWdlRWZmZWN0KGVmZmVjdE5hbWUpO1xuICAgICAgaWYgKGVmZmVjdCA9PT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLndhcm4oYE5vIHN1Y2ggcGFnZSBlZmZlY3QgOiAke2VmZmVjdE5hbWV9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGVmZmVjdCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5leGVjQW5pbWUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5leGVjQW5pbWUoZWZmZWN0LCBkdXJhdGlvbiwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgZXhlY0FuaW1lKGVmZmVjdCwgZHVyYXRpb24sIG9wdGlvbnMpIHtcbiAgICB0aGlzLnBhZ2VBbmltZUNzcy5jbGVhclJ1bGVzKCk7XG4gICAgbGV0IHByZXZTdHlsZSA9IG51bGw7XG4gICAgaWYgKHRoaXMucHJldkluZGV4ICE9PSBudWxsKSB7XG4gICAgICBwcmV2U3R5bGUgPSB0aGlzLnBhZ2VBbmltZUNzcy5hZGRSdWxlKGBzZWN0aW9uOm50aC1vZi10eXBlKCR7dGhpcy5wcmV2SW5kZXggKyAxfSlgKTtcbiAgICAgIHByZXZTdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgcHJldlN0eWxlLnpJbmRleCA9IDA7XG4gICAgfVxuICAgIGxldCBuZXh0U3R5bGUgPSB0aGlzLnBhZ2VBbmltZUNzcy5hZGRSdWxlKGBzZWN0aW9uOm50aC1vZi10eXBlKCR7dGhpcy5uZXh0SW5kZXggKyAxfSlgKTtcbiAgICBuZXh0U3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICBuZXh0U3R5bGUuekluZGV4ID0gMTtcblxuICAgIGlmICh0eXBlb2YgZWZmZWN0ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cbiAgICBpZiAoZWZmZWN0Lmhhc093blByb3BlcnR5KCdiZWZvcmUnKSkge1xuICAgICAgZWZmZWN0LmJlZm9yZShwcmV2U3R5bGUsIG5leHRTdHlsZSwgZHVyYXRpb24sIG9wdGlvbnMpO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgZWZmZWN0LmV4ZWMocHJldlN0eWxlLCBuZXh0U3R5bGUsIGR1cmF0aW9uLCBvcHRpb25zKTsgfSxcbiAgICAgICAgICAgICAgNTApOyAgLy8gNTBtcyBpcyBoYWNrIHRvIHJ1biBvbiBGaXJlZm94XG4gIH1cbn1cbiJdfQ==
},{"./css":297,"./page":301}],304:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Plugin = function () {
  function Plugin() {
    _classCallCheck(this, Plugin);

    var that = this;
    window.addEventListener('load', function () {
      that.initialize();
    });
  }

  _createClass(Plugin, [{
    key: 'initialize',
    value: function initialize() {}
  }]);

  return Plugin;
}();

exports.default = Plugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBsdWdpbi5qcyJdLCJuYW1lcyI6WyJQbHVnaW4iLCJ0aGF0Iiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImluaXRpYWxpemUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBcUJBLE07QUFDbkIsb0JBQWM7QUFBQTs7QUFDWixRQUFJQyxPQUFPLElBQVg7QUFDQUMsV0FBT0MsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsWUFBTTtBQUNwQ0YsV0FBS0csVUFBTDtBQUNELEtBRkQ7QUFHRDs7OztpQ0FFWSxDQUNaOzs7Ozs7a0JBVGtCSixNIiwiZmlsZSI6InBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgIHRoYXQuaW5pdGlhbGl6ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgfVxufVxuIl19
},{}],305:[function(require,module,exports){
'use strict';

// Dissolve page effect
// Optional arguments
// - direction ..... Direction of movement
//     right  ... Left to Right
//     left   ... Right to Left
//     up ... Top to Bottom
//     down ... Bottom to Top
Libretto.registerPageEffect('dissolve', {
  before: function before(prevStyle, nextStyle, duration, _options) {
    nextStyle.opacity = '0';
  },
  exec: function exec(prevStyle, nextStyle, duration, _options) {
    nextStyle.transitionDuration = duration;
    nextStyle.opacity = '1';
  }
});

// MoveIn page Effect
// Optional arguments
// - direction ..... Direction of movement
//     right  ... Left to Right
//     left   ... Right to Left
//     up ... Top to Bottom
//     down ... Bottom to Top
Libretto.registerPageEffect('move-in', {
  before: function before(prevStyle, nextStyle, duration, options) {
    var origin = {
      left: ['100%', '0%'],
      right: ['-100%', '0%'],
      up: ['0%', '100%'],
      down: ['0%', '-100%']
    }[options.direction];
    if (origin === null) {
      if (options.direction !== null) {
        console.warn('Invalid value of direction:', options.direction);
      }
      origin = ['100%', '0%'];
    }
    nextStyle.left = origin[0];
    nextStyle.top = origin[1];
  },
  exec: function exec(prevStyle, nextStyle, duration, options) {
    if (duration === null) {
      nextStyle.transitionDuration = '1s';
    } else {
      nextStyle.transitionDuration = duration;
    }
    nextStyle.left = '0%';
    nextStyle.top = '0%';
  }
});

// Pushing page effect
// Optional arguments
// - direction ..... Direction of movement
//     right   ... Left to Right
//     left    ... Right to Left
//     up      ... Top to Bottom
//     down    ... Bottom to Top
Libretto.registerPageEffect('push', {
  before: function before(prevStyle, nextStyle, duration, options) {
    var posPrefix = {
      left: ['0%', '0%', '100%', '0%', '-100%', '0%', '0%', '0%'],
      right: ['0%', '0%', '-100%', '0%', '100%', '0%', '0%', '0%'],
      up: ['0%', '0%', '0%', '100%', '0%', '-100%', '0%', '0%'],
      down: ['0%', '0%', '0%', '-100%', '0%', '100%', '0%', '0%']
    };
    this.pos = posPrefix[options.direction];
    if (typeof this.pos === 'undefined') {
      if (typeof options.direction !== 'undefined') {
        console.warn('Invalid value of direction: ', options.direction);
      }
      this.pos = posPrefix['left'];
    }
    prevStyle.left = this.pos[0];
    prevStyle.top = this.pos[1];
    nextStyle.left = this.pos[2];
    nextStyle.top = this.pos[3];
  },
  exec: function exec(prevStyle, nextStyle, duration, options) {
    if (duration === null) {
      duration = '1s';
    }
    prevStyle.transitionDuration = duration;
    prevStyle.left = this.pos[4];
    prevStyle.top = this.pos[5];
    nextStyle.transitionDuration = duration;
    nextStyle.left = this.pos[6];
    nextStyle.top = this.pos[7];
  }
});

// Slide-in Page Effect
// Optional arguments
// - direction ..... Direction of zooming
//     up
//     down
//     in
//     out
Libretto.registerPageEffect('scale', {
  before: function before(prevStyle, nextStyle, duration, options) {
    var direction = options.direction;
    this.targetNext = true; // A target of the animation is next slide when true
    this.zoomin = true; // Zooming is zoom-in when true
    switch (direction) {
      case 'up':
        this.targetNext = true;
        this.zoomin = true;
        break;
      case 'in':
        this.targetNext = true;
        this.zoomin = false;
        break;
      case 'out':
        this.targetNext = false;
        this.zoomin = true;
        break;
      case 'down':
        this.targetNext = false;
        this.zoomin = false;
        break;
      default:
        if (direction !== null) {
          console.warn('Invalid value of direction: ', direction);
        }
    }
    if (this.targetNext) {
      prevStyle.zIndex = '0';
      nextStyle.zIndex = '1';
      nextStyle.opacity = '0';
      if (this.zoomin) {
        nextStyle.transform = 'scale(0.2,0.2)';
        nextStyle.mozTransform = 'scale(0.2,0.2)';
        nextStyle.webkitTransform = 'scale(0.2,0.2)';
      } else {
        nextStyle.transform = 'scale(3.0,3.0)';
        nextStyle.mozTransform = 'scale(3.0,3.0)';
        nextStyle.webkitTransform = 'scale(3.0,3.0)';
      }
    } else {
      // if next slide will animate
      prevStyle.zIndex = '1';
      nextStyle.zIndex = '0';
      prevStyle.opacity = '1';
      nextStyle.transform = 'scale(1,1)';
      nextStyle.mozTransform = 'scale(1,1)';
      nextStyle.webkitTransform = 'scale(1,1)';
    }
  },
  exec: function exec(prevStyle, nextStyle, duration, options) {
    if (duration === null) {
      duration = '1s';
    }
    if (this.targetNext) {
      nextStyle.transitionDuration = duration;
      nextStyle.opacity = '1';
      nextStyle.transform = 'scale(1.0,1.0)';
      nextStyle.mozTransform = 'scale(1.0,1.0)';
      nextStyle.webkitTransform = 'scale(1.0,1.0)';
    } else {
      prevStyle.transitionDuration = duration;
      prevStyle.opacity = '0';
      if (this.zoomin) {
        prevStyle.transform = 'scale(3,3)';
        prevStyle.mozTransform = 'scale(3,3)';
        prevStyle.webkitTransform = 'scale(3,3)';
      } else {
        prevStyle.transform = 'scale(0.2,0.2)';
        prevStyle.mozTransform = 'scale(0.2,0.2)';
        prevStyle.webkitTransform = 'scale(0.2,0.2)';
      }
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjJkLWFuaW1hdGlvbnMuanMiXSwibmFtZXMiOlsiTGlicmV0dG8iLCJyZWdpc3RlclBhZ2VFZmZlY3QiLCJiZWZvcmUiLCJwcmV2U3R5bGUiLCJuZXh0U3R5bGUiLCJkdXJhdGlvbiIsIl9vcHRpb25zIiwib3BhY2l0eSIsImV4ZWMiLCJ0cmFuc2l0aW9uRHVyYXRpb24iLCJvcHRpb25zIiwib3JpZ2luIiwibGVmdCIsInJpZ2h0IiwidXAiLCJkb3duIiwiZGlyZWN0aW9uIiwiY29uc29sZSIsIndhcm4iLCJ0b3AiLCJwb3NQcmVmaXgiLCJwb3MiLCJ0YXJnZXROZXh0Iiwiem9vbWluIiwiekluZGV4IiwidHJhbnNmb3JtIiwibW96VHJhbnNmb3JtIiwid2Via2l0VHJhbnNmb3JtIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FBLFNBQVNDLGtCQUFULENBQTRCLFVBQTVCLEVBQXdDO0FBQ3RDQyxRQURzQyxrQkFDL0JDLFNBRCtCLEVBQ3BCQyxTQURvQixFQUNUQyxRQURTLEVBQ0NDLFFBREQsRUFDVztBQUMvQ0YsY0FBVUcsT0FBVixHQUFvQixHQUFwQjtBQUNELEdBSHFDO0FBSXRDQyxNQUpzQyxnQkFJakNMLFNBSmlDLEVBSXRCQyxTQUpzQixFQUlYQyxRQUpXLEVBSURDLFFBSkMsRUFJUztBQUM3Q0YsY0FBVUssa0JBQVYsR0FBK0JKLFFBQS9CO0FBQ0FELGNBQVVHLE9BQVYsR0FBb0IsR0FBcEI7QUFDRDtBQVBxQyxDQUF4Qzs7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBUCxTQUFTQyxrQkFBVCxDQUE0QixTQUE1QixFQUF1QztBQUNyQ0MsUUFEcUMsa0JBQzlCQyxTQUQ4QixFQUNuQkMsU0FEbUIsRUFDUkMsUUFEUSxFQUNFSyxPQURGLEVBQ1c7QUFDOUMsUUFBSUMsU0FBUztBQUNYQyxZQUFNLENBQUMsTUFBRCxFQUFTLElBQVQsQ0FESztBQUVYQyxhQUFPLENBQUMsT0FBRCxFQUFVLElBQVYsQ0FGSTtBQUdYQyxVQUFJLENBQUMsSUFBRCxFQUFPLE1BQVAsQ0FITztBQUlYQyxZQUFNLENBQUMsSUFBRCxFQUFPLE9BQVA7QUFKSyxNQUtYTCxRQUFRTSxTQUxHLENBQWI7QUFNQSxRQUFJTCxXQUFXLElBQWYsRUFBcUI7QUFDbkIsVUFBSUQsUUFBUU0sU0FBUixLQUFzQixJQUExQixFQUFnQztBQUM5QkMsZ0JBQVFDLElBQVIsQ0FBYSw2QkFBYixFQUE0Q1IsUUFBUU0sU0FBcEQ7QUFDRDtBQUNETCxlQUFTLENBQUMsTUFBRCxFQUFTLElBQVQsQ0FBVDtBQUNEO0FBQ0RQLGNBQVVRLElBQVYsR0FBaUJELE9BQU8sQ0FBUCxDQUFqQjtBQUNBUCxjQUFVZSxHQUFWLEdBQWdCUixPQUFPLENBQVAsQ0FBaEI7QUFDRCxHQWhCb0M7QUFpQnJDSCxNQWpCcUMsZ0JBaUJoQ0wsU0FqQmdDLEVBaUJyQkMsU0FqQnFCLEVBaUJWQyxRQWpCVSxFQWlCQUssT0FqQkEsRUFpQlM7QUFDNUMsUUFBSUwsYUFBYSxJQUFqQixFQUF1QjtBQUNyQkQsZ0JBQVVLLGtCQUFWLEdBQStCLElBQS9CO0FBQ0QsS0FGRCxNQUVPO0FBQ0xMLGdCQUFVSyxrQkFBVixHQUErQkosUUFBL0I7QUFDRDtBQUNERCxjQUFVUSxJQUFWLEdBQWlCLElBQWpCO0FBQ0FSLGNBQVVlLEdBQVYsR0FBZ0IsSUFBaEI7QUFDRDtBQXpCb0MsQ0FBdkM7O0FBNEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FuQixTQUFTQyxrQkFBVCxDQUE0QixNQUE1QixFQUFvQztBQUNsQ0MsUUFEa0Msa0JBQzNCQyxTQUQyQixFQUNoQkMsU0FEZ0IsRUFDTEMsUUFESyxFQUNLSyxPQURMLEVBQ2M7QUFDOUMsUUFBSVUsWUFBWTtBQUNkUixZQUFNLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxNQUFiLEVBQXFCLElBQXJCLEVBQTJCLE9BQTNCLEVBQW9DLElBQXBDLEVBQTBDLElBQTFDLEVBQWdELElBQWhELENBRFE7QUFFZEMsYUFBTyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsT0FBYixFQUFzQixJQUF0QixFQUE0QixNQUE1QixFQUFvQyxJQUFwQyxFQUEwQyxJQUExQyxFQUFnRCxJQUFoRCxDQUZPO0FBR2RDLFVBQUksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsTUFBbkIsRUFBMkIsSUFBM0IsRUFBaUMsT0FBakMsRUFBMEMsSUFBMUMsRUFBZ0QsSUFBaEQsQ0FIVTtBQUlkQyxZQUFNLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLE9BQW5CLEVBQTRCLElBQTVCLEVBQWtDLE1BQWxDLEVBQTBDLElBQTFDLEVBQWdELElBQWhEO0FBSlEsS0FBaEI7QUFNQSxTQUFLTSxHQUFMLEdBQVdELFVBQVVWLFFBQVFNLFNBQWxCLENBQVg7QUFDQSxRQUFJLE9BQU8sS0FBS0ssR0FBWixLQUFvQixXQUF4QixFQUFxQztBQUNuQyxVQUFJLE9BQU9YLFFBQVFNLFNBQWYsS0FBNkIsV0FBakMsRUFBOEM7QUFDNUNDLGdCQUFRQyxJQUFSLENBQWEsOEJBQWIsRUFBNkNSLFFBQVFNLFNBQXJEO0FBQ0Q7QUFDRCxXQUFLSyxHQUFMLEdBQVdELFVBQVUsTUFBVixDQUFYO0FBQ0Q7QUFDRGpCLGNBQVVTLElBQVYsR0FBaUIsS0FBS1MsR0FBTCxDQUFTLENBQVQsQ0FBakI7QUFDQWxCLGNBQVVnQixHQUFWLEdBQWdCLEtBQUtFLEdBQUwsQ0FBUyxDQUFULENBQWhCO0FBQ0FqQixjQUFVUSxJQUFWLEdBQWlCLEtBQUtTLEdBQUwsQ0FBUyxDQUFULENBQWpCO0FBQ0FqQixjQUFVZSxHQUFWLEdBQWdCLEtBQUtFLEdBQUwsQ0FBUyxDQUFULENBQWhCO0FBQ0QsR0FuQmlDO0FBb0JsQ2IsTUFwQmtDLGdCQW9CN0JMLFNBcEI2QixFQW9CbEJDLFNBcEJrQixFQW9CUEMsUUFwQk8sRUFvQkdLLE9BcEJILEVBb0JZO0FBQzVDLFFBQUlMLGFBQWEsSUFBakIsRUFBdUI7QUFDckJBLGlCQUFXLElBQVg7QUFDRDtBQUNERixjQUFVTSxrQkFBVixHQUErQkosUUFBL0I7QUFDQUYsY0FBVVMsSUFBVixHQUFpQixLQUFLUyxHQUFMLENBQVMsQ0FBVCxDQUFqQjtBQUNBbEIsY0FBVWdCLEdBQVYsR0FBZ0IsS0FBS0UsR0FBTCxDQUFTLENBQVQsQ0FBaEI7QUFDQWpCLGNBQVVLLGtCQUFWLEdBQStCSixRQUEvQjtBQUNBRCxjQUFVUSxJQUFWLEdBQWlCLEtBQUtTLEdBQUwsQ0FBUyxDQUFULENBQWpCO0FBQ0FqQixjQUFVZSxHQUFWLEdBQWdCLEtBQUtFLEdBQUwsQ0FBUyxDQUFULENBQWhCO0FBQ0Q7QUE5QmlDLENBQXBDOztBQWlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBckIsU0FBU0Msa0JBQVQsQ0FBNEIsT0FBNUIsRUFBcUM7QUFDbkNDLFFBRG1DLGtCQUM1QkMsU0FENEIsRUFDakJDLFNBRGlCLEVBQ05DLFFBRE0sRUFDSUssT0FESixFQUNhO0FBQzlDLFFBQUlNLFlBQVlOLFFBQVFNLFNBQXhCO0FBQ0EsU0FBS00sVUFBTCxHQUFrQixJQUFsQixDQUY4QyxDQUVwQjtBQUMxQixTQUFLQyxNQUFMLEdBQWMsSUFBZCxDQUg4QyxDQUdwQjtBQUMxQixZQUFRUCxTQUFSO0FBQ0EsV0FBSyxJQUFMO0FBQ0UsYUFBS00sVUFBTCxHQUFrQixJQUFsQjtBQUNBLGFBQUtDLE1BQUwsR0FBYyxJQUFkO0FBQ0E7QUFDRixXQUFLLElBQUw7QUFDRSxhQUFLRCxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsYUFBS0MsTUFBTCxHQUFjLEtBQWQ7QUFDQTtBQUNGLFdBQUssS0FBTDtBQUNFLGFBQUtELFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxhQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUNBO0FBQ0YsV0FBSyxNQUFMO0FBQ0UsYUFBS0QsVUFBTCxHQUFrQixLQUFsQjtBQUNBLGFBQUtDLE1BQUwsR0FBYyxLQUFkO0FBQ0E7QUFDRjtBQUNFLFlBQUlQLGNBQWMsSUFBbEIsRUFBd0I7QUFDdEJDLGtCQUFRQyxJQUFSLENBQWEsOEJBQWIsRUFBNkNGLFNBQTdDO0FBQ0Q7QUFwQkg7QUFzQkEsUUFBSSxLQUFLTSxVQUFULEVBQXFCO0FBQ25CbkIsZ0JBQVVxQixNQUFWLEdBQW1CLEdBQW5CO0FBQ0FwQixnQkFBVW9CLE1BQVYsR0FBbUIsR0FBbkI7QUFDQXBCLGdCQUFVRyxPQUFWLEdBQW9CLEdBQXBCO0FBQ0EsVUFBSSxLQUFLZ0IsTUFBVCxFQUFpQjtBQUNmbkIsa0JBQVVxQixTQUFWLEdBQXNCLGdCQUF0QjtBQUNBckIsa0JBQVVzQixZQUFWLEdBQXlCLGdCQUF6QjtBQUNBdEIsa0JBQVV1QixlQUFWLEdBQTRCLGdCQUE1QjtBQUNELE9BSkQsTUFJTztBQUNMdkIsa0JBQVVxQixTQUFWLEdBQXNCLGdCQUF0QjtBQUNBckIsa0JBQVVzQixZQUFWLEdBQXlCLGdCQUF6QjtBQUNBdEIsa0JBQVV1QixlQUFWLEdBQTRCLGdCQUE1QjtBQUNEO0FBQ0YsS0FiRCxNQWFPO0FBQUc7QUFDUnhCLGdCQUFVcUIsTUFBVixHQUFtQixHQUFuQjtBQUNBcEIsZ0JBQVVvQixNQUFWLEdBQW1CLEdBQW5CO0FBQ0FyQixnQkFBVUksT0FBVixHQUFvQixHQUFwQjtBQUNBSCxnQkFBVXFCLFNBQVYsR0FBc0IsWUFBdEI7QUFDQXJCLGdCQUFVc0IsWUFBVixHQUF5QixZQUF6QjtBQUNBdEIsZ0JBQVV1QixlQUFWLEdBQTRCLFlBQTVCO0FBQ0Q7QUFDRixHQWhEa0M7QUFpRG5DbkIsTUFqRG1DLGdCQWlEOUJMLFNBakQ4QixFQWlEbkJDLFNBakRtQixFQWlEUkMsUUFqRFEsRUFpREVLLE9BakRGLEVBaURXO0FBQzVDLFFBQUlMLGFBQWEsSUFBakIsRUFBdUI7QUFDckJBLGlCQUFXLElBQVg7QUFDRDtBQUNELFFBQUksS0FBS2lCLFVBQVQsRUFBcUI7QUFDbkJsQixnQkFBVUssa0JBQVYsR0FBK0JKLFFBQS9CO0FBQ0FELGdCQUFVRyxPQUFWLEdBQW9CLEdBQXBCO0FBQ0FILGdCQUFVcUIsU0FBVixHQUFzQixnQkFBdEI7QUFDQXJCLGdCQUFVc0IsWUFBVixHQUF5QixnQkFBekI7QUFDQXRCLGdCQUFVdUIsZUFBVixHQUE0QixnQkFBNUI7QUFDRCxLQU5ELE1BTU87QUFDTHhCLGdCQUFVTSxrQkFBVixHQUErQkosUUFBL0I7QUFDQUYsZ0JBQVVJLE9BQVYsR0FBb0IsR0FBcEI7QUFDQSxVQUFJLEtBQUtnQixNQUFULEVBQWlCO0FBQ2ZwQixrQkFBVXNCLFNBQVYsR0FBc0IsWUFBdEI7QUFDQXRCLGtCQUFVdUIsWUFBVixHQUF5QixZQUF6QjtBQUNBdkIsa0JBQVV3QixlQUFWLEdBQTRCLFlBQTVCO0FBQ0QsT0FKRCxNQUlPO0FBQ0x4QixrQkFBVXNCLFNBQVYsR0FBc0IsZ0JBQXRCO0FBQ0F0QixrQkFBVXVCLFlBQVYsR0FBeUIsZ0JBQXpCO0FBQ0F2QixrQkFBVXdCLGVBQVYsR0FBNEIsZ0JBQTVCO0FBQ0Q7QUFDRjtBQUNGO0FBeEVrQyxDQUFyQyIsImZpbGUiOiIyZC1hbmltYXRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRGlzc29sdmUgcGFnZSBlZmZlY3Rcbi8vIE9wdGlvbmFsIGFyZ3VtZW50c1xuLy8gLSBkaXJlY3Rpb24gLi4uLi4gRGlyZWN0aW9uIG9mIG1vdmVtZW50XG4vLyAgICAgcmlnaHQgIC4uLiBMZWZ0IHRvIFJpZ2h0XG4vLyAgICAgbGVmdCAgIC4uLiBSaWdodCB0byBMZWZ0XG4vLyAgICAgdXAgLi4uIFRvcCB0byBCb3R0b21cbi8vICAgICBkb3duIC4uLiBCb3R0b20gdG8gVG9wXG5MaWJyZXR0by5yZWdpc3RlclBhZ2VFZmZlY3QoJ2Rpc3NvbHZlJywge1xuICBiZWZvcmUocHJldlN0eWxlLCBuZXh0U3R5bGUsIGR1cmF0aW9uLCBfb3B0aW9ucykge1xuICAgIG5leHRTdHlsZS5vcGFjaXR5ID0gJzAnO1xuICB9LFxuICBleGVjKHByZXZTdHlsZSwgbmV4dFN0eWxlLCBkdXJhdGlvbiwgX29wdGlvbnMpIHtcbiAgICBuZXh0U3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gZHVyYXRpb247XG4gICAgbmV4dFN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gIH1cbn0pO1xuXG4vLyBNb3ZlSW4gcGFnZSBFZmZlY3Rcbi8vIE9wdGlvbmFsIGFyZ3VtZW50c1xuLy8gLSBkaXJlY3Rpb24gLi4uLi4gRGlyZWN0aW9uIG9mIG1vdmVtZW50XG4vLyAgICAgcmlnaHQgIC4uLiBMZWZ0IHRvIFJpZ2h0XG4vLyAgICAgbGVmdCAgIC4uLiBSaWdodCB0byBMZWZ0XG4vLyAgICAgdXAgLi4uIFRvcCB0byBCb3R0b21cbi8vICAgICBkb3duIC4uLiBCb3R0b20gdG8gVG9wXG5MaWJyZXR0by5yZWdpc3RlclBhZ2VFZmZlY3QoJ21vdmUtaW4nLCB7XG4gIGJlZm9yZShwcmV2U3R5bGUsIG5leHRTdHlsZSwgZHVyYXRpb24sIG9wdGlvbnMpIHtcbiAgICBsZXQgb3JpZ2luID0ge1xuICAgICAgbGVmdDogWycxMDAlJywgJzAlJ10sXG4gICAgICByaWdodDogWyctMTAwJScsICcwJSddLFxuICAgICAgdXA6IFsnMCUnLCAnMTAwJSddLFxuICAgICAgZG93bjogWycwJScsICctMTAwJSddXG4gICAgfVtvcHRpb25zLmRpcmVjdGlvbl07XG4gICAgaWYgKG9yaWdpbiA9PT0gbnVsbCkge1xuICAgICAgaWYgKG9wdGlvbnMuZGlyZWN0aW9uICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignSW52YWxpZCB2YWx1ZSBvZiBkaXJlY3Rpb246Jywgb3B0aW9ucy5kaXJlY3Rpb24pO1xuICAgICAgfVxuICAgICAgb3JpZ2luID0gWycxMDAlJywgJzAlJ107XG4gICAgfVxuICAgIG5leHRTdHlsZS5sZWZ0ID0gb3JpZ2luWzBdO1xuICAgIG5leHRTdHlsZS50b3AgPSBvcmlnaW5bMV07XG4gIH0sXG4gIGV4ZWMocHJldlN0eWxlLCBuZXh0U3R5bGUsIGR1cmF0aW9uLCBvcHRpb25zKSB7XG4gICAgaWYgKGR1cmF0aW9uID09PSBudWxsKSB7XG4gICAgICBuZXh0U3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gJzFzJztcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dFN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgIH1cbiAgICBuZXh0U3R5bGUubGVmdCA9ICcwJSc7XG4gICAgbmV4dFN0eWxlLnRvcCA9ICcwJSc7XG4gIH1cbn0pO1xuXG4vLyBQdXNoaW5nIHBhZ2UgZWZmZWN0XG4vLyBPcHRpb25hbCBhcmd1bWVudHNcbi8vIC0gZGlyZWN0aW9uIC4uLi4uIERpcmVjdGlvbiBvZiBtb3ZlbWVudFxuLy8gICAgIHJpZ2h0ICAgLi4uIExlZnQgdG8gUmlnaHRcbi8vICAgICBsZWZ0ICAgIC4uLiBSaWdodCB0byBMZWZ0XG4vLyAgICAgdXAgICAgICAuLi4gVG9wIHRvIEJvdHRvbVxuLy8gICAgIGRvd24gICAgLi4uIEJvdHRvbSB0byBUb3BcbkxpYnJldHRvLnJlZ2lzdGVyUGFnZUVmZmVjdCgncHVzaCcsIHtcbiAgYmVmb3JlKHByZXZTdHlsZSwgbmV4dFN0eWxlLCBkdXJhdGlvbiwgb3B0aW9ucykge1xuICAgIGxldCBwb3NQcmVmaXggPSB7XG4gICAgICBsZWZ0OiBbJzAlJywgJzAlJywgJzEwMCUnLCAnMCUnLCAnLTEwMCUnLCAnMCUnLCAnMCUnLCAnMCUnXSxcbiAgICAgIHJpZ2h0OiBbJzAlJywgJzAlJywgJy0xMDAlJywgJzAlJywgJzEwMCUnLCAnMCUnLCAnMCUnLCAnMCUnXSxcbiAgICAgIHVwOiBbJzAlJywgJzAlJywgJzAlJywgJzEwMCUnLCAnMCUnLCAnLTEwMCUnLCAnMCUnLCAnMCUnXSxcbiAgICAgIGRvd246IFsnMCUnLCAnMCUnLCAnMCUnLCAnLTEwMCUnLCAnMCUnLCAnMTAwJScsICcwJScsICcwJSddXG4gICAgfTtcbiAgICB0aGlzLnBvcyA9IHBvc1ByZWZpeFtvcHRpb25zLmRpcmVjdGlvbl07XG4gICAgaWYgKHR5cGVvZiB0aGlzLnBvcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5kaXJlY3Rpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignSW52YWxpZCB2YWx1ZSBvZiBkaXJlY3Rpb246ICcsIG9wdGlvbnMuZGlyZWN0aW9uKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucG9zID0gcG9zUHJlZml4WydsZWZ0J107XG4gICAgfVxuICAgIHByZXZTdHlsZS5sZWZ0ID0gdGhpcy5wb3NbMF07XG4gICAgcHJldlN0eWxlLnRvcCA9IHRoaXMucG9zWzFdO1xuICAgIG5leHRTdHlsZS5sZWZ0ID0gdGhpcy5wb3NbMl07XG4gICAgbmV4dFN0eWxlLnRvcCA9IHRoaXMucG9zWzNdO1xuICB9LFxuICBleGVjKHByZXZTdHlsZSwgbmV4dFN0eWxlLCBkdXJhdGlvbiwgb3B0aW9ucykge1xuICAgIGlmIChkdXJhdGlvbiA9PT0gbnVsbCkge1xuICAgICAgZHVyYXRpb24gPSAnMXMnO1xuICAgIH1cbiAgICBwcmV2U3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gZHVyYXRpb247XG4gICAgcHJldlN0eWxlLmxlZnQgPSB0aGlzLnBvc1s0XTtcbiAgICBwcmV2U3R5bGUudG9wID0gdGhpcy5wb3NbNV07XG4gICAgbmV4dFN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgIG5leHRTdHlsZS5sZWZ0ID0gdGhpcy5wb3NbNl07XG4gICAgbmV4dFN0eWxlLnRvcCA9IHRoaXMucG9zWzddO1xuICB9XG59KTtcblxuLy8gU2xpZGUtaW4gUGFnZSBFZmZlY3Rcbi8vIE9wdGlvbmFsIGFyZ3VtZW50c1xuLy8gLSBkaXJlY3Rpb24gLi4uLi4gRGlyZWN0aW9uIG9mIHpvb21pbmdcbi8vICAgICB1cFxuLy8gICAgIGRvd25cbi8vICAgICBpblxuLy8gICAgIG91dFxuTGlicmV0dG8ucmVnaXN0ZXJQYWdlRWZmZWN0KCdzY2FsZScsIHtcbiAgYmVmb3JlKHByZXZTdHlsZSwgbmV4dFN0eWxlLCBkdXJhdGlvbiwgb3B0aW9ucykge1xuICAgIGxldCBkaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICB0aGlzLnRhcmdldE5leHQgPSB0cnVlOyAgIC8vIEEgdGFyZ2V0IG9mIHRoZSBhbmltYXRpb24gaXMgbmV4dCBzbGlkZSB3aGVuIHRydWVcbiAgICB0aGlzLnpvb21pbiA9IHRydWU7ICAgICAgIC8vIFpvb21pbmcgaXMgem9vbS1pbiB3aGVuIHRydWVcbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgIGNhc2UgJ3VwJzpcbiAgICAgIHRoaXMudGFyZ2V0TmV4dCA9IHRydWU7XG4gICAgICB0aGlzLnpvb21pbiA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdpbic6XG4gICAgICB0aGlzLnRhcmdldE5leHQgPSB0cnVlO1xuICAgICAgdGhpcy56b29taW4gPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ291dCc6XG4gICAgICB0aGlzLnRhcmdldE5leHQgPSBmYWxzZTtcbiAgICAgIHRoaXMuem9vbWluID0gdHJ1ZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgdGhpcy50YXJnZXROZXh0ID0gZmFsc2U7XG4gICAgICB0aGlzLnpvb21pbiA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChkaXJlY3Rpb24gIT09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdJbnZhbGlkIHZhbHVlIG9mIGRpcmVjdGlvbjogJywgZGlyZWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMudGFyZ2V0TmV4dCkge1xuICAgICAgcHJldlN0eWxlLnpJbmRleCA9ICcwJztcbiAgICAgIG5leHRTdHlsZS56SW5kZXggPSAnMSc7XG4gICAgICBuZXh0U3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICAgIGlmICh0aGlzLnpvb21pbikge1xuICAgICAgICBuZXh0U3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDAuMiwwLjIpJztcbiAgICAgICAgbmV4dFN0eWxlLm1velRyYW5zZm9ybSA9ICdzY2FsZSgwLjIsMC4yKSc7XG4gICAgICAgIG5leHRTdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSAnc2NhbGUoMC4yLDAuMiknO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dFN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgzLjAsMy4wKSc7XG4gICAgICAgIG5leHRTdHlsZS5tb3pUcmFuc2Zvcm0gPSAnc2NhbGUoMy4wLDMuMCknO1xuICAgICAgICBuZXh0U3R5bGUud2Via2l0VHJhbnNmb3JtID0gJ3NjYWxlKDMuMCwzLjApJztcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAgLy8gaWYgbmV4dCBzbGlkZSB3aWxsIGFuaW1hdGVcbiAgICAgIHByZXZTdHlsZS56SW5kZXggPSAnMSc7XG4gICAgICBuZXh0U3R5bGUuekluZGV4ID0gJzAnO1xuICAgICAgcHJldlN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgICBuZXh0U3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDEsMSknO1xuICAgICAgbmV4dFN0eWxlLm1velRyYW5zZm9ybSA9ICdzY2FsZSgxLDEpJztcbiAgICAgIG5leHRTdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSAnc2NhbGUoMSwxKSc7XG4gICAgfVxuICB9LFxuICBleGVjKHByZXZTdHlsZSwgbmV4dFN0eWxlLCBkdXJhdGlvbiwgb3B0aW9ucykge1xuICAgIGlmIChkdXJhdGlvbiA9PT0gbnVsbCkge1xuICAgICAgZHVyYXRpb24gPSAnMXMnO1xuICAgIH1cbiAgICBpZiAodGhpcy50YXJnZXROZXh0KSB7XG4gICAgICBuZXh0U3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gZHVyYXRpb247XG4gICAgICBuZXh0U3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICAgIG5leHRTdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoMS4wLDEuMCknO1xuICAgICAgbmV4dFN0eWxlLm1velRyYW5zZm9ybSA9ICdzY2FsZSgxLjAsMS4wKSc7XG4gICAgICBuZXh0U3R5bGUud2Via2l0VHJhbnNmb3JtID0gJ3NjYWxlKDEuMCwxLjApJztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJldlN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgICAgcHJldlN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgICBpZiAodGhpcy56b29taW4pIHtcbiAgICAgICAgcHJldlN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgzLDMpJztcbiAgICAgICAgcHJldlN0eWxlLm1velRyYW5zZm9ybSA9ICdzY2FsZSgzLDMpJztcbiAgICAgICAgcHJldlN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICdzY2FsZSgzLDMpJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXZTdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoMC4yLDAuMiknO1xuICAgICAgICBwcmV2U3R5bGUubW96VHJhbnNmb3JtID0gJ3NjYWxlKDAuMiwwLjIpJztcbiAgICAgICAgcHJldlN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICdzY2FsZSgwLjIsMC4yKSc7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcbiJdfQ==
},{}],306:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AutoZoom = function (_Libretto$Plugin) {
  _inherits(AutoZoom, _Libretto$Plugin);

  function AutoZoom() {
    _classCallCheck(this, AutoZoom);

    return _possibleConstructorReturn(this, (AutoZoom.__proto__ || Object.getPrototypeOf(AutoZoom)).apply(this, arguments));
  }

  _createClass(AutoZoom, [{
    key: 'initialize',
    value: function initialize() {
      var _this2 = this;

      var computerBodyStyle = window.getComputedStyle(window.document.body);
      this.initialBodyWidth = computerBodyStyle.width.split('px')[0];
      this.initialBodyHeight = computerBodyStyle.height.split('px')[0];
      window.addEventListener('resize', function () {
        AutoZoom.prototype.fitToWindow.call(_this2);
      });
      AutoZoom.prototype.fitToWindow.call(this);
    }
  }, {
    key: 'fitToWindow',
    value: function fitToWindow() {
      var iw = window.innerWidth;
      var ih = window.innerHeight;
      var zoom = Math.min(iw / this.initialBodyWidth, ih / this.initialBodyHeight);
      window.document.body.style.transform = 'scale(' + zoom + ') translate(-50%, -50%)';
    }
  }]);

  return AutoZoom;
}(Libretto.Plugin);

Libretto.AutoZoom = new AutoZoom();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dG9fem9vbS5qcyJdLCJuYW1lcyI6WyJBdXRvWm9vbSIsImNvbXB1dGVyQm9keVN0eWxlIiwid2luZG93IiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImRvY3VtZW50IiwiYm9keSIsImluaXRpYWxCb2R5V2lkdGgiLCJ3aWR0aCIsInNwbGl0IiwiaW5pdGlhbEJvZHlIZWlnaHQiLCJoZWlnaHQiLCJhZGRFdmVudExpc3RlbmVyIiwicHJvdG90eXBlIiwiZml0VG9XaW5kb3ciLCJjYWxsIiwiaXciLCJpbm5lcldpZHRoIiwiaWgiLCJpbm5lckhlaWdodCIsInpvb20iLCJNYXRoIiwibWluIiwic3R5bGUiLCJ0cmFuc2Zvcm0iLCJMaWJyZXR0byIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxROzs7Ozs7Ozs7OztpQ0FDUztBQUFBOztBQUNYLFVBQUlDLG9CQUFvQkMsT0FBT0MsZ0JBQVAsQ0FBd0JELE9BQU9FLFFBQVAsQ0FBZ0JDLElBQXhDLENBQXhCO0FBQ0EsV0FBS0MsZ0JBQUwsR0FBd0JMLGtCQUFrQk0sS0FBbEIsQ0FBd0JDLEtBQXhCLENBQThCLElBQTlCLEVBQW9DLENBQXBDLENBQXhCO0FBQ0EsV0FBS0MsaUJBQUwsR0FBeUJSLGtCQUFrQlMsTUFBbEIsQ0FBeUJGLEtBQXpCLENBQStCLElBQS9CLEVBQXFDLENBQXJDLENBQXpCO0FBQ0FOLGFBQU9TLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLFlBQU07QUFDdENYLGlCQUFTWSxTQUFULENBQW1CQyxXQUFuQixDQUErQkMsSUFBL0I7QUFDRCxPQUZEO0FBR0FkLGVBQVNZLFNBQVQsQ0FBbUJDLFdBQW5CLENBQStCQyxJQUEvQixDQUFvQyxJQUFwQztBQUNEOzs7a0NBRWE7QUFDWixVQUFJQyxLQUFLYixPQUFPYyxVQUFoQjtBQUNBLFVBQUlDLEtBQUtmLE9BQU9nQixXQUFoQjtBQUNBLFVBQUlDLE9BQU9DLEtBQUtDLEdBQUwsQ0FBU04sS0FBSyxLQUFLVCxnQkFBbkIsRUFBcUNXLEtBQUssS0FBS1IsaUJBQS9DLENBQVg7QUFDQVAsYUFBT0UsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJpQixLQUFyQixDQUEyQkMsU0FBM0IsY0FBZ0RKLElBQWhEO0FBQ0Q7Ozs7RUFoQm9CSyxTQUFTQyxNOztBQW1CaENELFNBQVN4QixRQUFULEdBQW9CLElBQUlBLFFBQUosRUFBcEIiLCJmaWxlIjoiYXV0b196b29tLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQXV0b1pvb20gZXh0ZW5kcyBMaWJyZXR0by5QbHVnaW4ge1xuICBpbml0aWFsaXplKCkge1xuICAgIGxldCBjb21wdXRlckJvZHlTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHdpbmRvdy5kb2N1bWVudC5ib2R5KTtcbiAgICB0aGlzLmluaXRpYWxCb2R5V2lkdGggPSBjb21wdXRlckJvZHlTdHlsZS53aWR0aC5zcGxpdCgncHgnKVswXTtcbiAgICB0aGlzLmluaXRpYWxCb2R5SGVpZ2h0ID0gY29tcHV0ZXJCb2R5U3R5bGUuaGVpZ2h0LnNwbGl0KCdweCcpWzBdO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICBBdXRvWm9vbS5wcm90b3R5cGUuZml0VG9XaW5kb3cuY2FsbCh0aGlzKTtcbiAgICB9KTtcbiAgICBBdXRvWm9vbS5wcm90b3R5cGUuZml0VG9XaW5kb3cuY2FsbCh0aGlzKTtcbiAgfVxuXG4gIGZpdFRvV2luZG93KCkge1xuICAgIGxldCBpdyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGxldCBpaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBsZXQgem9vbSA9IE1hdGgubWluKGl3IC8gdGhpcy5pbml0aWFsQm9keVdpZHRoLCBpaCAvIHRoaXMuaW5pdGlhbEJvZHlIZWlnaHQpO1xuICAgIHdpbmRvdy5kb2N1bWVudC5ib2R5LnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3pvb219KSB0cmFuc2xhdGUoLTUwJSwgLTUwJSlgO1xuICB9XG59XG5cbkxpYnJldHRvLkF1dG9ab29tID0gbmV3IEF1dG9ab29tKCk7XG4iXX0=
},{}],307:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IO = function IO(target) {
  _classCallCheck(this, IO);

  target.addEventListener('keypress', function (e) {
    var nucleus = Libretto.nucleus();
    if (e.charCode == '['.charCodeAt(0)) {
      nucleus.skipPrev();
    } else if (e.charCode == ']'.charCodeAt(0)) {
      nucleus.skipNext();
    }
  });

  target.addEventListener('keydown', function (e) {
    // TODO: Added Enter key but the Enter is conflicted to pager plugin.
    var nucleus = Libretto.nucleus();
    switch (e.keyCode) {
      // case 13:    // Enter
      case 32: // Space
      case 40: // Arrow Down
      case 34:
        // Page Down
        nucleus.step();
        break;
      case 38: // Arrow up
      case 33:
        // Page Up
        nucleus.skipPrev();
        break;
      case 36:
        // Home
        nucleus.skipTo(0);
        break;
      case 35:
        // End
        nucleus.skipTo(Number.MAX_VALUE);
        break;
    }
  });

  target.addEventListener('click', function (e) {
    if (e.button != 0) {
      return;
    }
    var nucleus = Libretto.nucleus();
    nucleus.step();
  });
};

exports.default = IO;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlvLmpzIl0sIm5hbWVzIjpbIklPIiwidGFyZ2V0IiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJudWNsZXVzIiwiTGlicmV0dG8iLCJjaGFyQ29kZSIsImNoYXJDb2RlQXQiLCJza2lwUHJldiIsInNraXBOZXh0Iiwia2V5Q29kZSIsInN0ZXAiLCJza2lwVG8iLCJOdW1iZXIiLCJNQVhfVkFMVUUiLCJidXR0b24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBQXFCQSxFLEdBQ25CLFlBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDbEJBLFNBQU9DLGdCQUFQLENBQXdCLFVBQXhCLEVBQW9DLFVBQUNDLENBQUQsRUFBTztBQUN6QyxRQUFJQyxVQUFVQyxTQUFTRCxPQUFULEVBQWQ7QUFDQSxRQUFJRCxFQUFFRyxRQUFGLElBQWMsSUFBSUMsVUFBSixDQUFlLENBQWYsQ0FBbEIsRUFBcUM7QUFDbkNILGNBQVFJLFFBQVI7QUFDRCxLQUZELE1BRU8sSUFBSUwsRUFBRUcsUUFBRixJQUFjLElBQUlDLFVBQUosQ0FBZSxDQUFmLENBQWxCLEVBQXFDO0FBQzFDSCxjQUFRSyxRQUFSO0FBQ0Q7QUFDRixHQVBEOztBQVNBUixTQUFPQyxnQkFBUCxDQUF3QixTQUF4QixFQUFtQyxVQUFDQyxDQUFELEVBQU87QUFDeEM7QUFDQSxRQUFJQyxVQUFVQyxTQUFTRCxPQUFULEVBQWQ7QUFDQSxZQUFRRCxFQUFFTyxPQUFWO0FBQ0E7QUFDQSxXQUFLLEVBQUwsQ0FGQSxDQUVVO0FBQ1YsV0FBSyxFQUFMLENBSEEsQ0FHVTtBQUNWLFdBQUssRUFBTDtBQUFVO0FBQ1JOLGdCQUFRTyxJQUFSO0FBQ0E7QUFDRixXQUFLLEVBQUwsQ0FQQSxDQU9VO0FBQ1YsV0FBSyxFQUFMO0FBQVU7QUFDUlAsZ0JBQVFJLFFBQVI7QUFDQTtBQUNGLFdBQUssRUFBTDtBQUFVO0FBQ1JKLGdCQUFRUSxNQUFSLENBQWUsQ0FBZjtBQUNBO0FBQ0YsV0FBSyxFQUFMO0FBQVU7QUFDUlIsZ0JBQVFRLE1BQVIsQ0FBZUMsT0FBT0MsU0FBdEI7QUFDQTtBQWhCRjtBQWtCRCxHQXJCRDs7QUF1QkFiLFNBQU9DLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLFVBQUNDLENBQUQsRUFBTztBQUN0QyxRQUFJQSxFQUFFWSxNQUFGLElBQVksQ0FBaEIsRUFBbUI7QUFBRTtBQUFTO0FBQzlCLFFBQUlYLFVBQVVDLFNBQVNELE9BQVQsRUFBZDtBQUNBQSxZQUFRTyxJQUFSO0FBQ0QsR0FKRDtBQUtELEM7O2tCQXZDa0JYLEUiLCJmaWxlIjoiaW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBJTyB7XG4gIGNvbnN0cnVjdG9yKHRhcmdldCkge1xuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIChlKSA9PiB7XG4gICAgICBsZXQgbnVjbGV1cyA9IExpYnJldHRvLm51Y2xldXMoKTtcbiAgICAgIGlmIChlLmNoYXJDb2RlID09ICdbJy5jaGFyQ29kZUF0KDApKSB7XG4gICAgICAgIG51Y2xldXMuc2tpcFByZXYoKTtcbiAgICAgIH0gZWxzZSBpZiAoZS5jaGFyQ29kZSA9PSAnXScuY2hhckNvZGVBdCgwKSkge1xuICAgICAgICBudWNsZXVzLnNraXBOZXh0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICAvLyBUT0RPOiBBZGRlZCBFbnRlciBrZXkgYnV0IHRoZSBFbnRlciBpcyBjb25mbGljdGVkIHRvIHBhZ2VyIHBsdWdpbi5cbiAgICAgIGxldCBudWNsZXVzID0gTGlicmV0dG8ubnVjbGV1cygpO1xuICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgIC8vIGNhc2UgMTM6ICAgIC8vIEVudGVyXG4gICAgICBjYXNlIDMyOiAgLy8gU3BhY2VcbiAgICAgIGNhc2UgNDA6ICAvLyBBcnJvdyBEb3duXG4gICAgICBjYXNlIDM0OiAgLy8gUGFnZSBEb3duXG4gICAgICAgIG51Y2xldXMuc3RlcCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzg6ICAvLyBBcnJvdyB1cFxuICAgICAgY2FzZSAzMzogIC8vIFBhZ2UgVXBcbiAgICAgICAgbnVjbGV1cy5za2lwUHJldigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzY6ICAvLyBIb21lXG4gICAgICAgIG51Y2xldXMuc2tpcFRvKDApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzU6ICAvLyBFbmRcbiAgICAgICAgbnVjbGV1cy5za2lwVG8oTnVtYmVyLk1BWF9WQUxVRSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmJ1dHRvbiAhPSAwKSB7IHJldHVybjsgfVxuICAgICAgbGV0IG51Y2xldXMgPSBMaWJyZXR0by5udWNsZXVzKCk7XG4gICAgICBudWNsZXVzLnN0ZXAoKTtcbiAgICB9KTtcbiAgfVxufVxuIl19
},{}],308:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Location = function (_Libretto$Plugin) {
  _inherits(Location, _Libretto$Plugin);

  function Location() {
    _classCallCheck(this, Location);

    return _possibleConstructorReturn(this, (Location.__proto__ || Object.getPrototypeOf(Location)).apply(this, arguments));
  }

  _createClass(Location, [{
    key: 'initialize',
    value: function initialize() {
      var _this2 = this;

      window.addEventListener('hashchange', function () {
        Location.prototype.applyPage.call(_this2);
      });

      var nucleus = Libretto.nucleus();
      nucleus.addEventListener('page.changed', function () {
        var index = nucleus.getPageIndex();
        Location.prototype.setHash.call(_this2, index);
      });

      Location.prototype.applyPage.call(this);
    }
  }, {
    key: 'setHash',
    value: function setHash(index) {
      window.location.hash = index + 1;
    }
  }, {
    key: 'applyPage',
    value: function applyPage() {
      var num = Number(window.location.hash.split('#')[1]);
      if (isNaN(num)) {
        num = 1;
      }
      var nucleus = Libretto.nucleus();
      nucleus.skipTo(num - 1);
    }
  }]);

  return Location;
}(Libretto.Plugin);

Libretto.Location = new Location();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvY2F0aW9uLmpzIl0sIm5hbWVzIjpbIkxvY2F0aW9uIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInByb3RvdHlwZSIsImFwcGx5UGFnZSIsImNhbGwiLCJudWNsZXVzIiwiTGlicmV0dG8iLCJpbmRleCIsImdldFBhZ2VJbmRleCIsInNldEhhc2giLCJsb2NhdGlvbiIsImhhc2giLCJudW0iLCJOdW1iZXIiLCJzcGxpdCIsImlzTmFOIiwic2tpcFRvIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLFE7Ozs7Ozs7Ozs7O2lDQUNTO0FBQUE7O0FBQ1hDLGFBQU9DLGdCQUFQLENBQXdCLFlBQXhCLEVBQXNDLFlBQU07QUFDMUNGLGlCQUFTRyxTQUFULENBQW1CQyxTQUFuQixDQUE2QkMsSUFBN0I7QUFDRCxPQUZEOztBQUlBLFVBQUlDLFVBQVVDLFNBQVNELE9BQVQsRUFBZDtBQUNBQSxjQUFRSixnQkFBUixDQUF5QixjQUF6QixFQUF5QyxZQUFNO0FBQzdDLFlBQUlNLFFBQVFGLFFBQVFHLFlBQVIsRUFBWjtBQUNBVCxpQkFBU0csU0FBVCxDQUFtQk8sT0FBbkIsQ0FBMkJMLElBQTNCLFNBQXNDRyxLQUF0QztBQUNELE9BSEQ7O0FBS0FSLGVBQVNHLFNBQVQsQ0FBbUJDLFNBQW5CLENBQTZCQyxJQUE3QixDQUFrQyxJQUFsQztBQUNEOzs7NEJBRU9HLEssRUFBTztBQUNiUCxhQUFPVSxRQUFQLENBQWdCQyxJQUFoQixHQUF1QkosUUFBUSxDQUEvQjtBQUNEOzs7Z0NBRVc7QUFDVixVQUFJSyxNQUFNQyxPQUFPYixPQUFPVSxRQUFQLENBQWdCQyxJQUFoQixDQUFxQkcsS0FBckIsQ0FBMkIsR0FBM0IsRUFBZ0MsQ0FBaEMsQ0FBUCxDQUFWO0FBQ0EsVUFBSUMsTUFBTUgsR0FBTixDQUFKLEVBQWdCO0FBQUVBLGNBQU0sQ0FBTjtBQUFVO0FBQzVCLFVBQUlQLFVBQVVDLFNBQVNELE9BQVQsRUFBZDtBQUNBQSxjQUFRVyxNQUFSLENBQWVKLE1BQU0sQ0FBckI7QUFDRDs7OztFQXhCb0JOLFNBQVNXLE07O0FBMkJoQ1gsU0FBU1AsUUFBVCxHQUFvQixJQUFJQSxRQUFKLEVBQXBCIiwiZmlsZSI6ImxvY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTG9jYXRpb24gZXh0ZW5kcyBMaWJyZXR0by5QbHVnaW4ge1xuICBpbml0aWFsaXplKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgKCkgPT4ge1xuICAgICAgTG9jYXRpb24ucHJvdG90eXBlLmFwcGx5UGFnZS5jYWxsKHRoaXMpO1xuICAgIH0pO1xuXG4gICAgbGV0IG51Y2xldXMgPSBMaWJyZXR0by5udWNsZXVzKCk7XG4gICAgbnVjbGV1cy5hZGRFdmVudExpc3RlbmVyKCdwYWdlLmNoYW5nZWQnLCAoKSA9PiB7XG4gICAgICBsZXQgaW5kZXggPSBudWNsZXVzLmdldFBhZ2VJbmRleCgpO1xuICAgICAgTG9jYXRpb24ucHJvdG90eXBlLnNldEhhc2guY2FsbCh0aGlzLCBpbmRleCk7XG4gICAgfSk7XG5cbiAgICBMb2NhdGlvbi5wcm90b3R5cGUuYXBwbHlQYWdlLmNhbGwodGhpcyk7XG4gIH1cblxuICBzZXRIYXNoKGluZGV4KSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBpbmRleCArIDE7XG4gIH1cblxuICBhcHBseVBhZ2UoKSB7XG4gICAgbGV0IG51bSA9IE51bWJlcih3aW5kb3cubG9jYXRpb24uaGFzaC5zcGxpdCgnIycpWzFdKTtcbiAgICBpZiAoaXNOYU4obnVtKSkgeyBudW0gPSAxOyB9XG4gICAgbGV0IG51Y2xldXMgPSBMaWJyZXR0by5udWNsZXVzKCk7XG4gICAgbnVjbGV1cy5za2lwVG8obnVtIC0gMSk7XG4gIH1cbn1cblxuTGlicmV0dG8uTG9jYXRpb24gPSBuZXcgTG9jYXRpb24oKTtcbiJdfQ==
},{}],309:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _page_transition = require('./page_transition');

var _page_transition2 = _interopRequireDefault(_page_transition);

var _css = require('./css');

var _css2 = _interopRequireDefault(_css);

var _io = require('./plugins/io');

var _io2 = _interopRequireDefault(_io);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Viewer =

//
// Initializes internal variables and HTML contents.
//
function Viewer() {
  var _this = this;

  _classCallCheck(this, Viewer);

  this.animationCss = null;
  this.pageTransition = null;

  new _io2.default(window);

  var nucleus = Libretto.nucleus();
  nucleus.addEventListener('page.transit', function (e) {
    if (_this.pageTransition !== null) {
      _this.pageTransition.finalize();
    }
    var from = e.detail.from;
    var to = e.detail.to;
    _this.pageTransition = new _page_transition2.default(from, to);
    _this.pageTransition.switchPage(true);
  });

  nucleus.addEventListener('page.skip', function (e) {
    if (_this.pageTransition !== null) {
      _this.pageTransition.finalize();
    }
    var from = e.detail.from;
    var to = e.detail.to;
    _this.pageTransition = new _page_transition2.default(from, to);
    _this.pageTransition.switchPage(false);
  });

  nucleus.addEventListener('page.changed', function (e) {
    var index = e.detail.to;
    _this.animationCss = _css2.default.findOrCreate('animation-' + index);
    _this.animationCss.clearRules();
  });

  nucleus.addEventListener('keyframe.play', function (e) {
    var target = e.detail.target;
    var properties = e.detail.properties;
    _this.animationCss.addRule(target, properties);
  });
};

exports.default = Viewer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdlci5qcyJdLCJuYW1lcyI6WyJWaWV3ZXIiLCJhbmltYXRpb25Dc3MiLCJwYWdlVHJhbnNpdGlvbiIsIndpbmRvdyIsIm51Y2xldXMiLCJMaWJyZXR0byIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiZmluYWxpemUiLCJmcm9tIiwiZGV0YWlsIiwidG8iLCJzd2l0Y2hQYWdlIiwiaW5kZXgiLCJmaW5kT3JDcmVhdGUiLCJjbGVhclJ1bGVzIiwidGFyZ2V0IiwicHJvcGVydGllcyIsImFkZFJ1bGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7SUFFcUJBLE07O0FBRW5CO0FBQ0E7QUFDQTtBQUNBLGtCQUFjO0FBQUE7O0FBQUE7O0FBQ1osT0FBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLE9BQUtDLGNBQUwsR0FBc0IsSUFBdEI7O0FBRUEsbUJBQU9DLE1BQVA7O0FBRUEsTUFBSUMsVUFBVUMsU0FBU0QsT0FBVCxFQUFkO0FBQ0FBLFVBQVFFLGdCQUFSLENBQXlCLGNBQXpCLEVBQXlDLFVBQUNDLENBQUQsRUFBTztBQUM5QyxRQUFJLE1BQUtMLGNBQUwsS0FBd0IsSUFBNUIsRUFBa0M7QUFDaEMsWUFBS0EsY0FBTCxDQUFvQk0sUUFBcEI7QUFDRDtBQUNELFFBQUlDLE9BQU9GLEVBQUVHLE1BQUYsQ0FBU0QsSUFBcEI7QUFDQSxRQUFJRSxLQUFLSixFQUFFRyxNQUFGLENBQVNDLEVBQWxCO0FBQ0EsVUFBS1QsY0FBTCxHQUFzQiw4QkFBbUJPLElBQW5CLEVBQXlCRSxFQUF6QixDQUF0QjtBQUNBLFVBQUtULGNBQUwsQ0FBb0JVLFVBQXBCLENBQStCLElBQS9CO0FBQ0QsR0FSRDs7QUFVQVIsVUFBUUUsZ0JBQVIsQ0FBeUIsV0FBekIsRUFBc0MsVUFBQ0MsQ0FBRCxFQUFPO0FBQzNDLFFBQUksTUFBS0wsY0FBTCxLQUF3QixJQUE1QixFQUFrQztBQUNoQyxZQUFLQSxjQUFMLENBQW9CTSxRQUFwQjtBQUNEO0FBQ0QsUUFBSUMsT0FBT0YsRUFBRUcsTUFBRixDQUFTRCxJQUFwQjtBQUNBLFFBQUlFLEtBQUtKLEVBQUVHLE1BQUYsQ0FBU0MsRUFBbEI7QUFDQSxVQUFLVCxjQUFMLEdBQXNCLDhCQUFtQk8sSUFBbkIsRUFBeUJFLEVBQXpCLENBQXRCO0FBQ0EsVUFBS1QsY0FBTCxDQUFvQlUsVUFBcEIsQ0FBK0IsS0FBL0I7QUFDRCxHQVJEOztBQVVBUixVQUFRRSxnQkFBUixDQUF5QixjQUF6QixFQUF5QyxVQUFDQyxDQUFELEVBQU87QUFDOUMsUUFBSU0sUUFBUU4sRUFBRUcsTUFBRixDQUFTQyxFQUFyQjtBQUNBLFVBQUtWLFlBQUwsR0FBb0IsY0FBSWEsWUFBSixnQkFBOEJELEtBQTlCLENBQXBCO0FBQ0EsVUFBS1osWUFBTCxDQUFrQmMsVUFBbEI7QUFDRCxHQUpEOztBQU1BWCxVQUFRRSxnQkFBUixDQUF5QixlQUF6QixFQUEwQyxVQUFDQyxDQUFELEVBQU87QUFDL0MsUUFBSVMsU0FBU1QsRUFBRUcsTUFBRixDQUFTTSxNQUF0QjtBQUNBLFFBQUlDLGFBQWFWLEVBQUVHLE1BQUYsQ0FBU08sVUFBMUI7QUFDQSxVQUFLaEIsWUFBTCxDQUFrQmlCLE9BQWxCLENBQTBCRixNQUExQixFQUFrQ0MsVUFBbEM7QUFDRCxHQUpEO0FBS0QsQzs7a0JBM0NrQmpCLE0iLCJmaWxlIjoidmlld2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhZ2VUcmFuc2l0aW9uIGZyb20gJy4vcGFnZV90cmFuc2l0aW9uJztcbmltcG9ydCBDc3MgZnJvbSAnLi9jc3MnO1xuaW1wb3J0IElPIGZyb20gJy4vcGx1Z2lucy9pbyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXdlciB7XG5cbiAgLy9cbiAgLy8gSW5pdGlhbGl6ZXMgaW50ZXJuYWwgdmFyaWFibGVzIGFuZCBIVE1MIGNvbnRlbnRzLlxuICAvL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFuaW1hdGlvbkNzcyA9IG51bGw7XG4gICAgdGhpcy5wYWdlVHJhbnNpdGlvbiA9IG51bGw7XG5cbiAgICBuZXcgSU8od2luZG93KTtcblxuICAgIGxldCBudWNsZXVzID0gTGlicmV0dG8ubnVjbGV1cygpO1xuICAgIG51Y2xldXMuYWRkRXZlbnRMaXN0ZW5lcigncGFnZS50cmFuc2l0JywgKGUpID0+IHtcbiAgICAgIGlmICh0aGlzLnBhZ2VUcmFuc2l0aW9uICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMucGFnZVRyYW5zaXRpb24uZmluYWxpemUoKTtcbiAgICAgIH1cbiAgICAgIGxldCBmcm9tID0gZS5kZXRhaWwuZnJvbTtcbiAgICAgIGxldCB0byA9IGUuZGV0YWlsLnRvO1xuICAgICAgdGhpcy5wYWdlVHJhbnNpdGlvbiA9IG5ldyBQYWdlVHJhbnNpdGlvbihmcm9tLCB0byk7XG4gICAgICB0aGlzLnBhZ2VUcmFuc2l0aW9uLnN3aXRjaFBhZ2UodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBudWNsZXVzLmFkZEV2ZW50TGlzdGVuZXIoJ3BhZ2Uuc2tpcCcsIChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5wYWdlVHJhbnNpdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnBhZ2VUcmFuc2l0aW9uLmZpbmFsaXplKCk7XG4gICAgICB9XG4gICAgICBsZXQgZnJvbSA9IGUuZGV0YWlsLmZyb207XG4gICAgICBsZXQgdG8gPSBlLmRldGFpbC50bztcbiAgICAgIHRoaXMucGFnZVRyYW5zaXRpb24gPSBuZXcgUGFnZVRyYW5zaXRpb24oZnJvbSwgdG8pO1xuICAgICAgdGhpcy5wYWdlVHJhbnNpdGlvbi5zd2l0Y2hQYWdlKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIG51Y2xldXMuYWRkRXZlbnRMaXN0ZW5lcigncGFnZS5jaGFuZ2VkJywgKGUpID0+IHtcbiAgICAgIGxldCBpbmRleCA9IGUuZGV0YWlsLnRvO1xuICAgICAgdGhpcy5hbmltYXRpb25Dc3MgPSBDc3MuZmluZE9yQ3JlYXRlKGBhbmltYXRpb24tJHtpbmRleH1gKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uQ3NzLmNsZWFyUnVsZXMoKTtcbiAgICB9KTtcblxuICAgIG51Y2xldXMuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZnJhbWUucGxheScsIChlKSA9PiB7XG4gICAgICBsZXQgdGFyZ2V0ID0gZS5kZXRhaWwudGFyZ2V0O1xuICAgICAgbGV0IHByb3BlcnRpZXMgPSBlLmRldGFpbC5wcm9wZXJ0aWVzO1xuICAgICAgdGhpcy5hbmltYXRpb25Dc3MuYWRkUnVsZSh0YXJnZXQsIHByb3BlcnRpZXMpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=
},{"./css":297,"./page_transition":303,"./plugins/io":307}]},{},[298])