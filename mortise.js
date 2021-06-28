/*!
 * Mortise JavaScript Library v1.0.0
 * https://github.com/onemue/mortise
 *
 * Author: onemue
 * Date: 2021-06-15 11:42:39
 */
(function () {
  let root = this; // root
  let __Mortises = []; // 大写是元素
  let __monitor = {};
  let __observers = {};
  let __rules = {
    number: '0-9',
    char: 'a-zA-Z',
    capital: 'A-Z',
    lowercase: 'a-z',
    chinese: '\u4e00-\u9fa5',
    symbol: `~!@#$%^&*()-_=+[]{}\\|;:'",.<>/?`
  };
  let __complexRule = {};
  // window.onload = Mortise;

  function Mortise() {
    observer();
    __Mortises = document.getElementsByTagName('input'); // 存放 __Mortises
    for (let i = 0; i < __Mortises.length; i++) {
      const element = __Mortises[i];
      let mortises = element.getAttribute('mortise'); // 小写是类型
      // console.log(!mortises);
      if (mortises) __addMonitor(element);
    }
    for (const key in __monitor) {
      if (Object.hasOwnProperty.call(__monitor, key)) {
        const element = __monitor[key];
        const mortises = element.getAttribute('mortise');
        __mortiseSolve(element, mortises);
        __mortiseObserver(element);
      }
    }
  };

  function __mortiseSolve(element, mortises) {
    if (typeof mortises === 'string') {
      // 判断js是否存在大写字母
      let ifCapitalReg = /[A-Z]/g;
      if (ifCapitalReg.test(mortises)) {
        console.warn(`The type "${mortises}" should be all lowercase letters`);
        mortises = mortises.toLowerCase();
      }

      // 类型处理
      __setSolveFuncs(element, mortises);
    }
  }

  /**
   * mortise 观察者
   * @param {Node} element 被观察的对象
   */
  function __mortiseObserver(element) {
    // 观察mortise，如果发生改变调用mortise初始化
    const observer = new MutationObserver(function (mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' || mutation.type === 'characterData') {
          const mortise = element.getAttribute("mortise");

          if (!mortise)
            __reomveMonitor(element);

          else
            __setSolveFuncs(element, mortise);
        }
      }
    });

    const mortiseId = element.getAttribute("mortise-id");
    __observers[mortiseId] = observer;
    const observerOptions = {
      childList: false,
      attributes: true,
      // Omit (or set to false) to observe only changes to the parent node
      subtree: false
    };

    observer.observe(element, observerOptions);
  }

  /**
   * 全局观察者
   */
  function observer() {
    let body = document.getElementsByTagName('body')[0];
    // console.log(body);
    // 观察mortise，如果发生改变调用mortise初始化
    const observer = new MutationObserver(function (mutationsList, observer) {

      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') { // 判断是不是自元素发生改变
          // 对增加的input元素进行处理
          if (mutation.addedNodes.length >= 0) {
            mutation.addedNodes.forEach(function (element) {
              if (element.tagName == 'INPUT')
                __addMonitor(element);
              else if (!element.tagName == 'undefined') {
                element.querySelectorAll('input').forEach(function (value) {
                  value.getAttribute('mortise') && __addMonitor(value);
                });
              }
            });
          }

          // 对删除的input元素进行处理
          if (mutation.removedNodes.length >= 0) {
            mutation.removedNodes.forEach(function (element) {
              if (element.tagName == 'INPUT' && element.getAttribute('mortise'))
                __reomveMonitor(element);
            });
          }
        }
      }
    });
    const observerOptions = {
      childList: true,
      attributes: true,

      // Omit (or set to false) to observe only changes to the parent node
      subtree: true
    };

    observer.observe(document, observerOptions);
  }

  // string 处理
  function __stringSolve(element, mortises) {
    // String number chinese char capital lowercase email
    // TODO 优化complexRule处理 复杂处理
    let ruleReg = '';
    mortises = mortises.toLowerCase().split('|');
    for (let i = 0; i < mortises.length; i++) {
      const mortise = mortises[i];
      let isRule = false;
      for (const key in __rules) {
        if (Object.hasOwnProperty.call(__rules, key)) {
          rule = __rules[key];
          // console.log(mortise, key, rule, mortise == key, mortise === key);
          if (mortise === key) {
            ruleReg = ruleReg + rule;
            // console.log(ruleReg);
            isRule = true;
            break;
          }
        }
      }
      if (isRule === false)
        console.error(`There is no "${mortise}" type, please reset the mortise type, or initialize the custom "${mortise}" type`);
    }
    element.addEventListener('input', function () {
      // console.log('Reg: [^' + ruleReg + ']');
      element.value = element.value.replace(new RegExp('[^' + ruleReg + ']', 'g'), '');
    });
  }

  /**
   * 增加 __monitor
   * @param {Node} element
   */
  function __addMonitor(element) {
    const mortises = element.getAttribute('mortise');
    let monitorId = __randomMonitorId();
    element.setAttribute("mortise-id", monitorId);
    __monitor[monitorId] = element;
    __mortiseSolve(element, mortises);
    __mortiseObserver(element);
  }

  /**
   * 删除 monitor
   * @param {Node} element
   */
  function __reomveMonitor(element) {
    let monitorId = element.getAttribute("mortise-id");
    if (!monitorId) { // 如果元素中没有monitorId
      for (const key in __monitor) {
        if (Object.hasOwnProperty.call(__monitor, key)) {
          const val = __monitor[key];
          if (val === element) {
            monitorId = key;
          }
        }
      }
    }
    // 垃圾处理
    // __observers 会自主处理
    __monitor[monitorId]&&(__monitor[monitorId] = undefined);
    __observers[monitorId]&&(__observers[monitorId].disconnect());
    __observers[monitorId]&&(__observers[monitorId] = undefined);
  }

  /**
   * 设置input的函数
   * @param {Node} element
   * @param {String} mortise
   */
  function __setSolveFuncs(element, mortise) {
    if (typeof mortise === 'string')
      __stringSolve(element, mortise);
  }

  /**
   * 生成monitorId
   * @returns string 随机的ID
   */
  function __randomMonitorId() {
    let len = 8;
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZ2345678';
    let maxPos = $chars.length;
    let monitorId = 'MID-';
    for (i = 0; i < len; i++) {
      monitorId += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    if (Object.keys(__monitor).indexOf(monitorId) == -1)
      return monitorId;
    else
      return __randomMonitorId();
  }
  function bind() {
    let arg = arguments;
    if (arg.length === 1) {
      let element = arg[0];
      if (typeof element == 'string')
        element = document.querySelectorAll(element);
      __addMonitor(element);
    }
    else if (arg.length === 2) {
      let element = arg[0];
      let mortise = arg[1];
      let elements;
      if (typeof element === 'string') {
        elements = document.querySelectorAll(element);
        elements.forEach(function (element) {
          if (typeof mortise === 'string')
            element.setAttribute('mortise', mortise);
          else {
            console.error('The function bind parameter can only enter strings.');
            return;
          }
          __addMonitor(element);
        });
        return;
      }
      else if (!(element instanceof HTMLElement)) {
        console.error('The function bind can only enter string and node objects.');
        return;
      }
      element.setAttribute('mortise', mortise);
      __addMonitor(element);
    }
  }


  window['Mortise'] = {};
  window['Mortise']['init'] = Mortise;
  window['Mortise']['bind'] = bind;
  // window['Mortise']['verify'] = function () {
  //   let arg = arguments;
  //   if (arg.length != 1) {
  //     console.log(arg.length);
  //     const key = arg[0];
  //     const content = arg[1];
  //     if (typeof content == 'function') {
        
  //     }
  //     else if (typeof content == 'object') {
        
  //     }
  //   } else {
  //     console.error(`Parameter configuration error`);
  //   }
  //   __complexRule;
  // }
})();