

// ESLinte 插件格式

const plugin = {
  // 信息
  meta: {
    name: 'eslint-plugin-xxx',
    version: '0.1.0',
    description: '',
    coreVersion: '^3.x', // 兼容的 ESLint 版本范围，可以是字符串或数组。
    schema: [], // 插件配置项的模式对象数组（可选）
  },
  // 插件配置项的模式对象数组（可选）
  configs: {
    recommended: {
      plugin: ['eslint-plugin-xxx'],
      rules: {
        'rule1': 'error',
        'rule2': 'warn'
      }
    },
    all: {},
  },
  // 定义规则的核心逻辑
  rules: {
    'rule1':{
      // 规则元数据
      meta:{
        type: 'suggestion', // 建议性问题，不影响代码运行
        docs: {
          description: '',
          category: '',
          recommended: true,
          url: ''
        },
        fixable: null, // 可修复的规则，null 表示不可修复，'code' 或 'whitespace' 分别表示可修复代码或空白字符问题。
        schema: [], // 配置项的模式对象数组（可选）
      },
      create(context) {
        return {}
      }
    },
    'rule2':{
      // ...
    }

  },
  // 自定义处理器（可选）
  processors: {}
};