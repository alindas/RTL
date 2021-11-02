// App.tsx
import React, { useState } from 'react';

function Jest_1() {
  const [content, setContent] = useState('Hello World!');

  return (
    <div
      className="app"
      // 方便测试用例中获取 DOM 节点
      data-testid="container"
      onClick={() => {
        setContent('Hello Jack!');
      }}
    >
      {content}
    </div>
  );
}

export default Jest_1;
