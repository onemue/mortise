/*!
 * Mortise JavaScript Library v1.8.0
 * https://github.com/onemue/mortise
 *
 * Author: onemue
 * Date: 2021-06-15 11:42:39
 */

(function () {
  let root = this; // root
  let Mortises = []; // 大写是元素
  let monitor = {};
  let observers = {};
  window['mortise'] = {};
  window.onload = function () {
    observer();
    Mortises = document.getElementsByTagName('input'); // 存放 Mortises
    for (let i = 0; i < Mortises.length; i++) {
      const element = Mortises[i];
      let mortises = element.getAttribute('mortise'); // 小写是类型

      if (mortises) addMonitor(element);
    }
    for (const key in monitor) {
      if (Object.hasOwnProperty.call(monitor, key)) {
        const element = monitor[key];
        const mortises = element.getAttribute('mortise');
        mortiseSolve(element, mortises);
        mortiseObserver(element);
      }
    }
  }
  function mortiseSolve(element, mortises) {
    if (typeof mortises === 'string') {
      // 判断js是否存在大写字母
      let ifCapitalReg = /[A-Z]/g;
      if (ifCapitalReg.test(mortises)) {
        console.warn(`The type "${mortises}" should be all lowercase letters`);
        mortises = mortises.toLowerCase();
      }

      // 类型处理
      setSolveFuncs(element, mortises);
    }
  }

  /**
   * mortise 观察者
   * @param {Node} element 
   */
  function mortiseObserver(element) {
    // 观察mortise，如果发生改变调用mortise初始化
    const observer = new MutationObserver(function (mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' || mutation.type === 'characterData') {
          const mortise = element.getAttribute("mortise");

          if (!mortise) reomveMonitor(element);

          else setSolveFuncs(element, mortise);
        }
      }
    });
    const mortiseId = element.getAttribute("mortise-id");
    observers[mortiseId] = observer;
    const observerOptions = {
      childList: false,
      attributes: true,
      // Omit (or set to false) to observe only changes to the parent node
      subtree: false
    }

    observer.observe(element, observerOptions);
  }

  /**
   * 全局观察者
   */
  function observer() {
    let main = document.getElementsByTagName('body')[0];
    // 观察mortise，如果发生改变调用mortise初始化
    const observer = new MutationObserver(function (mutationsList, observer) {

      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {  // 判断是不是自元素发生改变
          // 对增加的input元素进行处理
          if (mutation.addedNodes.length >= 0) {
            mutation.addedNodes.forEach(function (element) {
              if (element.tagName == 'INPUT') addMonitor(element);
              else
                element.querySelectorAll('input').forEach(function (value) {
                  value.getAttribute('mortise') && addMonitor(value);
                })
            })
          }

          // 对删除的input元素进行处理
          if (mutation.removedNodes.length >= 0) {
            mutation.removedNodes.forEach(function (element) {
              if (element.tagName == 'INPUT' && element.getAttribute('mortise'))
                reomveMonitor(element);
            })
          }
        }
      }
    });
    const observerOptions = {
      childList: true,
      attributes: true,

      // Omit (or set to false) to observe only changes to the parent node
      subtree: true
    }

    observer.observe(main, observerOptions);
  }

  // string 处理
  function stringSolve(element, mortises) {
    // String number chinese char capital lowercase email
    // TODO 优化complexRule处理 复杂处理
    let rules = {
      number: '0-9',
      char :'a-zA-Z',
      capital: 'A-Z',
      lowercase: 'a-z',
      chinese: '\u4e00-\u9fa5',
      symbol: `~!@#$%^&*()-_=+[]{}\\|;:'",.<>/?`
    };
    let complexRule = {};
    let ruleReg = '';
    mortises = mortises.split('|');
    for (let i = 0; i < mortises.length; i++) {
      const mortise = mortises[i];
      let isRule = false;
      for (const key in rules) {
        if (Object.hasOwnProperty.call(rules, key)) {
          rule = rules[key];
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
      console.log('Reg: [^' + ruleReg + ']');
      element.value = element.value.replace(new RegExp('[^' + ruleReg + ']', 'g'), '');
    })
  }


  /**
   * 增加 monitor 
   * @param {Node} element 
   */
  function addMonitor(element) {
    const mortises = element.getAttribute('mortise');
    let monitorId = randomMonitorId();
    element.setAttribute("mortise-id", monitorId);
    monitor[monitorId] = element;
    mortiseSolve(element, mortises);
    mortiseObserver(element);
  }

  /**
   * 删除 monitor
   * @param {Node} element 
   */
  function reomveMonitor(element) {
    let monitorId = element.getAttribute("mortise-id");
    if (!monitorId) { // 如果元素中没有monitorId
      for (const key in monitor) {
        if (Object.hasOwnProperty.call(monitor, key)) {
          const val = monitor[key];
          if (val === element) {
            monitorId = key;
          }
        }
      }
    }
    // 垃圾处理
    monitor[monitorId] = undefined;
    observers[monitorId].disconnect();
    observers[monitorId] = undefined;
  }

  /**
   * 设置input的函数
   * @param {Node} element 
   * @param {String} mortise 
   */
  function setSolveFuncs(element, mortise) {
    if (typeof mortise === 'string') stringSolve(element, mortise);
  }
  function randomMonitorId() {
    let len = 8;
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZ2345678';
    let maxPos = $chars.length;
    let monitorId = 'MID-'
    for (i = 0; i < len; i++) {
      monitorId += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    if (Object.keys(monitor).indexOf(monitorId) == -1)
      return monitorId;
    else return randomMonitorId();
  }
})();