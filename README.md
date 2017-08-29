| update | state | tips |
|-|-|-|
| 2017年08月25日 | 发布 | 第一次发布 |
| 2017年08月25日 | readme | 用法 |

开发
===
```javascript
npm install babel-cli // 工具依赖
yarn // 安装所需工具
npm run watch // 实时编译
```
用法
===
```html
// 被拖拽组件
<ul class='drag-box'>
    <li class='drag-item' v-for='(v, idx) in tasksSmall' :id='idx'
        v-drag-man.drag='{
            data: v,
        }'>{{v.title}}</li>
</ul>

// 放置容器
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
