import React from 'react';

import './index.css';

export type TListItem = {
  value: string;
};

export interface IListProps {
  list: TListItem[];
  deleteItem: (index: number) => void;
  valueChange: (index: number, value: string) => void;
  handleFinish: (index: number, e: React.FocusEvent | React.KeyboardEvent) => void;
}

const List: React.FC<IListProps> = (props) => {
  const { list, valueChange, deleteItem, handleFinish } = props;

  const liNodes = list.map((item, index) => (
    <li
      className="undo-list-item"
      key={index}
      // onClick={() => changeStatus(index)}
    >
      <input
        className="undo-list-input"
        value={item.value}
        onChange={e => valueChange(index, e.target.value)}
        onBlur={e => handleFinish(index, e)}
        onKeyUp={e => handleFinish(index, e)}
      />
      <div
        className="undo-list-delete"
        onClick={(e) => {
          e.stopPropagation();
          deleteItem(index);
        }}
      >
        -
      </div>
    </li>
  ));

  return (
    <div className="undo-list">
      <div className="undo-list-title">
        正在进行
        <div className="undo-list-count">
          {list.length}
        </div>
      </div>
      <ul className="undo-list-content">
        {liNodes}
      </ul>
    </div>
  );
};

export default List;
