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



#### 优先级

按照测试库的指导思想，在使用查询 API 时应该遵守一定的优先级（站在用户的使用角度，能直接用从页面上看到的作为选择器便不使用用户看不到的 `id、class` 等选择器）。

+ 常规的

1. + getByRole

2. + getByLabelText

1. + getByPlaceholderText

2. + getByText

1. + getByDisplayValue

+ 语义查询

1. + getByAltText

2. + getByTitle

+ 借助测试 Id

1. + getByTestId（考虑在生产环境中避免无意义的属性，可以借助 `babel-plugin-react-remove-properties `去除 `data-test` 测试辅助选择器）

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

> Testing Library 下还有一个高级库`@testing-library/user-event` ，其提供了比 fireEvent 更多的交互事件。
>
> [高级交互接口](https://testing-library.com/docs/ecosystem-user-event/)

[`fireEvent` 对应的 `eventMap` 事件集属性](https://github.com/testing-library/dom-testing-library/blob/main/src/event-map.js)



### 常用断言

```
toBeDisabled
toBeEnabled
toBeEmpty
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

顾名思义，用来生成一个测试用的函数。

```js
const test_click = jest.fn();

expect(test_click).toHaveBeenCalledTimes(1) // 测试是否调用了 1 次
```



### 配置文件

```properties
一下列举常用配置项目，所有配置属性访问官网手册 https://jestjs.io/docs/configuration

// 默认地，Jest 会运行所有的测试用例然后产出所有的错误到控制台中直至结束。
// bail 配置选项可以让 Jest 在遇到第一个失败后就停止继续运行测试用例
bail: 1,
// 指定 Jest 根目录，Jest 只会在根目录下测试用例并运行
roots: [],
// 指定测试覆盖率统计范围
collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
// 指定创建测试环境前的准备文件
setupFiles: ['react-app-polyfill/jsdom'],
// 指定测试环境创建完成后为每个测试文件编写的配置文件
setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
// 配置 Jest 匹配测试文件的规则的
testMatch: [
  '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
  '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
],
// 用于指定测试用例运行环境的
testEnvironment: 'jest-environment-jsdom-fourteen',
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
// 用于给模块路径映射到不同的模块
moduleNameMapper: {
  "\\.(css|less|scss|sss|styl)$": "jest-css-modules" | "identity-obj-proxy"
}

```



### 实践

```javascript
// 编写一条测试项目
test(describe, () => {
    render(<Component />);
    expect();
})

// describe 把多条测试项目包裹起来进行分组
describe(describe, () => {
  test1();
  test2()
})
```



## 演示 Demo

仓库：[React Testing Library](http://172.22.200.13:10080/RHEE/React-Testing-Library)

### 项目准备

``` 
npm i create-react-app -g // 全局安装脚手架

create-react-app React-Testing-Library // 创建项目

yarn add @types/react @types/react-dom --dev //  基于 TypeScript

yarn add axios // 使用 axios 处理异步请求
```

使用 `create-react-app` 脚手架创建的项目已经默认使用 Testing Library 作为测试方案，但是脚手架默认将工具的一些配置隐藏起来，如果希望将配置弹出并进行手动配置，则运行 `npm run eject` 。在弹出工程化配置后，只需要关注 `jest` 和 `bable` 两个配置。首先在根目录添加`jest.config.js` 和 `bable.config.js` 这两个文件，然后在 `package.json` 里把对应位置的配置迁移过来。(jest.config.js 按照配置说明重定义，[原因?](https://github.com/facebook/jest/issues/10297))

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

### 测试编写

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

在对应组件下添加 `__tests__` 目录，创建格式如 `*.test.[jt]s?(x)` 的测试文件。

```typescript
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
  list: [],
  deleteItem: jest.fn(),
  valueChange: jest.fn(),
  handleFinish: jest.fn()
}
let contentNode: HTMLElement;
let Counter: HTMLElement;
let listItemNode: HTMLElement;

beforeEach(() => {
  render(<List {...props}/>);
  contentNode = screen.getByRole('list');
  listItemNode = screen.queryByRole('listitem') as HTMLElement;
});

describe('测试 List 组件', () => {
  it('初始渲染', () => {
    // 初始渲染时列表项内容为空，计数器值为 0
    expect(listItemNode).toBeNull();
    Counter = screen.getByText(/0/i);
    expect(Counter).toBeInTheDocument();
  })

  props.list = [{
    "value": "listItem_one"
  }];

  it('删除列表项', () => {
    // 列表项不为空时，右上角计数器存在且值为列表长度
    Counter = screen.getByText(/1/i);
    expect(Counter).toBeInTheDocument();
    // 列表项删除按钮存在，点击将其删除
    let deleteBtn = listItemNode.querySelector('div') as HTMLElement;
    expect(deleteBtn).not.toBeNull();
    fireEvent.click(deleteBtn);
    expect(props.deleteItem).toHaveBeenCalledTimes(1);
    expect(listItemNode).toBeNull();
  })

  props.list = [{
    "value": "listItem_two"
  }];

  it('编辑列表项', () => {
    // 点击列表项后可将其内容修改
    fireEvent.click(listItemNode);
    let editInput = within(listItemNode).getByRole('textbox') as HTMLInputElement;
    const editValue = {
      target: {
        value: 'edit todo'
      }
    }
    fireEvent.change(editInput, editValue);
    expect(editInput.value).toEqual('edit todo');
    // 失去焦点后值还原
    fireEvent.blur(editInput);
    expect(editInput.value).toEqual('listItem_two');
    // 回车后可保存修改后的内容
    const keyUp = {
      keyCode: 13
    }
    fireEvent.keyUp(editInput, keyUp);
    expect(props.valueChange).toHaveBeenCalledTimes(1);
    expect(props.handleFinish).toHaveBeenCalledTimes(1);
    expect(editInput.value).toEqual('edit todo');
    // 将值修改为空并回车则删除列表项
    fireEvent.change(editInput, {
      target: {
        value: ''
      }
    });
    fireEvent.keyUp(editInput, keyUp);
    expect(editInput).toBeNull();
  })
})

```







## 参考资料

[Testing Library 官网文档](https://testing-library.com/docs/)

[React Testing library 使用总结](https://juejin.cn/post/6907052045262389255)

[Jest 官网文档](https://jestjs.io/zh-Hans/docs/getting-started)



