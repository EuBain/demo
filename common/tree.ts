const data = [
  {
    value: 1,
    // children: Array(12000).fill({
    //   value: 6,
    //   children: [
    //     {
    //       value: 3,
    //       children: [{ value: 6 }, { value: 7 }],
    //     },
    //     {
    //       value: 4,
    //       children: [{ value: 3 }, { value: 4 }],
    //     },
    //     {
    //       value: 5,
    //     },
    //   ],
    // }),
  },
  {
    value: 2,
    children: [{ value: 4 }, { value: 5 }],
  },
  {
    value: 3,
    children: [{ value: 6 }],
  }
];

// 深度优先遍历
// 迭代
// 时间复杂度O(n)
function dfs_iterate(data: any[], callback: Function) {
  let stack = [];
  stack.push(...data.reverse());
  while (stack.length > 0) {
    console.log(stack);
    let node = stack.pop();
    callback(node.value);
    let nodeChildren = node.children;
    if (nodeChildren && nodeChildren.length > 0) {
      stack.push(...node.children.reverse());
    }
  }
}

// dfs_iterate(data,(data) => {console.log(data)})

// 递归
function dfs(data: any[], callback: Function) {
  data.forEach((item) => {
    callback(item.value);
    let nodeChildren = item.children;
    if (nodeChildren && nodeChildren.length > 0) {
      dfs(nodeChildren, callback);
    }
  });
}

// dfs(data,(data) => {console.log(data)})

// 广度优先遍历
      // 迭代
      // 一层一层的遍历
      function bfs_iterate(tree, callback) {

        let queue = [...tree]
        while (queue.length) {
            // 先将放入数组中的节点取出,后续子节点依次放入
            let node = queue.shift()
            callback(node.value)
            if (node.children) {
                queue.push(...node.children)
            }
        }
    }



// 树状结构数组转化树状结构
function listToTreeSimple(data) {
  const res = []

  data.forEach((item)=> {
    const parent = data.find((node) => node.id === item.parentId)
    if(parent) {
      parent.children
    }
  }) 
}


