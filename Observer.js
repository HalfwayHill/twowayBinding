import Dependency from "./Dependency.js";

/**
 * 数据劫持类
 */
class Observer {
    constructor(data) {
        this.observer(data);
    }
    observer(obj) {
        // 进行深层递归遍历时，若属性值不是对象类型，则不向下遍历
        if (obj && typeof obj === 'object') {
            // 遍历取出传入对象的所有属性, 给遍历到的属性都增加get/set方法
            for (let key in obj) {
                this.defineReactive(obj, key, obj[key])
            }
        }
    }

    /**
     * 数据劫持 - 拦截data所有属性的get/set
     * @param obj 需要操作的对象
     * @param attr 需要新增get/set方法的属性
     * @param value 需要新增get/set方法属性的取值
     * @return {*}
     */
    defineReactive(obj, attr, value) {
        // 如果属性值是个对象类型，那么也需要对该对象的所有属性进行数据劫持
        this.observer(value);
        const dep = new Dependency();
        Object.defineProperty(obj, attr, {
            enumerable: true,
            configurable: true,
            get() {
                // console.log(`访问了属性: ${attr} -> value: ${value}`);
                // 订阅者实例加入依赖实例的数组中
                Dependency.temp && dep.addSub(Dependency.temp);
                return value;
            },
            set: (newValue) => {
                // 判断当前输入的新值是否与旧值相等，优化措施
                if (value !== newValue) {
                    // 如果给属性赋值的新值又是一个对象, 那么也需要给这个对象的所有属性添加get/set方法
                    value = newValue;
                    this.observer(newValue);
                    dep.notify();
                    // console.log(`属性(${attr})的值(${value})被修改为：-> ${newValue}`);
                }
            }
        })
    }
}

export default Observer;