import Observer from "./Observer.js";
import Compile from "./Compile.js";

class Vue{
    constructor(options) {

        // 在vm中加入$el属性，挂载模版
        if (this.isElement(options.el)) {
            this.$el = options.el;
        } else {
            this.$el = document.querySelector(options.el);
        }

        // console.log(this.$el.childNodes);

        // 在vm中加入$data属性，挂载数据
        this.$data = options.data;

        if (this.$el) {
            // 数据劫持 - 拦截data所有属性的get/set
            new Observer(this.$data);
            // 模版解析 - 解析Vue指令
            new Compile(this);
        }
    }

    /**
     * 判断是否是一个DOM元素
     */
    isElement(node) {
        return node.nodeType === 1;
    }
}

/**
 * HTML模版解析 - 替换DOM
 * @param element Vue实例内挂载的元素
 * @param vm Vue实例
 * @constructor
 */
// function Compile(element, vm) {
//     // 在vm中加入$el属性，挂载元素
//     vm.$el = document.querySelector(element);
//     // document.createDocumentFragment() 创建文档碎片
//     const fragment = document.createDocumentFragment();
//     console.log(vm.$el.childNodes); // 第五张log图片
//
//     // 我们需要将这些子节点按序加入到文档碎片中，这样app-div中就没有元素渲染了
//     // let child;
//     // while (child = vm.$el.firstChild) {
//     //     fragment.append(child);
//     // }
//     //
//     // fragment_compile(fragment);
//     //
//     // // 替换文档碎片内容
//     // function fragment_compile(node) {
//     //     // 双向绑定匹配的正则表达式
//     //     const pattern = /\{\{\s*(\S+)\s*\}\}/
//     //     // 我们要替换的内容都是元素节点内容为3的元素
//     //     if (node.nodeType === 3) {
//     //         // 若是文本元素的模版，就进行模版解析
//     //         return;
//     //     }
//     //
//     //     // 若不是文本元素的模版，就继续遍历节点
//     //     node.childNodes.forEach(child => {
//     //         fragment_compile(child);
//     //     })
//     // }
// }

export default Vue;