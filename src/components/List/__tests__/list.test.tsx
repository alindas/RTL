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

