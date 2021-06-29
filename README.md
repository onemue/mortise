# mortise

Setting input limit by mortise

[中文版](https://github.com/onemue/mortise/blob/master/README_zh.md)


##How to use it

Download mortise.js

Introducing JS into HTML

Add the 'mortise' attribute to the input to be used

For example:

```html

<script src="../mortise.js"></script>

<script>

Mortise.init(); 


</script>

```

Add the modify attribute to the input element that needs to be restricted, such as

```html

<input type='text' mortise='number'/>

<!-- It is suggested that lowercase characters should be converted to lowercase if they contain uppercase letters, and then matched -- >

```

> You can use the bind function to dynamically bind in JS

> Parameter one can be a selector or a DOM object

> The second parameter is the binding content

## mortise

- Number number

- Char letter

- Capital capital

- Lowercase

## tips

Part of the content has not been developed yet

The demo file is in the test directory