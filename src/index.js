/*eslint-disable*/
const util = {
    cloneObj (obj) {
        if (!obj) return obj;
        let str;
        let newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== 'object') {
            newobj = null;
        } else if (window.JSON) {
            str = JSON.stringify(obj); // 系列化对象
            newobj = JSON.parse(str); // 还原
        } else {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    newobj[i] = typeof obj[i] === 'object' ? this.cloneObj(obj[i]) : obj[i];
                }
            }
        }
        return newobj;
    }
};
const evList = {
    // 拖拽数据记录
    data: {
        transferingData: null, // 当前拖拽项
        locatingIndex: -1, // 定位位置
        locatingEl: null, // 定位元素
        locDragEl: null, // 定位后被拖拽元素
    },

    // 开始拖拽
    onDragStart (ev, el, bindings) {
        this.data.transferingData = {
            type: 'add',
            data: util.cloneObj(bindings.value.data)
        };

        // beforeDrag 钩子
        {
            let f = bindings.value.beforeDrag, d = this.data.transferingData;
            if (f) {
                f(d);
            }
        }
    },
    onDragOver (ev) {
        ev.preventDefault();
    },

    // 进入定位元素区域
    onLocateEnter (ev, el, bindings) {
        this.data.locatingIndex = bindings.value.index; // 定位位置
        el.classList.add('drop-on'); // 定位高亮
        this.data.locatingEl = el; // 定位元素
    },

    // 离开定位元素区域
    onLocateLeave (ev, el, bindings) {
        this.data.locatingIndex = -1;
        el.classList.remove('drop-on');
    },

    // 拖拽已定位元素
    onLocateDragStart (ev, el, bindings) {
        this.data.locDragEl = el;
        el.classList.add('loc-drag'); // 已定位元素被拖拽高亮
        this.data.transferingData = {
            type: 'change',
            idx: bindings.value.index,
            data: bindings.value.data
        };
    },

    // 放置
    onDrop (ev, el, bindings) {
        ev.preventDefault();

        // 移除 定位高亮
        if (this.data.locatingEl) {
            this.data.locatingEl.classList.remove('drop-on');
        }

        // 移除 已定位元素被拖拽高亮
        if (this.data.locDragEl) {
            this.data.locDragEl.classList.remove('loc-drag');
        }
        let transferingData = this.data.transferingData;

        // afterDropped 钩子
        {
            let f = bindings.value.afterDropped, d = transferingData;
            if (f) {
                f(d);
            }
        }
        let locatingIndex = this.data.locatingIndex; // 定位位置
        let pool = bindings.value.pool; // 数据池，用于接纳新数据项的数组
        let locIdx; // 最终要放置的位置

        // 判断是否需要定位
        if (locatingIndex >= 0) {
            // 若不需要定位则自动放在最后一个
            locIdx = locatingIndex;
        } else {
            // 若不需要定位则自动放在最后一个
            locIdx = pool.length;
        }

        // 执行放置
        if (transferingData.type === 'add') {
            // 新增过来的元素：add表示新增
            pool.splice(locIdx, 0, transferingData.data);
        } else if (transferingData.type === 'change') {
            // 调整顺序：add表示更改(顺序)
            let draggingIdx = this.data.transferingData.idx;
            if (locatingIndex >= 0) {
                // 互换位置
                pool.splice(locIdx, 1, ...pool.splice(draggingIdx, 1, pool[locIdx]));
            } else {
                // 挪到最后
                pool.push(...pool.splice(draggingIdx, 1));
            }
        }
    },
};

module.exports = {
    install (Vue) {
        /*
            指令修饰符如下：
            - drag: 可被拖拽元素
                - value:
                    - data: 拖拽传递的数据
            - drop: 放置容器
                - value:
                    - pool: 数据池子，盛放被拖拽的数据的数组
            - locate: 定位元素，通常是按照 pool(数据池子)实例化出来的元素或者组件列表，可通过拖拽调整顺序
                - value:
                    - index: 索引
        */
        Vue.directive('drag-man', {
            bind (el, bindings) {
                // 拖拽监听
                if (bindings.modifiers.drag) {
                    el.setAttribute('draggable', true);
                    el.addEventListener('dragstart', (ev) => {
                        evList.onDragStart(ev, el, bindings);
                    }, false);
                }

                // 放置监听
                if (bindings.modifiers.drop) {
                    el.addEventListener('dragover', evList.onDragOver, false);
                    el.addEventListener('drop', (ev) => {
                        evList.onDrop(ev, el, bindings);
                    }, false);
                }

                // 定位监听和调整顺序监听
                if (bindings.modifiers.locate) {
                    // 定位
                    el.addEventListener('dragenter', (ev) => {
                        setTimeout(() => {
                            evList.onLocateEnter(ev, el, bindings);
                        });
                    }, false);
                    el.addEventListener('dragleave', (ev) => {
                        evList.onLocateLeave(ev, el, bindings);
                    }, false);

                    // 调整顺序
                    el.setAttribute('draggable', true);
                    el.addEventListener('dragstart', (ev) => {
                        evList.onLocateDragStart(ev, el, bindings);
                    }, false);
                }
            },
            unbind: function (el, bindings) {
            }
        });
    }
};
