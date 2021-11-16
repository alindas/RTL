# 前端自动化测试：Testing Library 篇

## 引言

### 为什么要引入自动化测试

测试可以让开发者站在**用户的角度**考虑问题，通过测试的手段，确保组件的每个功能都可以正常地运行。

在编写单元测试时，很大情况下会对组件代码进行反复的调整，通过不断的打磨，避免了开发时考虑不周到的情况，从而提高组件的质量。对于变动不频繁的业务模块，也是同样的道理。

根据《Google 软件测试之道》一书中，对于测试认证级别的定义如下：

+ 级别 1

  + 使用测试覆盖率工具。
  + 使用持续集成。
  + 测试分级为小型、中型、大型。
  + 创建冒烟测试集合（主流程测试用例）。
  + 标记哪些测试是非确定性的测试（测试结果不唯一）。

+ 级别 2

  + 如果有测试运行结果为红色（失败）就不会发布。
  + 每次代码提交之前都要求通过冒烟测试。（自测，简单走下主流程）
  + 各种类型的整体代码覆盖率要大于50%。
  + 小型测试的覆盖率要大于10%。

+ 级别 3

  + 所有重要的代码变更都要经过测试。
  + 小型测试的覆盖率大于50%。
  + 新增重要功能都要通过集成测试的验证。

+ 级别 4

  + 在提交任何新代码之前都会自动运行冒烟测试。
  + 冒烟测试必须在30分钟内运行完毕。
  + 没有不确定性的测试。
  + 总体测试覆盖率应该不小于40%。
  + 小型测试的代码覆盖率应该不小于25%。
  + 所有重要的功能都应该被集成测试验证到。

+ 级别 5

  + 对每一个重要的缺陷修复都要增加一个测试用例与之对应。

  + 积极使用可用的代码分析工具。

  + 总体测试覆盖率不低于60%。

  + 小型测试代码覆盖率应该不小于40%。



### 测试工具的选择

Jest，Mocha，Testing Library  和 Enzyme 是前端自动化测试使用较广泛的工具。



### 可遵循的简单规则

<font size=4>**AAA 模式**：编排（Arrange）、执行（Act）、断言（Assert）</font>

一、编排

编排阶段可分为两部分。**渲染组件** 和 **获取所需要的 DOM 元素**。

二、执行

当把需要测试的内容准备好了后，便可以借助测试库的工具 API 执行模拟操作了。如使用 `React Testing Library` 的 `fireEvent` 模拟点击事件。（这一步非必须的，也可以直接对编排获取到的内容进行断言）

```
fireEvent.click(mockFn)
```

三、断言

断言也即是判断。通过 Jest 或 React Testing Library 内置的断言语句对上述内容进行判断，通过则 pass。



## 简介

[官网手册](https://testing-library.com/)

<font color=Blue>Testing Library</font> 是一个轻量级的测试解决方案，用于通过查询和与 DOM 节点交互（无论是用 `JsDOM `/ `Jest` 模拟还是在浏览器中）来测试网页。提供贴近于用户在页面中查找元素的方式查询节点。

Testing Library 可应用于各个主流框架（包括 `React`、`Angular` 和 `Vue`），并且可作为核心在 `Cypress` 测试框架中使用。

本文探究 **React Testing Library（RTL）**

### 思想

Testing Library 鼓励测试避免 **实现细节**（比如组件的内部状态、内部方法、生命周期、子组件），而强调关注与用户实际交互相似的内容。

> 编写的测试与软件用户的使用方式越相似，它们越能给测试带来信心。



## 核心

### 查询

#### 类型

在 **RTL** 中提供三种方式查询元素，分别是`getBy`，`queryBy`，`findBy`。如果要查询多元素，使用`xxxAllBy` 代替。差异如下：

| 查询类型      | 0 对应 | 1 对应   | >1 对应  | 异步/等待 await |
| ------------- | ------ | -------- | -------- | --------------- |
| getBy...      | 报错   | 返回     | 报错     | no              |
| queryBy...    | null   | 返回     | 报错     | no              |
| findBy...     | 报错   | 返回     | 报错     | yes             |
| getAllBy...   | 报错   | 返回数组 | 返回数组 | no              |
| queryAllBy... | [ ]    | 返回数组 | 返回数组 | no              |
| findAllBy...  | 报错   | 返回数组 | 返回数组 | yes             |

> 通常来说，getBy 用于查询正常存在的元素（找不到报错），queryBy 用于查询希望不存在的元素（找不到不报错），findBy 则用于查询需要等待的异步元素。
>
> 使用 *ByRole 会将隐藏元素名称读取为 ""。可考虑更好另一种查询方法，如仍需使用 *ByRole 进行查询可参考[官方手册](https://testing-library.com/docs/queries/byrole/#hidden)。	[问题详情](https://github.com/testing-library/dom-testing-library/issues/846)  



#### 优先级

按照测试库的指导思想，在使用查询 API 时应该遵守一定的优先级（站在用户的使用角度，能直接用从页面上看到的作为选择器便不使用用户看不到的 `id、class` 等选择器）。

+ 常规的

  + getByRole 查找具有`特定角色`的元素

  + getByLabelText 查找具有给定文本匹配的 `label` 元素

  + getByPlaceholderText 查找具有`占位符属性`的元素

  + getByText 查找具有`文本节点`的元素

  + getByDisplayValue 查找具有 `value` 的控件元素

+ 语义查询

  + getByAltText 查找具有 `alt` 属性，alt 对应的 text 文本匹配的元素

  + getByTitle 返回具有 `title` 属性，title 对应的 text 文本匹配的元素

+ 借助测试 Id

  + getByTestId（考虑在生产环境中避免无意义的属性，可以借助 `babel-plugin-react-remove-properties `去除 `data-test` 测试辅助选择器）

     ```properties
     // .bablerc
     {
       "env": {
         "production": {
           "plugins": ["react-remove-properties"]
         }
       }
     }
     ```



#### 实践

由于 Test Library 强调站在用户的角度进行测试，因此更偏向使用 DOM 上的 `Accessibility ` 的元素。（但有时候只能用样式选择器或直接使用样式选择器更有效率，只能说找到哲学与生活的**平衡点**就好）

查看 HTML 元素对应的 **ARIA role** 方法有以下几点：

一、借助 **Chrome** 开发者工具

元素(Elements) > 无障碍功能(Accessibility)

二、借助 RTL 提供的 `logRoles` API

```js
import { render, logRoles } from '@testing-library/react';

test('find ARIA role', () => {
	const { container } = render(<Component />);
	logRoles(container);
})
```

三、借助第三方插件

使用谷歌浏览器的插件可以更为简易地获取元素。

[`Testing library: which query`](https://chrome.google.com/webstore/detail/testing-library-which-que/olmmagdolfehlpjmbkmondggbebeimoh)

[`Testing Playground`](https://chrome.google.com/webstore/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano)



### 用户操作

借助 fireEvent 可以模拟实际用户产生的交互事件。

> Testing Library 下还有一个高级库[`@testing-library/user-event`](https://testing-library.com/docs/ecosystem-user-event/) ，其提供了比 fireEvent 更多的交互事件。

```
fireEvent(node: HTMLElement, event: Event)
```

[`fireEvent` 对应的 `eventMap` 事件集属性](https://github.com/testing-library/dom-testing-library/blob/main/src/event-map.js)



### 常用断言

RTL 扩展了 jest 的 api，定义了自己的断言函数，所有的断言函数包含在`@testing-library/jest-dom`包中。详见：[内置断言库](https://github.com/testing-library/jest-dom)

```
toBeDisabled
toBeEnabled
toBeEmptyDOMElement
toBeInTheDocument
toBeInvalid
toBeRequired
toBeValid
toBeVisible
toContainElement
toContainHTML
toHaveAttribute
toHaveClass
toHaveFocus
toHaveFormValues
toHaveStyle
toHaveTextContent
toHaveValue
toHaveDisplayValue
toBeChecked
toBePartiallyChecked
toHaveDescription
```



## Jest

使用 `RTL` 需要搭配 Jest ，所以我们先来 **"荒腔走板"** 地对 Jest 基础使用进行一个简单的学习。

### 介绍

**Jest**是一个测试框架，`RTL` 是一个测试解决方案。`RTL` 存在的意义是通过更优美、功能更强大的方式去完成测试的编写。



### 断言匹配器

#### 判断真假

1. toBeNull

2. toBeUndefined

3. toBeDefined

4. toBeTruthy

5. toBeFalsy

#### 数字相关

1. toBeGeaterThan 大于某个数

2. toBeGeaterThanOrEqual 大于或等于

3. toBeLessThan 小于某数

4. toBeLessThanOrEqual 小于或等于

5. toBeCloseTo 浮点数的相等判断

#### not 修饰符

与期望相反的匹配

#### 字符串匹配

1. toMatch

#### 数组，集合相关

1. toContain 判断数组或集合是否包含某个元素

2. toHaveLength 判断数组的长度

#### 函数相关

1. toHaveBeenCalled 判断 mockFunc 是否被调用

2. toHaveBeenCalledWith('_test_param') 调用接收的参数是否为 _test_param

3. toHaveBeenCalledTimes(2) 调用的次数

4. toHaveReturned 是否有返回值

5. toHaveReturnedWith('_test_return') 返回值是否为 _test_return

#### 异常相关

1. toThrow 判断抛出的异常是否符合预期



### Mock 函数

Jest 的三个常用 Mock 函数 API 是 `jest.fn()`，`jest.spyOn()`，`jest.mock()`。

在单元测试中，更多时候并不需要关心内部调用方法的执行过程和结果，只需要确认是否被正确调用即可。

Mock 函数提供三种特性：

+ 捕获函数调用情况
+ 设置函数返回值
+ 改变函数内部实现

**一、Jest.fn()**

默认返回 `undefined` 作为返回值。

```js
const test_click = jest.fn(1,2,3);

expect(test_click).toHaveBeenCalledTimes(1) // 测试是否调用了 1 次
expect(test_click).toHaveBeenCalledWith(1,2,3) // 测试是否调用了 1 次
```

也可以自定义返回值，内部实现

```
// 自定义返回值
let customFn = jest.fn().mockReturnValue('default');
expect(customFn()).toBe('default');

// 自定义内部实现
let customInside = jest.fn((num1, num2) => num1 + num2);
expect(customInside(10, 10)).toBe(20);

// 返回 Promise
test('jest 返回 Promise', async() => {
    let mockFn = jest.fn().mockResolveValue('promise');
    let result = await mockFn();
    expect(result).toBe('promise');
    expect(Object.prototype.toString.call(mockFn())).toBe('[object Promise]')
})

```



### 分组和钩子

使用 `describe` 关键字对测试进行包裹。

```js
describe('分别测试', () => {
  /** testItem **/
  /** hook 函数 **/
}
```

>需要注意的是，describe 块的运行顺序总是在 test 函数的执行顺序之前。[疑问？](https://stackoverflow.com/questions/56240783/jest-understanding-execution-order-of-a-describe-and-it)

```js
// describe 块内程序的执行顺序()
describe('1', () => {
  console.log('1');
  describe('2', () => { console.log('2'); });
  describe('3', () => {
    console.log('3');
    describe('4', () => { console.log('4'); })
    describe('5', () => { console.log('5'); })
  })
  describe('6', () => { console.log('6'); })
})
describe('7', () => {
  console.log('7');
  it('(since there has to be at least one test)', () => { console.log('8') });
})

// 测试结果，顺序 1-8
```

可利用 jest 提供的**钩子函数**对单例进行数据准备工作。

Jest 提供的**钩子函数**有：

1. beforeEach

2. beforeAll

3. afterEach

4. afterAll

需要注意`describe` 外部使用的钩子函数和在内部的钩子函数执行顺序：

```js
beforeAll(() => console.log('outside beforeAll'));
beforeEach(() => console.log('outside beforeEach'));
afterAll(() => console.log('outside afterAll'));
afterEach(() => console.log('outside afterEach'));

describe('', () => {
	beforeAll(() => console.log('intside beforeAll'));
    beforeEach(() => console.log('intside beforeEach'));
    afterAll(() => console.log('intside afterAll'));
    afterEach(() => console.log('intside afterEach'));

    test('test1', () => console.log('test1 run'));
    test('test2', () => console.log('test2 run'));
})

/** 结果
outside beforeAll
inside beforeAll

outside beforeEach
inside beforeEach
test1 run
inside afterEach
outside afterEach

outside beforeEach
inside beforeEach
test2 run
inside afterEach
outside afterEach

inside afterAll
outside afterAll
**/
```

### 测试异步模块

在包括测试的函数里传入 **done** 参数，Jest 会等 done 回调函数执行结束后结束测试。若 done 从未被调用，则测试用例执行失败，同时输出超时错误。

```js
import timeout from './timeout'

test('测试timer', (done) => {
    timeout(() => {
        expect(2+2).toBe(4)
        done()
    })
})
```

如果异步函数返回 Promise，则可以直接将这个 Promise 返回，Jest 会等待这个 Promise 的 resolve 状态。如果期待 Promise 被 Reject，则需要使用`.catch`方法，并添加`expect.assertions`来验证一定数量的断言被调用。

```js
test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});

test('the fetch fails with an error', () => {
  expect.assertions(1);
  return fetchData().catch(e => expect(e).toMatch('error'));
});

test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});

test('the fetch fails with an error', () => {
  return expect(fetchData()).rejects.toMatch('error');
});
```

借助 async / await 

```js
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});
```

在测试 `React` 组件时，经常能碰到在 `useEffect` 中更新 State 或异步更新 State 的场景，这时测试断言的处理需要借助 `Act` API 。[案例说明和使用方法](https://github.com/threepointone/react-act-examples/blob/master/sync.md)



### 配置文件

```properties
// 一下列举常用配置项目，所有配置属性访问官网手册 https://jestjs.io/docs/configuration

// 默认地，Jest 会运行所有的测试用例然后产出所有的错误到控制台中直至结束。
// bail 配置选项可以让 Jest 在遇到第一个失败后就停止继续运行测试用例，默认值 0
bail: 1,
// 每次测试前自动清除模拟调用和实例，相当于每次测试前都调用 jest.clearAllMocks，默认 false
clearMocks: false,
// 指示在执行测试时是否应收集覆盖率信息，通过使用覆盖率收集语句改造所有已执行文件，所以开启后可能会显著减慢
// 测试速度，默认 false
collectCoverage: false,
// 指定测试覆盖率统计范围,使用 glob 模式匹配，默认 undefined
collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
// 指定忽略匹配的覆盖范围,默认 ["/node_modules"]
coveragePathIgnorePatterns: ["/node_modules/"],
// 配置一组在所有测试环境中可用的全局变量, 默认 {}
globals: {},
// 用于给模块路径映射到不同的模块, 默认 null
moduleNameMapper: {
  "\\.(css|less|scss|sss|styl)$": "jest-css-modules" | "identity-obj-proxy"
}
// 指定 Jest 根目录，Jest 只会在根目录下测试用例并运行
rootDir: './',
// 设置 Jest 搜索文件的目录路径列表，默认 []
roots: [],
// 指定创建测试环境前的准备文件,针对每个测试文件都会运行一次
setupFiles: ['react-app-polyfill/jsdom'],
// 指定测试环境创建完成后为每个测试文件编写的配置文件
setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
// 配置 Jest 匹配测试文件的规则, 使用 glob 规则
testMatch: [
  '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
  '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
],
// 用于指定测试用例运行环境，默认 node
testEnvironment: 'jsdom',
// 配置文件处理模块应该忽略的文件
transformIgnorePatterns: [
  '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
  '^.+\\.module\\.(css|sass|scss)$'
],
// 指定转换器: js jsx ts tsx 使用 babel-jest 进行转换 css 使用 cssTransform.js 进行转换 其他文件使用 fileTransform.js
transform: {
  '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
  '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)':
  '<rootDir>/config/jest/fileTransform.js'
},
// 转化器忽略文件: node_modules 目录下的所有 js jsx ts tsx cssModule 中的所有 css sass scss
transformIgnorePatterns: [
  '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
  '^.+\\.module\\.(css|sass|scss)$'
],
// 测试超时时间，默认 5000 毫秒
testTimeout: 5000


```



### 实践与调试

> 当一个测试失败了，应该首先检查单独运行该测试用例是否失败。只需要将 `test` 改为 `test.only` 便可。

```javascript
// 编写一条测试
test(describe, () => {
    render(<Component />);
    expect();
})

// describe 把多条测试包裹起来进行分组
describe(describe, () => {
  test('test1', fn);
  test('test2', fn);
  test.only('test3', fn); // 再次运行测试，便只会对该单列进行测试
})
```

> 当需要在终端查看查找到的 Dom 元素时，使用 prettyDOM 对元素进行包括，便可浏览贴近 HTML 结构的结果，当传递 null 时，prettyDOM 返回整个文档的渲染结果。

```js
const div = container.querySelector('div');
console.log(prettyDOM(div));
```



## 演示 Demo

仓库：[React Testing Library](http://172.22.200.13:10080/RHEE/React-Testing-Library)

### 项目准备

```shell
npm i create-react-app -g // 全局安装脚手架

create-react-app React-Testing-Library // 创建项目

yarn add @types/react @types/react-dom --dev //  基于 TypeScript

yarn add axios // 使用 axios 处理异步请求
```

使用 `create-react-app` 脚手架创建的项目已经默认使用 Testing Library 作为测试方案，但是脚手架默认将工具的一些配置隐藏起来，如果希望将配置弹出并进行手动配置，则运行 `npm run eject` 。在弹出工程化配置后，只需要关注 `jest` 和 `bable` 两个配置。首先在根目录添加`jest.config.js` 和 `bable.config.js` 这两个文件，然后在 `package.json` 里把对应位置的配置迁移过来。(jest.config.js 按照配置说明重定义，[疑问?](https://github.com/facebook/jest/issues/10297))

```js
// jest.config.js
const Config = {
  bail: 1,
  clearMocks: true,
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  rootDir: './',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.[jt]s?(x)'],
  testPathIgnorePatterns: [
    '\\\\node_modules\\\\',
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "identity-obj-proxy"
  }

};

module.exports = Config;
```



创建`tests` 文件夹，添加 `setupTests.js` 文件，然后在 `jest.config.js` 添加 setupFilesAfterEnv 配置进行覆盖。

```
// setupTest.js
// 导入 extend-expect 目的是 rtl 的一些断言需要建立在这个库上，如 toBeInTheDocument
import '@testing-library/jest-dom/extend-expect';

// jest.config.js
setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js']
```

新建 `components` 文件夹，添加 `Header` 和 `List` 两个组件。

`Header`: 在输入框中输入 toDo 内容，回车添加到 `List` 组件中。

`List`:  一个展示所有 ToDo 项的列表，可以进行点击编辑或删除。

（具体组件功能结构在此不一一陈列）

### 开展测试

#### 需求分析

+ Header 组件
  + `input` 初始输入框为空
  + `input` 能输入内容
  + `input` 回车提交内容
  + `input` 提交后输入框置空

+ List 组件

  + 列表为空，右上角计数器值为 0

  + 列表不为空，右上角计数器存在且值为列表长度，列表项删除按钮存在，点击可将其删除

  + 列表不为空，点击列表项内容可将其修改，回车后保存修改后的内容



#### 测试编写

在对应组件下添加 `__tests__` 目录，创建格式如 `*.test.[jt]s?(x)` 的测试用例。

```tsx
// header.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Header from '../index';

let inputNode: HTMLInputElement;
const addUndoItem = jest.fn();
const inputEvent = {
  target: {
    value: 'new todo'
  }
}

beforeEach(() => {
  render(<Header addUndoItem={addUndoItem} />);
  inputNode = screen.getByRole('textbox') as HTMLInputElement;
});

describe('测试 Header 组件', () => {
  it('初始渲染时输入框为空', () => {
    expect(inputNode).toBeInTheDocument();
    expect(inputNode.value).toEqual('');
  })

  it('输入框能输入内容', () => {
    fireEvent.change(inputNode, inputEvent);
    expect(inputNode.value).toEqual('new todo');
  })

  it('输入框回车提交内容并将输入框置空', () => {
    fireEvent.change(inputNode, inputEvent);
    const enterEvent = {
      keyCode: 13
    }
    fireEvent.keyUp(inputNode, enterEvent);
    expect(addUndoItem).toHaveBeenCalledTimes(1);
    expect(inputNode.value).toEqual('');
  })
})

// list.test.tsx
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';

import List, { IListProps } from '../index';

const props: IListProps = {
  list: [{
    value: 'list item'
  }],
  deleteItem: jest.fn(),
  valueChange: jest.fn(),
  handleFinish: jest.fn()
}
let Counter: HTMLElement;
let listItemNode: HTMLElement[];

beforeEach(() => {
  render(<List {...props}/>);
  listItemNode = screen.queryAllByRole('listitem') as HTMLElement[];
});

describe('测试 List 组件', () => {
  it('初始渲染', () => {
    // 设置空白数据
    let {
      deleteItem,
      valueChange,
      handleFinish
    } = props;
    let blank = {
      list: [],
      deleteItem,
      valueChange,
      handleFinish
    }
    // 此处重新渲染从中取出 container 容器
    const { container } = render(<List {...blank}/>);
    const li = container.querySelector('li');
    // 初始渲染时列表项内容为空，计数器值为 0
    expect(li).toBeNull();
    Counter = screen.getByText(/0/i);
    expect(Counter).toBeInTheDocument();
  })

  it('删除列表项', () => {
    // 列表项不为空时，右上角计数器存在且值为列表长度
    expect(listItemNode).toHaveLength(1);
    Counter = screen.getByText(/1/i);
    expect(Counter).toBeInTheDocument();
    // 列表项删除按钮存在，点击将其删除
    let deleteBtn = listItemNode[0].querySelector('div') as HTMLElement;
    expect(deleteBtn).not.toBeNull();
    fireEvent.click(deleteBtn);
    expect(props.deleteItem).toHaveBeenCalledTimes(1);
  })

  it('编辑列表项', () => {
    // 点击列表项后可将其内容修改
    fireEvent.click(listItemNode[0]);
    let editInput = within(listItemNode[0]).getByRole('textbox') as HTMLInputElement;
    const editValue = {
      target: {
        value: 'edit todo'
      }
    }
    // 检查修改回调调用次数
    fireEvent.change(editInput, editValue);
    expect(props.valueChange).toHaveBeenCalledTimes(1);
    const keyUp = {
      keyCode: 13
    }
    // handleFinish 在输入框失去焦点和回车确认时触发事件
    fireEvent.keyUp(editInput, keyUp);
    // 注意，toHaveBeenCalledTimes 断言是记录历史调用次数，
    // 所有在这里想要判断 valueChange 不被调用，参数应该为 1 而不是 0
    expect(props.valueChange).toHaveBeenCalledTimes(1);
    // change 直接修改 input 的 value 值，不触发失焦事件
    expect(props.handleFinish).toHaveBeenCalledTimes(1);
  })
})

```

> 编写测试时需要注意的是，如果组件的更新动作是交由外部进行处理的，便不能期待进行某些操作后能得到与业务中一样的反馈，应该通过测试回调函数的响应的侧面验证其功能的可行性。

### 其他场景

#### 异步操作

对于测试需要等待的响应事件或 `Promise`，使用 `await` 或 `then` 来进行处理。

```tsx
// 场景一
// 点击按钮后异步更新其 textContent 文本，可以借助 findBy 异步查询 API 查找需要等待更新的元素
const button = screen.getByRole('button', {name: 'Click Me'})
fireEvent.click(button)
await screen.findByText('Clicked once')
fireEvent.click(button)
await screen.findByText('Clicked twice')

// 场景二
// 需要等待回调函数的结果，使用 waitFor 对断言进行判断
await waitFor(() => expect(mockAPI).toHaveBeenCalledTimes(1))

// 场景三
// 需要等待从 DOM 中删除元素
waitForElementToBeRemoved(document.querySelector('div.getOuttaHere')).then(() =>
  console.log('Element no longer in DOM'),
)
```

#### Rudux 测试

对于特别复杂的 `redux`，可以选择对其 `reducer` 和 `effect` 使用基本的单元测试。更多场景下，对 `redux connect` 的组件使用 `集成测试` 。可以显式传递 `mock store` ，也可以使用  `Redux Provider` 包裹组件。

 另一测试方案是单独测试 `redux` 和组件，单独导入未进行 `connect` 连接的组件，使用 `Mock` 方法模拟其 `dispatch`测试响应性。 

[官网案例](https://redux.js.org/usage/writing-tests#connected-components)

[测试 Redux 连接的组件](https://hackernoon.com/unit-testing-redux-connected-components-692fa3c4441c)

```js
// 建立带有 redux 测试的自定义 render, 后续测试集成组件便可以使用该自定义 render
// test-utils.jsx
import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
// Import your own reducer
import reducer from '../reducer'

function render(
  ui,
  {
    initialState,
    store = createStore(reducer, initialState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react'
// override render method
export { render }

```



## 问题收集

+ formatMessage not initialized yet, you should use it after react app mounted #2156.

  [参考资料一](https://testing-library.com/docs/example-react-intl/)

  [参考资料二](https://github.com/umijs/umi/issues/2156)

+ Could not find required `intl` object. <IntlProvider> needs to exist in the component ancestry. Using default message as fallback



## 参考资料

[Testing Library 官网文档](https://testing-library.com/docs/)

[React Testing library 使用总结](https://juejin.cn/post/6907052045262389255)

[Jest 官网文档](https://jestjs.io/zh-Hans/docs/getting-started)



