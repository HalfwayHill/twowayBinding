import Dependency from './Dependency.js';

// 订阅者
class Watcher {
    constructor(vm, key, callback) {
        // Vue实例
        this.vm = vm;
        // Vue实例对应的属性
        this.key = key;
        // 回调函数 - 记录如何更新文本内容
        this.callback = callback;

        // 临时变量
        Dependency.temp = this;
        // 读取属性值 - 触发get函数
        key.split('.')
            .reduce((value, current) => value[current], this.vm.$data);
        // 防止重复添加订阅者
        Dependency.temp = null;
    }

    /**
     * 更新文本内容
     */
    update() {
        const value = this.key.split('.')
            .reduce((value, current) => value[current], this.vm.$data);
        this.callback(value);
    }
}

export default Watcher;