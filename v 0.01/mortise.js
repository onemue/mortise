(function () {
  let root = this; // root
  let Mortises = []; // 大写是元素
  let monitor = {};
  window['mortise'] = {};
  window.onload = function () {
    observer();
    Mortises = document.getElementsByTagName('input'); // 存放 Mortises
    for (let i = 0; i < Mortises.length; i++) {
      const element = Mortises[i];
      let mortises = element.getAttribute('mortise'); // 小写是类型

      if (mortises) addMonitor(element);
    }
    for (let i = 0; i < monitor.length; i++) {
      const element = monitor[i];
      const mortises = element.getAttribute('mortise');

      mortiseSolve(element, mortises);
      mortiseObserver(element);
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

      // 多类型处理
      mortises = mortises.split('|');
      for (let i = 0; i < mortises.length; i++) {
        const mortise = mortises[i];

        setSolveFuncs(element, mortise);
      }
    }
  }


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
    const observerOptions = {
      childList: false,
      attributes: true,
      // Omit (or set to false) to observe only changes to the parent node
      subtree: false
    }
    
    observer.observe(element, observerOptions);
  }


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
                // BUG 新增元素的子元素有input[mortise]的处理
                element.getElementsByTagName('input').forEach(function (value) {
                value.getAttribute('mortise') && addMonitor(element);
                })
            })
          }

          // 对删除的input元素进行处理
          if (mutation.removedNodes.length>=0) {
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
  function stringSolve(element, mortise) {
    // String number chinese char capital lowercase email
    // TODO 优化事件处理
    let solveFuncs = [];
    if (mortise === "number")
      solveFuncs.push(function () {
        element.value = element.value.replace(/[^0-9]/g, '');
      });

    else if (mortise === "chinese")
      solveFuncs.push(function () {
        element.value = element.value.replace(/[^\u4e00-\u9fa5]/g, '');
      });

    else if (mortise === "char")
      solveFuncs.push(function () {
        element.value = element.value.replace(/[^a-zA-Z]/g, '');
      })

    else if (mortise === "capital")
      solveFuncs.push(function () {
        element.value = element.value.replace(/[^A-Z]/g, '');
      })

    else if (mortise === "lowercase")
      solveFuncs.push(function () {
        element.value = element.value.replace(/[^a-z]/g, '');
      })

    else if (mortise === "email")
      solveFuncs.push(function () {
        element.value = element.value.replace(/[^a-z]/g, '');
      })

    else
      solveFuncs.push(function () {
        console.error(`There is no "${mortise}" type, please reset the mortise type, or initialize the custom "${mortise}" type`);
      })
        
    element.addEventListener('input', function () {
      solveFuncs.forEach(function (value) {
        value.call(this);
      })
    });
  }


  /**
   * 增加 monitor 
   * @param {Node} element 
   */
  function addMonitor(element) {
    let monitorId = Object.keys(monitor).length;

    element.setAttribute("mortise-id", monitorId);
    monitor[monitorId] = element;
    mortiseObserver(element);
  }

  /**
   * 删除 monitor
   * @param {Node} element 
   */
  function reomveMonitor(element) {
    let monitorId = element.getAttribute("mortise-id");

    monitor[monitorId] = undefined;
    console.log(`id ${monitorId} 被删除`);
  }

  /**
   * 设置input的函数
   * @param {Node} element 
   * @param {String} mortise 
   */
  function setSolveFuncs(element, mortise) {
    // TODO 设置 input 函数
    if (typeof mortise === 'string') stringSolve(element, mortise);
  }
})();