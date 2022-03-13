---
lang: zh-CN
title: 抽象工厂模式
description: 设计模式 - 抽象工厂模式
date: 2022-03-13
sidebar: auto
---

# 抽象工厂模式

**工厂模式** （Factory Pattern），根据输入的不同返回不同类的实例，一般用来创建同一类对象。工厂方式的主要思想是**将对象的创建与对象的实现分离**。

**抽象工厂** （Abstract Factory）：通过对类的工厂抽象使其业务用于对产品类簇的创建，而不是负责创建某一类产品的实例。关键在于使用抽象类制定了实例的结构，调用者直接面向实例的结构编程，**从实例的具体实现中解耦**。

我们知道 JavaScript 并不是强面向对象语言，所以使用传统编译型语言比如 JAVA、C#、C++ 等实现的设计模式和 JavaScript 不太一样，比如 JavaScript 中没有原生的类和接口等（不过 ES6+
渐渐提供类似的语法糖），我们可以用变通的方式来解决。最重要的是设计模式背后的核心思想，和它所要解决的问题。

## 你曾见过的抽象工厂模式

还是使用[工厂模式](./factory.md)的案例。

你再次去到一家麦当劳，点了汉堡包、薯条、鸡块。而你点的食物基本上都具有相同的属性，最起码都可以吃，然后基本需要油炸。相同的，你去另外一家麦当劳，基本也可以点同样的东西，那么这两家麦当劳就具有同样的功能结构。

上面的场景都是属于抽象工厂模式的例子。菜品属于抽象产品类，用于制定具体产品菜类所具备的属性，而麦当劳和之前的工厂模型一样，负责具体的生产产品实例，访问者通过麦当劳获取想要的产品。

同时，麦当劳功能也可以被抽象出来，基础这个类的麦当劳实例都最有生成麦当劳食物的功能，这样也完成了抽象类对实例的结构约束。

在类似场景中，这些例子有特点：只要实现了抽象类的实例，都实现了抽象类制定的结构。

## 实例的代码实现

我们知道 JavaScript 并不强面向对象，也没有提供抽象类（至少目前没有提供），但是可以模拟抽象类。用对 `new.target` 来判断 `new` 的类，在父类方法中 `throw new Error()`
，如果子类中没有实现这个方法就会抛错，这样来模拟抽象类：

```javascript
class AbstractClass1 {
  constructor() {
    // 使用 new.target 来判断 new 的类
    if (new.target === AbstractClass1) {
      throw new Error('抽象类不能直接实例化')
    }
  }

  operate() {
    throw new Error('抽象方法不能调用')
  }
}

const AbstractClass2 = function () {
  if (new.target === AbstractClass2) {
    throw new Error('抽象类不能直接实例化')
  }
}

AbstractClass2.prototype.operate = function () {
  throw new Error('抽象方法不能调用')
}


// 测试用例
expect(() => new AbstractClass1).toThrowError('抽象类不能直接实例化')
expect(() => new AbstractClass2).toThrowError('抽象类不能直接实例化')
```

下面用 JavaScript 将上面介绍的麦当劳例子实现一下。

```javascript
class Dish {
  static orderDish(type) {
    switch (type) {
      case '汉堡包':
        return new Hamburger();
      case '薯条':
        return new Chips();
      default:
        throw new Error('本店没有此道菜')
    }
  }
}

// 抽象类
class Dish {
  constructor() {
    if (new.target === Dish) {
      throw new Error('抽象类不能直接实例化!')
    }
  }

  // 可以吃
  eat() {
    throw new Error('抽象方法不能调用!');
  }
}

class Hamburger extends Dish {
  constructor() {
    super();
    this.type = '汉堡包'
  }

  eat() {
    return this.type;
  }
}

class Chips extends Dish {
  constructor() {
    super();
    this.type = '薯条'
  }

  eat() {
    return this.type;
  }
}

// 测试用例
it('实现餐厅菜品抽象类', () => {
  expect(() => new Dish).toThrowError('抽象类不能直接实例化');

  const food1 = Dish.orderDish('汉堡包');
  expect(food1.eat()).toBe('汉堡包')
  const food2 = Dish.orderDish('薯条');
  expect(food2.eat()).toBe('薯条')
})
```

这里的`Dish`类是抽象产品类，而继承该类的子类需要实现它的方法`eat`。

上面的实现将产品的功能结构抽象出来成为抽象产品类。事实上我们还可以更进一步，将工厂类也使用抽象类约束一下，也就是抽象工厂类，比如这个麦当劳可以做汉堡包，另一个麦当劳也可以做汉堡包，存在共同的功能结构，就可以将共同结构作为抽象类抽象出来，实现如下：

```javascript
class AbstractRestaurant {
  constructor() {
    if (new.target === AbstractRestaurant) {
      throw new Error('抽象类不能直接实例化!')
    }
    this.signBoard = '麦当劳';
  }

  // 抽象方法 做菜
  createDish() {
    throw new Error('抽象方法不能调用')
  }
}

// 菜 抽象类
class AbstractDish {
  constructor() {
    if (new.target === AbstractRestaurant) {
      throw new Error('抽象类不能直接实例化!')
    }
    this.kind = '菜品';
  }

  eat() {
    throw new Error('抽象方法不能调用')
  }
}

class Restaurant extends AbstractRestaurant {
  constructor() {
    super();
  }

  createDish(type) {
    switch (type) {
      case '汉堡包':
        return new Hamburger();
      case '薯条':
        return new Chips();
      default:
        throw new Error('本店没有此道菜')
    }
  }
}

class Hamburger extends AbstractDish {
  constructor() {
    super();
    this.type = '汉堡包'
  }

  eat() {
    return this.type;
  }
}

class Chips extends AbstractDish {
  constructor() {
    super();
    this.type = '薯条'
  }

  eat() {
    return this.type;
  }
}
```

## 抽象工厂模式的通用实现

我们提炼一下抽象工厂模式，饭店是工厂（Factory），菜品种类是抽象类（AbstractFactory），而实现抽象类的菜品是具体的产品（Product），通过工厂拿到实现了不同抽象类的产品，这些产品可以根据实现的抽象类被区分为类簇。主要有下面几个概念：

- **Factory** ：工厂，负责返回产品实例；

- **AbstractFactory** ：虚拟工厂，制定工厂实例的结构；

- **Product** ：产品，访问者从工厂中拿到的产品实例，实现抽象类；

- **AbstractProduct** ：产品抽象类，由具体产品实现，制定产品实例的结构；

![abstract-factory.png](/images/docs/design-patterns/abstract-factory.png)

下面为通用实现：

```javascript
// 工厂抽象类
class AbstractFactory {
  constructor() {
    if (new.target === AbstractFactory) {
      throw new Error('抽象类不能直接实例化!')
    }
  }

  // 抽象方法
  createProduct() {
    throw new Error('抽象方法不能调用!')
  }
}

// 具体工厂
class Factory extends AbstractFactory {
  constructor() {
    super();
  }

  createProduct(type) {
    switch (type) {
      case 'Product1':
        return new Product1();
      case 'Product2':
        return new Product2();
      default:
        throw new Error('当前没有这个产品')
    }
  }
}

// 抽象产品类
class AbstractProduct {
  constructor() {
    if (new.target === AbstractFactory) {
      throw new Error('抽象类不能直接实例化!')
    }
  }

  // 抽象方法
  operate() {
    throw new Error('抽象方法不能调用!')
  }
}

// 具体产品
class Product1 extends AbstractProduct {
  constructor() {
    super();
    this.type = 'Product1';
  }

  operate() {
    return this.type;
  }
}

// 具体产品
class Product2 extends AbstractProduct {
  constructor() {
    super();
    this.type = 'Product2';
  }

  operate() {
    return this.type;
  }
}


// 测试用例
it('通用实现', () => {
  const factory = new Factory();
  const product1 = factory.createProduct('Product1');
  expect(product1.operate()).toBe('Product1')
  const product2 = factory.createProduct('Product2');
  expect(product2.operate()).toBe('Product2')
})
```

如果希望增加第二个类簇的产品，除了需要改一下对应工厂类之外，还需要增加一个抽象产品类，并在抽象产品类基础上扩展新的产品。

我们在实际使用的时候不一定需要每个工厂都继承抽象工厂类，比如只有一个工厂的话我们可以直接使用工厂模式，在实战中灵活使用。

## 优缺点

抽象模式的优点：抽象产品类将产品的结构抽象出来，访问者不需要知道产品的具体实现，只需要面向产品的结构编程即可，**从产品的具体实现中解耦**；

抽象模式的缺点：

1. **扩展新类簇的产品类比较困难**，因为需要创建新的抽象产品类，并且还要修改工厂类，违反开闭原则；
2. 带来了**系统复杂度**，增加了新的类，和新的继承关系

## 使用场景

如果一组实例都有相同的结构，那么就可以使用抽象工厂模式。

## 工厂模式与抽象工厂模式的区别

- 工厂模式：主要关注单独的产品实例的创建；
- 抽象工厂模式：主要关注产品类簇实例的创建，如果产品类簇只有一个产品，那么这时的抽象工厂模式就退化为工厂模式了；
