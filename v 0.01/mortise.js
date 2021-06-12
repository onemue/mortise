(function () {
  let root = this; // root
  let mortises = [];
  window['mortise'] = {};
  window.onload = function () {
    mortises = document.getElementsByTagName('input'); // 存放 mortises
    console.log('mortises', mortises);
    for (let i = 0; i < mortises.length; i++) {
      const element = mortises[i];
      let mortise = element.getAttribute('mortise');
      // console.log(eval(mortise) instanceof 'Function');
      console.log(typeof mortise)
      console.log(typeof mortise === 'string');
      if (typeof mortise === 'string') {
        // String
        if (mortise === "number")
          element.oninput = function (params) {
            element.value = element.value.replace(/[^0-9]/g, '');
          }
        else if (mortise === "chinese")
          element.oninput = function (params) {
            element.value = element.value.replace(/[^\u4e00-\u9fa5]/g, '');
          }
        else if (mortise === "char")
          element.oninput = function (params) {
            element.value = element.value.replace(/[^a-zA-Z]/g, '');
          }
        else if (mortise === "capital")
          element.oninput = function (params) {
            element.value = element.value.replace(/[^A-Z]/g, '');
          }
        else if (mortise === "lowercase")
          element.oninput = function (params) {
            element.value = element.value.replace(/[^a-z]/g, '');
          }
        else if (mortise === "email")
        element.oninput = function (params) {
          element.value = element.value.replace(/[^a-z]/g, '');
        }
      }
    }

  }
})();