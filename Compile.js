import Watcher from "./Watcher.js";

/**
 * 解析器
 */
class Compile {
    constructor(vm) {
        this.vm = vm;
        // 将网页上的元素放到内存中
        let fragment = this.node2Fragment(this.vm.$el);
        // 利用指定的数据编译内存中的元素
        this.buildTemplate(fragment);
        // 将编译好的内容重新渲染会网页上
        this.vm.$el.appendChild(fragment);
    }

    /**
     * 将节点放入节点碎片中国呢
     * @param app 网页上的元素
     * @return {DocumentFragment} 存储了所有元素的文档碎片对象
     */
    node2Fragment(app) {
        // 1.创建一个空的文档碎片对象
        let fragment = document.createDocumentFragment();
        // 2.编译循环取到每一个元素
        let node;
        while (node = app.firstChild) {
            // 注意点: 只要将元素添加到了文档碎片对象中, 那么这个元素就会自动从网页上消失
            fragment.appendChild(node);
        }

        // 返回存储了所有元素的文档碎片对象
        return fragment;
    }

    /**
     * 替换内存(文档碎片对象)中内容
     * @param fragment 文档碎片对象
     */
    buildTemplate(fragment) {
        fragment.childNodes.forEach(node => {
            // 需要判断当前遍历到的节点是一个元素还是一个文本
            if (this.vm.isElement(node)) {
                this.buildElement(node);

            } else {
                this.buildText(node);
                return;
            }
            this.buildTemplate(node);
        })
    }

    /**
     * 处理元素节点
     * @param node
     */
    buildElement(node) {
        // 判断是否是输入框
        if (node.nodeName == 'INPUT') {
            let attrs = [...node.attributes];
            attrs.forEach(attr => {
                if (attr.nodeName === 'v-model') {
                    const value = attr.nodeValue.split('.')
                        .reduce((value, current) => value[current], this.vm.$data);
                    node.value = value;
                    // 视图更新
                    new Watcher(this.vm, attr.nodeValue, newValue => {
                        node.value = newValue;
                    });

                    node.addEventListener('input', e => {
                        // 例如：obj.person.name 转化后为 keyArr = ['obj', 'person', 'name']
                        const keyArr = attr.nodeValue.split('.');
                        // 例如：keyArr经过slice(前闭后开的区间，前面索引的值包含，后面的不包含) 转化后为 keyArr2 = ['obj', 'person']
                        const keyArr2 = keyArr.slice(0, keyArr.length - 1);
                        // 例如：final = obj.person
                        const final = keyArr2.reduce((value, current) => value[current], this.vm.$data);
                        // 例如：final[keyArr[keyArr.length - 1]] = obj.person.name
                        final[keyArr[keyArr.length - 1]] = e.target.value;
                    });
                }
            });
        }
    }

    /**
     * 处理文本元素节点
     * @param textNode 文本元素节点
     */
    buildText(textNode) {
        // 双向绑定匹配的正则表达式
        const pattern = /\{\{\s*(\S+)\s*\}\}/;
        const template = textNode.nodeValue;
        const result_regex = pattern.exec(textNode.nodeValue);
        if (result_regex) {
            const value = result_regex[1].split('.')
                .reduce((value, current) => value[current], this.vm.$data);
            textNode.nodeValue = template.replace(pattern, value);
            // 创建订阅者
            const watcher = new Watcher(this.vm, result_regex[1], newValue => {
                textNode.nodeValue = template.replace(pattern, newValue);
            });
        }
    }
}

export default Compile;