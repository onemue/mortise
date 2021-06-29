# mortise

Set input input limit by mortise

[中文版](https://github.com/onemue/mortise/blob/master/README_zh.md)
## How to use

Download mortise.js

Introduce JS into HTML

Add the 'mortise' attribute to the input you want to use

For example:

```html

<script src="../mortise.js"></script>

<script>

Mortise.init();// Initialize mortise

Mortise.bind('#str', 'number'); // Dynamic binding mortise

Mortise.verify({
  'idCard': (element) => {
    // console.log(element);

    console.log(element.value);
    if (element.value.lenght <= 17) {
      element.value = element.value.replace(/[^0-9]/g, '');
    }
    else {
      element.value = element.value.replace(/[^0-9X]/g, '');
    }
    element.value = element.value.slice(0, 18);
  }
}); // Dynamically create mortise constraints

</script>

```

Add the mortise attribute to the input element that needs to be restricted, for example

```html

<input type='text' mortise='number'/>

<!-- The mortise property recommends that lowercase if it contains uppercase letters, it will be converted to lowercase and then matched -- >

```

>You can use bind function to bind dynamically in JS

>Parameter one can be a selector or a DOM object

>Parameter 2 is the binding content

## mortise

- Number number

- Char letter

- Capital capital

- Lowercase small letter

## tips

Some of the content has not been developed yet

Demo file is in the test directory

