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
