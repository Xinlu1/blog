---
title: 小议 Javascript 数组去重
date: 2017-02-01 00:43:39
tags:
- javascript
- array
- remove duplicates
---

几乎所有 Javascript （以下简称 js）初学者都会遇到的一个问题：如何（优雅地）去除数组中重复的元素。
这个问题在 stack overflow 上被赞了近五百次，不过这并不重要。重要的是，有热心网友给出了全面、专业的回答，让博主看了大呼过瘾。
在此对原文进行翻译，与大家一起分享。

注：
- 下文中的“物件”对应英文"object"。


# "Smart" but naïve way

![](http://sd.keepcalm-o-matic.co.uk/i-w600/too-young-too-simple-and-sometimes-naive.jpg)

(图片来源：http://www.keepcalm-o-matic.co.uk/)

```js
uniqueArray = a.filter(function(item, pos) {
    return a.indexOf(item) == pos;
})
```

最基本的版本：我们迭代整个数组，检查其中每一个元素在数组中第一次出现的位置与该元素实际的位置是否相等，如果不等则为重复元素。
使用 `filter` 的回调函数中的第三个参数 `self` ，可以避免数组变量的闭包问题（数组中的元素还是数组）。

```js
uniqueArray = a.filter(function(item, pos, self) {
    return self.indexOf(item) == pos;
})
```

尽管这种算法简洁明了，但是对于大型数组来说尤其缺乏效率（时间复杂度为 n^2）。

# Hashtables to the rescue

```js
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
```

通常使用的方法是将每个元素存入一张哈希表中，然后直接检查它是否存在。这保证了线性的时间复杂度，但存在至少两个缺点：

- 由于在 JavaScript 中，哈希键 (key) 只能为字符串，这将导致上述代码无法区分数字和字符串数字。例如，`uniq([1,"1"])` 将只会返回 `[1]` 。
- 同理，例如 `uniq([{foo:1},{foo:2}])` 这样具有相同键的物件也会被认为是一样的，仅得到 `[{foo:1}]` 。

也就是说，如果你的数组中仅包含 js 的原始类型 (primitives) 且你无需在意它们的具体种类（例如它们全都是数字），这个算法是最佳的。

# The best from two worlds

结合上述两种方法，有一个通用的解决方案：原始类型使用哈希表查找，而物件使用线性查找。

![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1486654688&di=198726a46d395132a054fc379ac281d8&imgtype=jpg&er=1&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201601%2F17%2F20160117232154_awF3y.jpeg)

```js
function uniq(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}
```

# sort | uniq

还有一个选择是先对数组排序，然后去除与前一元素相等的元素：

```js
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}
```

同理，由于 `sort` 方法无法直接对物件进行排序，因此这种方法对物件无效。另外存在一个副作用————原始数组已被改变。假如输入数组已经是有序的，则可以使用这种方法（同时去掉上述代码中的 `sort()` 方法）。

# Unique by...

有时候我们希望能基于一些条件而不仅仅是根据数值相等进行唯一化，例如过滤出有共性但是实际是不同的物件（后面会举例说明）。传递回调函数可以优美地解决这一需求。由于 `key` 预期会返回一个原始类型，因此哈希表在这里可以正常工作：

```js
function uniqBy(a, key) {
    var seen = {};
    return a.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}
```

`JSON.stringify` 就是一个特别有用的 `key` 回调函数，可以移除“看起来”一样但实际不同的物件：

```js
a = [[1,2,3], [4,5,6], [1,2,3]]
b = uniqBy(a, JSON.stringify)
console.log(b) // [[1,2,3], [4,5,6]]
```

如果 `key` 返回的不是原始类型，则需要依赖线性搜索：

```js
function uniqBy(a, key) {
    var index = [];
    return a.filter(function (item) {
        var k = key(item);
        return index.indexOf(k) >= 0 ? false : index.push(k);
    });
}
```

或是使用 ES6 中的 `Set` 物件：

```js
function uniqBy(a, key) {
    var seen = new Set();
    return a.filter(item => {
        var k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}
```

(相比 `seen.has(k) ? false : seen.add(k)` ，有些人更喜欢 `!seen.has(k) && seen.add(k)` )

# Libraries

[Underscore](http://underscorejs.org/#uniq) 和 [Lo-Dash](https://lodash.com/docs#uniq) 都提供了 `uniq` 方法，他们的算法与上述第一段代码类似，总结就是：

```js
var result = [];
a.forEach(function(item) {
     if(result.indexOf(item) < 0) {
         result.push(item);
     }
});
```

其时间复杂度是二次方，但是有些额外的好处，例如封装了原生的 `indexOf` 方法、可以通过键进行唯一化（官方说法叫 `iteratee`）、对于有序数组有优势。

如果使用 jQuery 并且喜欢以美刀符号开头，则大概长这样：

```js
$.uniqArray = function(a) {
    return $.grep(a, function(item, pos) {
        return $.inArray(item, a) === pos;
    });
}
```

同样的，也是第一段代码的变体而已。

# Performance

JavaScript 中函数呼叫的成本昂贵，因此上述方法即使简洁明了，但是并不高效。如果以效能为最高宗旨，将 `filter` 全部替换成回圈以避免多余的函数呼叫：

```js
function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}
```

这段丑陋的代码和第三段代码做了相同的事情，但是执行速度上快了一个数量级。

（测试代码如下：
```js
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

/////

var r = [0,1,2,3,4,5,6,7,8,9],
    a = [],
    LEN = 1000,
    LOOPS = 1000;

while(LEN--)
    a = a.concat(r);

var d = new Date();
for(var i = 0; i < LOOPS; i++)
    uniq(a);
document.write('<br>uniq, ms/loop: ' + (new Date() - d)/LOOPS)

var d = new Date();
for(var i = 0; i < LOOPS; i++)
    uniq_fast(a);
document.write('<br>uniq_fast, ms/loop: ' + (new Date() - d)/LOOPS)
```
）

# ES6

ES6 提供了 `Set` 物件，让事情变得简单许多：

```js
function uniq(a) {
   return Array.from(new Set(a));
}
```

或者

```js
let uniq = a => [...new Set(a)];
```

需要注意的是，与 Python 不同，ES6 的 `set` 以插入顺序进行迭代，因此代码保证了原始数组的顺序。

无论如何，如果你需要一个唯一化的数组，为何不从正确地使用 `set` 开始呢？

---
原文链接:
[Remove Duplicates from JavaScript Array](http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array)
