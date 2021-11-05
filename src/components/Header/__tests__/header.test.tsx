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
  it('初始渲染时', () => {
    expect(inputNode).toBeInTheDocument();
    expect(inputNode.value).toEqual('');
  })

  it('输入内容', () => {
    fireEvent.change(inputNode, inputEvent);
    expect(inputNode.value).toEqual('new todo');
  })

  it('提交内容', () => {
    // 输入框内容改变后回车提交，并将输入框内容置为空
    fireEvent.change(inputNode, inputEvent);
    const enterEvent = {
      keyCode: 13
    }
    fireEvent.keyUp(inputNode, enterEvent);
    expect(addUndoItem).toHaveBeenCalledTimes(1);
    expect(inputNode.value).toEqual('');
  })
})
