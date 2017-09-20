'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = {
    cloneObj: function cloneObj(obj) {
        if (!obj) return obj;
        var str = void 0;
        var newobj = obj.constructor === Array ? [] : {};
        if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object') {
            newobj = null;
        } else if (window.JSON) {
            str = (0, _stringify2.default)(obj);
            newobj = JSON.parse(str);
        } else {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    newobj[i] = (0, _typeof3.default)(obj[i]) === 'object' ? this.cloneObj(obj[i]) : obj[i];
                }
            }
        }
        return newobj;
    }
};
var evList = {
    data: {
        transferingData: null,
        locatingIndex: -1,
        locatingEl: null,
        locDragEl: null },

    onDragStart: function onDragStart(ev, el, bindings) {
        this.data.transferingData = {
            type: 'add',
            data: util.cloneObj(bindings.value.data)
        };

        {
            var f = bindings.value.beforeDrag,
                d = this.data.transferingData;
            if (f) {
                f(d);
            }
        }
    },
    onDragOver: function onDragOver(ev) {
        ev.preventDefault();
    },
    onLocateEnter: function onLocateEnter(ev, el, bindings) {
        this.data.locatingIndex = bindings.value.index;
        el.classList.add('drop-on');
        this.data.locatingEl = el;
    },
    onLocateLeave: function onLocateLeave(ev, el, bindings) {
        this.data.locatingIndex = -1;
        el.classList.remove('drop-on');
    },
    onLocateDragStart: function onLocateDragStart(ev, el, bindings) {
        this.data.locDragEl = el;
        el.classList.add('loc-drag');
        this.data.transferingData = {
            type: 'change',
            idx: bindings.value.index,
            data: bindings.value.data
        };
    },
    onDrop: function onDrop(ev, el, bindings) {
        ev.preventDefault();

        if (this.data.locatingEl) {
            this.data.locatingEl.classList.remove('drop-on');
        }

        if (this.data.locDragEl) {
            this.data.locDragEl.classList.remove('loc-drag');
        }
        var transferingData = this.data.transferingData;

        {
            var f = bindings.value.afterDropped,
                d = transferingData;
            if (f) {
                f(d);
            }
        }
        var locatingIndex = this.data.locatingIndex;
        var pool = bindings.value.pool;
        var locIdx = void 0;
        if (locatingIndex >= 0) {
            locIdx = locatingIndex;
        } else {
            locIdx = pool.length;
        }

        if (transferingData.type === 'add') {
            pool.splice(locIdx, 0, transferingData.data);
        } else if (transferingData.type === 'change') {
            var draggingIdx = this.data.transferingData.idx;
            if (locatingIndex >= 0) {
                pool.splice.apply(pool, [locIdx, 1].concat((0, _toConsumableArray3.default)(pool.splice(draggingIdx, 1, pool[locIdx]))));
            } else {
                pool.push.apply(pool, (0, _toConsumableArray3.default)(pool.splice(draggingIdx, 1)));
            }
        }
    }
};

module.exports = {
    install: function install(Vue) {
        Vue.directive('drag-man', {
            bind: function bind(el, bindings) {
                if (bindings.modifiers.drag) {
                    el.setAttribute('draggable', true);
                    el.addEventListener('dragstart', function (ev) {
                        evList.onDragStart(ev, el, bindings);
                    }, false);
                }

                if (bindings.modifiers.drop) {
                    el.addEventListener('dragover', evList.onDragOver, false);
                    el.addEventListener('drop', function (ev) {
                        evList.onDrop(ev, el, bindings);
                    }, false);
                }

                if (bindings.modifiers.locate) {
                    el.addEventListener('dragenter', function (ev) {
                        setTimeout(function () {
                            evList.onLocateEnter(ev, el, bindings);
                        });
                    }, false);
                    el.addEventListener('dragleave', function (ev) {
                        evList.onLocateLeave(ev, el, bindings);
                    }, false);

                    el.setAttribute('draggable', true);
                    el.addEventListener('dragstart', function (ev) {
                        evList.onLocateDragStart(ev, el, bindings);
                    }, false);
                }
            },

            unbind: function unbind(el, bindings) {}
        });
    }
};
