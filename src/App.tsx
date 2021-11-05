import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from './components/Header';
import UndoList from './components/List';
import './App.css';
import { TListItem } from './components/List'

const App: React.FC = () => {
  const [undoList, setUndoList] = useState<TListItem[]>([]);
  const [backup, setBackup] = useState('');

  useEffect(() => {
    axios
      .get('/mock/undoList.json')
      .then((res) => {
        setUndoList(res.data.data);
      })
      .catch((e) => console.error(e));
  }, []);

  const valueChange = (index: number, value: string) => {
    !backup && setBackup(undoList[index].value);
    const newList = undoList.map((item, listIndex) => {
      if (index === listIndex) {
        return {
          ...item,
          value
        };
      }
      return item;
    });
    setUndoList(newList);
  };

  const handleFinish = (index: number, e: React.FocusEvent | React.KeyboardEvent) => {
    if(e.type === 'keyup' && (e as React.KeyboardEvent).keyCode !== 13) return;
    if((e as React.KeyboardEvent).keyCode === 13) {
      if(!undoList[index].value) {
        const newList = undoList.filter((_, listIndex) => listIndex !== index);
        setUndoList(newList);
      }
      backup && setBackup('');
      Promise.resolve()
      .then(() => (e.target as any).blur());
      return;
    }
    if(!backup) return;
    const newList = undoList.map((item, listIndex) => {
      if (index === listIndex) {
        return {
          ...item,
          value: backup
        };
      }
      return item;
    });
    setUndoList(newList);
    setBackup('');
  }

  const addUndoItem = (value: string) => {
    const newList = [
      ...undoList,
      {
        value
      }
    ] as TListItem[];
    setUndoList(newList);
  };

  const deleteItem = (index: number) => {
    const newList = [...undoList];
    newList.splice(index, 1);
    setUndoList(newList);
  };

  return (
    <div>
      <Header addUndoItem={addUndoItem} />
      <UndoList
        list={undoList}
        deleteItem={deleteItem}
        valueChange={valueChange}
        handleFinish={handleFinish}
      />
    </div>
  );
}

export default App;
