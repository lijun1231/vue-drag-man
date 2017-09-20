| update | state | tips |
|-|-|-|
| 2017年08月25日 | 发布 | 第一次发布 |
| 2017年08月25日 | readme | 用法 |
| 2017年09月06日 | 增加beforeDrag钩子 | - |
| 2017年09月09日 | 增加afterDropped钩子 | - |

todo
===
> - 增加钩子函数
> - 被拖拽项的值以其副本形式进行传递
> - 设置 drop的限制，并增加允许drop的框的高亮展示

开发
===
```javascript
npm install babel-cli // 工具依赖
yarn // 安装所需工具
npm run watch // 实时编译
```
安装：
```javascript
npm install vue-drag-man
```

基本用法
===
被拖拽组件：用 **v-drag-man.drag** 指令进行定义
```html
<ul class='drag-box'>
    <li class='drag-item' v-for='(v, idx) in tasksSmall' :id='idx'
        v-drag-man.drag='{
            data: v,
        }'>{{v.title}}</li>
</ul>
```

放置容器和容器中动态生成的实例
- 放置容器：用 **v-drag-man.drop** 指令进行定义
- 实例：用 **v-drag-man.locate** 指令进行定义，若有此指令，则实例顺序可被拖拽调整，若无此指令，则实例顺序不可调整

```html
<div class='drop-box'
    v-drag-man.drop='{
        pool: list,
    }'>
    // 实例列表 允许调整顺序
    <span class="drop-item" v-for='(v, idx) in list'
        v-drag-man.locate='{
            index: idx
    }'>{{v.title}}【{{idx}}】</span>
</div>
```
钩子函数
===
### beforeDrag
用途：用于被拖拽的对象
```html
<ul class='drag-box'>
    <li class='drag-item' v-for='(v, idx) in tasksSmall' :id='idx'
        v-drag-man.drag='{
            beforeDrag: setPid,
            data: v,
        }'>{{v.title}}</li>
</ul>
```
注意：增加了一个 **beforeDrag** 钩子 **setPid**
咱们在 methods 中定义一个 setPid 方法：
```javascript
methods: {
    setPid(transferingData) {
        // you can do anything with transferingData, which points to your tragging data set
    }
}
```
**setPid** 自带一个数据，它就是你正在拖拽的那个数据项

### afterDragged
用途：用于放置的容器
```html
<div class='drop-box'
    v-drag-man.drop='{
        afterDropped: setFilterOption,
        pool: list,
    }'>
    // 实例列表 允许调整顺序
    <span class="drop-item" v-for='(v, idx) in list'
        v-drag-man.locate='{
            index: idx
    }'>{{v.title}}【{{idx}}】</span>
</div>
```
注意：增加了一个 **afterDropped** 钩子 **setFilterOption**
咱们在 methods 中定义一个 **setFilterOption** 方法：
```javascript
methods: {
    setFilterOption(transferingData) {
        // you can do anything with transferingData, which points to your tragging data set
    }
}
```
同理，**setFilterOption** 自带一个参数，它也正是你正在拖拽的那个数据项
