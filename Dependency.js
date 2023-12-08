// 依赖 - 收集和通知订阅者
class Dependency {
    constructor() {
        // 订阅者数组 - 存放订阅者信息
        this.subscribers = [];
    }

    /**
     * 添加订阅者
     * @param sub
     */
    addSub(sub) {
        this.subscribers.push(sub);
    }

    /**
     * 通知订阅者
     */
    notify() {
        this.subscribers.forEach(sub => {
            sub.update();
        });
    }
}

export default Dependency;