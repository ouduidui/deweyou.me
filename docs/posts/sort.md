---
lang: zh-CN
title: 十大经典排序算法
description: 十大经典排序算法
date: 2022-02-13
sidebar: auto
---

# 十大经典排序算法

> [github](https://github.com/ouduidui/fe-study/blob/master/package/javascript/wheels/src/others/sort-algorithm/index.js)

| 排序算法 | 时间复杂度（平均） | 时间复杂度（最好） | 时间复杂度（最坏） | 空间复杂度 | 稳定性 | 排序方式  |  排序类型  |
| :------: | :----------------: | :----------------: | :----------------: | :--------: | :----: | :-------: | :--------: |
| 冒泡排序 |       O(N²)        |        O(N)        |       O(N²)        |    O(1)    |  稳定  | In-place  |  比较排序  |
| 选择排序 |       O(N²)        |       O(N²)        |       O(N²)        |    O(1)    | 不稳定 | In-place  |  比较排序  |
| 插入排序 |       O(N²)        |        O(N)        |       O(N²)        |    O(1)    |  稳定  | In-place  |  比较排序  |
| 归并排序 |      O(NlogN)      |      O(NlogN)      |      O(NlogN)      |    O(N)    |  稳定  | Out-place |  比较排序  |
| 快速排序 |      O(NlogN)      |      O(NlogN)      |       O(N²)        |  O(logN)   | 不稳定 | In-place  |  比较排序  |
|  堆排序  |      O(NlogN)      |      O(NlogN)      |      O(NlogN)      |    O(1)    | 不稳定 | In-place  |  比较排序  |
| 希尔排序 |     O(Nlog²N)      |        O(N)        |       O(N²)        |    O(1)    | 不稳定 | In-place  |  比较排序  |
| 计数排序 |      O(N + K)      |      O(N + K)      |      O(N + K)      |  O(N + K)  |  稳定  | Out-place | 非比较排序 |
|  桶排序  |      O(N + K)      |      O(N + K)      |       O(N²)        |  O(N + K)  |  稳定  | Out-place | 非比较排序 |
| 基数排序 |       O(NK)        |       O(NK)        |       O(NK)        |  O(N + K)  |  稳定  | Out-place | 非比较排序 |

## 冒泡排序

冒泡排序（Bubble Sort）也是一种简单直观的排序算法。

它重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。

走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。

这个算法的名字由来是因为越小的元素会经由交换慢慢"浮"到数列的顶端。

### 排序步骤

- 比较相邻的元素。如果第一个比第二个大，就交换他们两个。

- 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。

- 针对所有的元素重复以上的步骤，除了最后一个。

- 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

![bubbleSort.gif](/images/docs/sort/bubbleSort.gif)

### 稳定性

在相邻元素相等时，它们并不会交换位置，所以，冒泡排序是稳定排序。

### 使用场景

冒泡排序思路简单，代码也简单，特别适合小数据的排序。但是，由于算法复杂度较高，在数据量大的时候不适合使用。

### 实现

```javascript
/**
 * 冒泡排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(N²) 空间复杂度：O(1) 排序方式：in-place
 * @param array {number[]}
 * @return {number[]}
 */
function bubbleSort(array) {
  const len = array.length;
  let i = 0;
  // 循环 len 次
  while (i < len) {
    // 每次结尾都少遍历一个
    const lastIndex = len - 1 - i++;
    for (let j = 0; j < lastIndex; j++) {
      // 当前元素与下一个元素做比较，如果大于的话调换顺序
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }
  return array;
}
```

## 选择排序

选择排序是一种简单直观的排序算法，无论什么数据进去都是 O(n²) 的时间复杂度。所以用到它的时候，数据规模越小越好。

### 排序步骤

- 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置。

- 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。

- 重复第二步，直到所有元素均排序完毕。

![selectionSort.gif](/images/docs/sort/selectionSort.gif)

### 稳定性

用数组实现的选择排序是不稳定的，用链表实现的选择排序是稳定的。

不过，一般提到排序算法时，大家往往会默认是数组实现，所以选择排序是不稳定的。

### 使用场景

选择排序实现也比较简单，并且由于在各种情况下复杂度波动小，因此一般是优于冒泡排序的。在所有的完全交换排序中，选择排序也是比较不错的一种算法。

但是，由于固有的 O(N²)复杂度，选择排序在海量数据面前显得力不从心。因此，它适用于简单数据排序。

### 实现

```javascript
/**
 * 选择排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(N²) 空间复杂度：O(1) 排序方式：in-place
 * @param array {number[]}
 * @return {number[]}
 */
function selectionSort(array) {
  const len = array.length;
  for (let i = 0; i < len - 1; i++) {
    let minIndex = i; // 初始化最小值下标
    for (let j = i + 1; j < len; j++) {
      // 寻找最小的值
      if (array[j] < array[minIndex]) minIndex = j;
    }
    // 调换顺序
    [array[i], array[minIndex]] = [array[minIndex], array[i]];
  }

  return array;
}
```

## 插入排序

插入排序的代码实现虽然没有冒泡排序和选择排序那么简单粗暴，但它的原理应该是最容易理解的了，因为只要打过扑克牌的人都应该能够秒懂。插入排序是一种最简单直观的排序算法，它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

### 算法步骤

- 将第一待排序序列第一个元素看做一个有序序列，把第二个元素到最后一个元素当成是未排序序列。

- 从头到尾依次扫描未排序序列，将扫描到的每个元素插入有序序列的适当位置。（如果待插入的元素与有序序列中的某个元素相等，则将待插入元素插入到相等元素的后面。）

![insertionSort.gif](/images/docs/sort/insertionSort.gif)

### 稳定性

由于只需要找到不大于当前数的位置而并不需要交换，因此，直接插入排序是稳定的排序方法。

### 使用场景

插入排序由于 O(N²)的复杂度，在数组较大的时候不适用。但是，在数据比较少的时候，是一个不错的选择，一般做为快速排序的扩充。

### 实现

```javascript
/**
 * 插入排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(N²) 空间复杂度：O(1) 排序方式：in-place
 * @param array {number[]}
 * @return {number[]}
 */
function insertionSort(array) {
  const len = array.length;
  // 从第二个开始遍历
  for (let i = 1; i < len; i++) {
    // 获取当前值
    const curValue = array[i];
    let j = i - 1;
    // 遍历 i 之前的元素，如果大于curValue，则直接往后挪一位
    while (j >= 0 && array[j] > curValue) {
      array[j + 1] = array[j];
      j--;
    }
    // 插入 curValue
    array[j + 1] = curValue;
  }
  return array;
}
```

## 快速排序

快速排序是由东尼·霍尔所发展的一种排序算法。在平均状况下，排序 n 个项目要 Ο(nlogn) 次比较。在最坏状况下则需要 Ο(n²) 次比较，但这种状况并不常见。

事实上，快速排序通常明显比其他 Ο(nlogn) 算法更快，因为它的内部循环（inner loop）可以在大部分的架构上很有效率地被实现出来。

快速排序使用分治法（Divide and conquer）策略来把一个串行（list）分为两个子串行（sub-lists）。

快速排序又是一种分而治之思想在排序算法上的典型应用。本质上来看，快速排序应该算是在冒泡排序基础上的递归分治法。

### 算法步骤

- 从数列中挑出一个元素，称为 "基准"（pivot）;

- 重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区退出之后，该基准就处于数列的中间位置。这个称为分区（partition）操作；

- 递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序；

![quickSort.gif](/images/docs/sort/quickSort.gif)

### 稳定性

快速排序并不是稳定的。这是因为我们无法保证相等的数据按顺序被扫描到和按顺序存放。

### 使用场景

快速排序在大多数情况下都是适用的，尤其在数据量大的时候性能优越性更加明显。但是在必要的时候，需要考虑下优化以提高其在最坏情况下的性能。

### 实现

```javascript
/**
 * 快速排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(NlogN) 空间复杂度：O(logN) 排序方式：in-place
 * @param array {number[]}
 * @return {number[]}
 */
function quickSort(array) {
  return _quickSort(array, 0, array.length - 1);

  /**
   * 快速排序
   * @param array {number[]}
   * @param left {number}
   * @param right {number}
   * @return {number[]}
   * @private
   */
  function _quickSort(array, left, right) {
    if (left < right) {
      // 进行分区，获取基准点
      const partitionIndex = partition(array, left, right);
      // 以基准值为中心，左右各种再递归调用快速排序
      _quickSort(array, left, partitionIndex - 1);
      _quickSort(array, partitionIndex + 1, right);
    }

    return array;
  }

  /**
   * 分区操作
   * @param array {number[]}
   * @param left {number}
   * @param right {number}
   * @return {number}
   */
  function partition(array, left, right) {
    const pivot = left; // 基准
    let idx = pivot + 1; // 定位到等于array[pivot]的下标
    // 将小于基准值的与array[idx]调换顺序
    for (let i = idx; i <= right; i++) {
      if (array[i] < array[pivot]) {
        [array[i], array[idx]] = [array[idx], array[i]];
        idx++;
      }
    }
    // 调换array[pivot]至array[idx - 1]处
    // 形成小于基准值的在基准值的左边，大于基准值的在基准值的右边
    [array[pivot], array[idx - 1]] = [array[idx - 1], array[pivot]];
    return idx - 1;
  }
}
```

## 归并排序

归并排序（Merge sort）是建立在归并操作上的一种有效的排序算法。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。

作为一种典型的分而治之思想的算法应用，归并排序的实现由两种方法：

- 自上而下的递归（所有递归的方法都可以用迭代重写，所以就有了第 2 种方法）；

- 自下而上的迭代；

### 算法步骤

- 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列；

- 设定两个指针，最初位置分别为两个已经排序序列的起始位置；

- 比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到下一位置；

- 重复步骤 3 直到某一指针达到序列尾；

- 将另一序列剩下的所有元素直接复制到合并序列尾。

![mergeSort.gif](/images/docs/sort/mergeSort.gif)

### 稳定性

因为我们在遇到相等的数据的时候必然是按顺序“抄写”到辅助数组上的，所以，归并排序同样是稳定算法。

### 使用场景

归并排序在数据量比较大的时候也有较为出色的表现（效率上），但是，其空间复杂度 O(N)使得在数据量特别大的时候（例如，1 千万数据）几乎不可接受。而且，考虑到有的机器内存本身就比较小，因此，采用归并排序一定要注意。

> 在《数据结构与算法 JavaScript 描述》中，作者给出了自下而上的迭代方法。但是对于递归法，作者认为：
>
> However, it is not possible to do so in JavaScript, as the recursion goes too deep for the language to handle.
>
> 然而，在 JavaScript 中这种方式不太可行，因为这个算法的递归深度对它来讲太深了。

### 实现

```javascript
/**
 * 归并排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(NlogN) 空间复杂度：O(N) 排序方式：out-place
 * @param array {number[]}
 * @return {number[]}
 */
function mergeSort(array) {
  const len = array.length;
  if (len < 2) {
    return array;
  }

  // 获取中间下标
  const middle = len >> 1;
  // 根据middle差分为左右数组
  const left = array.slice(0, middle);
  const right = array.slice(middle);
  return merge(mergeSort(left), mergeSort(right));

  /**
   * 合并操作
   * @param left {number[]}
   * @param right {number[]}
   * @return {number[]}
   */
  function merge(left, right) {
    const result = [];

    // 遍历两个数组，一一比较，谁小进入result数组
    while (left.length && right.length) {
      if (left[0] <= right[0]) {
        result.push(left.shift());
      } else {
        result.push(right.shift());
      }
    }

    // 处于剩余元素
    while (left.length) result.push(left.shift());
    while (right.length) result.push(right.shift());

    return result;
  }
}
```

## 堆排序

堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。堆排序可以说是一种利用堆的概念来排序的选择排序。分为两种方法：

- 大顶堆：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排列；
- 小顶堆：每个节点的值都小于或等于其子节点的值，在堆排序算法中用于降序排列；

堆排序的平均时间复杂度为 Ο(nlogn)。

### 算法步骤

- 创建一个堆 `H[0……n-1]`；

- 把堆首（最大值）和堆尾互换；

- 把堆的尺寸缩小 1，并调用 `shift_down(0)`，目的是把新的数组顶端数据调整到相应位置；

- 重复步骤 2，直到堆的尺寸为 1。

![heapSort1.gif](/images/docs/sort/heapSort1.gif)

![heapSort2.gif](/images/docs/sort/heapSort2.gif)

### 稳定性

堆排序存在大量的筛选和移动过程，属于不稳定的排序算法。

### 使用场景

堆排序在建立堆和调整堆的过程中会产生比较大的开销，在元素少的时候并不适用。但是，在元素比较多的情况下，还是不错的一个选择。尤其是在解决诸如“前 n 大的数”一类问题时，几乎是首选算法。

### 实现

```javascript
/**
 * 堆排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(NlogN) 空间复杂度：O(1) 排序方式：in-place
 * @param array {number[]}
 * @return {number[]}
 */
function heapSort(array) {
  let heapSize = array.length;
  // 建立大顶堆
  // 确保每个节点大于两个子节点
  for (let i = heapSize >> 1 /* 中间值 */; i >= 0; i--) {
    heapify(array, i, heapSize);
  }

  for (let i = heapSize - 1; i >= 1; i--) {
    // 把堆首（最大值）和堆尾互换
    [array[0], array[i]] = [array[i], array[0]];
    // 重新排序堆
    heapify(array, 0, --heapSize);
  }

  return array;

  /**
   * 堆调整
   * @param array {number[]}
   * @param x {number}
   * @param len {number}
   */
  function heapify(array, x, len) {
    let left = 2 * x + 1; // 左节点下标
    let right = 2 * x + 2; // 右节点下标
    let largest = x; // 最大值下标

    // 如果左节点的值大于largest的值，更新largest
    if (left < len && array[left] > array[largest]) {
      largest = left;
    }
    // 如果右节点的值大于largest的值，更新largest
    if (right < len && array[right] > array[largest]) {
      largest = right;
    }

    // 如果largest不是x，则将其与x调换顺序
    if (largest !== x) {
      [array[x], array[largest]] = [array[largest], array[x]];
      // 以largest为中心继续堆调整
      heapify(array, largest, len);
    }
  }
}
```

## 希尔排序

希尔排序，也称递减增量排序算法，是插入排序的一种更高效的改进版本。但希尔排序是非稳定排序算法。

希尔排序是基于插入排序的以下两点性质而提出改进方法的：

- 插入排序在对几乎已经排好序的数据操作时，效率高，即可以达到线性排序的效率；
- 但插入排序一般来说是低效的，因为插入排序每次只能将数据移动一位；

希尔排序的基本思想是：先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序，待整个序列中的记录"基本有序"时，再对全体记录进行依次直接插入排序。

### 算法步骤

- 选择一个增量序列 `t1，t2，……，tk`，其中 `ti > tj, tk = 1`；

- 按增量序列个数 k，对序列进行 k 趟排序；

- 每趟排序，根据对应的增量 ti，将待排序列分割成若干长度为 m 的子序列，分别对各子表进行直接插入排序。仅增量因子为 1 时，整个序列作为一个表来处理，表长度即为整个序列的长度。

### 步长序列

步长的选择是希尔排序的重要部分。只要最终步长为 1 任何步长序列都可以工作。算法最开始以一定的步长进行排序。然后会继续以一定步长进行排序，最终算法以步长为 1 进行排序。当步长为 1 时，算法变为普通插入排序，这就保证了数据一定会被排序。

Donald Shell 最初建议步长选择为`n/2`并且对步长取半直到步长达到 1。虽然这样取可以比 O(N²) 类的算法（插入排序）更好，但这样仍然有减少平均时间和最差时间的余地。

| 步长序列  | 最坏情况复杂度 |
| --------- | -------------- |
| n/(2^i)   | O(N²)          |
| 2^i - 1   | O(N^(3/2))     |
| 2^i x 3^j | O(N log²N)     |

已知的最好步长序列是由 Sedgewick 提出的`(1, 5, 19, 41, 109,...)`，该序列的项，从第 0 项开始，偶数来自 `9 x 4^i - 9 x 2^i + 1` 和偶数来自 `2^(i+2) x (2^(i+2) - 3) + 1` 这两个算式。

这项研究也表明"比较在希尔排序中是最主要的操作，而不是交换"。 **用这样步长序列的希尔排序比插入排序要快，甚至在小数组中比快速排序和堆排序还快，但是在涉及大量数据时希尔排序还是比快速排序慢。**

另一个在大数组中表现优异的步长序列是（斐波那契数列除去 0 和 1 将剩余的数以黄金分割比的两倍的幂进行运算得到的数列）：(1, 9, 34, 182, 836, 4025, 19001, 90358, 428481, 2034035, 9651787, 45806244, 217378076, 1031612713,…)

### 稳定性

我们都知道插入排序是稳定算法。

但是，Shell 排序是一个多次插入的过程。在一次插入中我们能确保不移动相同元素的顺序，但在多次的插入中，相同元素完全有可能在不同的插入轮次被移动，最后稳定性被破坏，因此，Shell 排序不是一个稳定的算法。

### 使用场景

Shell 排序虽然快，但是毕竟是插入排序，其数量级并没有后起之秀--快速排序 O(NlogN) 快。在大量数据面前，Shell 排序不是一个好的算法。但是，中小型规模的数据完全可以使用它。

### 实现

```javascript
/**
 * 希尔排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(Nlog²N) 空间复杂度：O(1) 排序方式：in-place
 * @param array {number[]}
 * @return {number[]}
 */
function shellSort(array) {
  // 以 N/2 作为步长
  let gap = array.length >> 1;
  while (gap > 0) {
    for (let i = gap; i < array.length; i++) {
      // 执行插入排序
      let temp = array[i];
      let j;
      // 以gap为间隔遍历
      for (j = i - gap; j >= 0 && array[j] > temp; j -= gap) {
        array[j + gap] = array[j];
      }
      array[j + gap] = temp;
    }

    // 继续 N/2 更新步长
    gap >>= 1;
  }

  return array;
}
```

## 计数排序

计数排序的核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。

当输入的元素是 n 个 0 到 k 之间的整数时，它的运行时间是 Θ(n + k)。计数排序不是比较排序，排序的速度快于任何比较排序算法。

由于用来计数的数组 C 的长度取决于待排序数组中数据的范围（等于待排序数组的最大值与最小值的差加上 1），这使得计数排序对于数据范围很大的数组，需要大量时间和内存。

### 算法步骤

- 找出待排序的数组中最大和最小的元素

- 统计数组中每个值为 i 的元素出现的次数，存入数组 C 的第 i 项

- 对所有的计数累加（从 C 中的第一个元素开始，每一项和前一项相加）

- 反向填充目标数组：将每个元素 i 放在新数组的第 C(i)项，每放一个元素就将 C(i)减去 1

![countingSort.gif](/images/docs/sort/countingSort.gif)

### 稳定性

计数排序是一个稳定的排序算法。当输入的元素是 n 个 0 到 k 之间的整数时，时间复杂度是 O(n+k)，空间复杂度也是 O(n+k)，其排序速度快于任何比较排序算法。

### 使用场景

计数排序需要占用大量空间，它比较适用于数据比较集中的情况。

### 代码实现

```javascript
/**
 * 计数排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(N + K) 空间复杂度：O(N + K) 排序方式：out-place
 * @param array {number[]}
 * @return {number[]}
 */
function countingSort(array) {
  // 获取最大值
  const maxValue = Math.max(...array);
  const bucketLen = maxValue + 1;
  // 生成 maxValue + 1 长度的数组
  const bucket = new Array(bucketLen).fill(0);
  const arrLen = array.length;

  // 以数值为下标，计算出每个数值出现的次数
  for (let i = 0; i < arrLen; i++) {
    bucket[array[i]]++;
  }

  let sortedIndex = 0;
  // 进行遍历排序
  for (let j = 0; j < bucketLen; j++) {
    while (bucket[j] > 0) {
      array[sortedIndex++] = j;
      bucket[j]--;
    }
  }

  return array;
}
```

而计数排序存在一个问题，就是如果存在负数的话，它是会排序错误，因为数组默认遍历下标是从`0`开始的。

如果想要兼容负数的话，可以先将负数从原数组挑出来，并取模组成新数组，然后分别进行计数排序后再拼接返回。

```javascript
/**
 * 计数排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(N + K) 空间复杂度：O(N + K) 排序方式：out-place
 * @param array {number[]}
 * @return {number[]}
 */
function countingSort(array) {
  // 没有负数的情况
  if (Math.min(...array) >= 0) {
    return _countingSort(array);
  }
  // 有负数的情况
  else {
    let pArr = [];
    let nArr = [];
    for (let i = 0; i < array.length; i++) {
      array[i] >= 0 ? pArr.push(array[i]) : nArr.push(-1 * array[i]);
    }

    return [
      ..._countingSort(nArr).reduce((acc, cur) => {
        acc.unshift(-1 * cur);
        return acc;
      }, []),
      ..._countingSort(pArr),
    ];
  }

  /**
   * 计数排序核心代码
   * @param array {number[]}
   * @return {number[]}
   * @private
   */
  function _countingSort(array) {
    // 获取最大值
    const maxValue = Math.max(...array);
    const bucketLen = maxValue + 1;
    // 生成 maxValue + 1 长度的数组
    const bucket = new Array(bucketLen).fill(0);
    const arrLen = array.length;

    // 以数值为下标，计算出每个数值出现的次数
    for (let i = 0; i < arrLen; i++) {
      bucket[array[i]]++;
    }

    let sortedIndex = 0;
    // 进行遍历排序
    for (let j = 0; j < bucketLen; j++) {
      while (bucket[j] > 0) {
        array[sortedIndex++] = j;
        bucket[j]--;
      }
    }

    return array;
  }
}
```

## 桶排序

桶排序是计数排序的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。

为了使桶排序更加高效，我们需要做到这两点：

1. 在额外空间充足的情况下，尽量增大桶的数量
2. 使用的映射函数能够将输入的 N 个数据均匀的分配到 K 个桶中

### 算法步骤

- 元素分布在桶中：

![bucketSort1.jpg](/images/docs/sort/bucketSort1.jpg)

- 然后，元素在每个桶中排序：

![bucketSort2.jpg](/images/docs/sort/bucketSort2.jpg)

### 稳定性

可以看出，在分桶和从桶依次输出的过程是稳定的。

但是，由于我们在对每个桶进行排序时使用了其他算法，所以，桶排序的稳定性依赖于这一步。如果我们使用了快排，显然，算法是不稳定的。

### 使用场景

桶排序可用于最大最小值相差较大的数据情况，但桶排序要求数据的分布必须均匀，否则可能导致数据都集中到一个桶中。

比如`[104,150,123,132,20000]`, 这种数据会导致前 4 个数都集中到同一个桶中。导致桶排序失效。

### 实现

```javascript
/**
 * 桶排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(N + K) 空间复杂度：O(N + K) 排序方式：out-place
 * @param array {number[]}
 * @param [bucketSize]
 * @return {number[]}
 */
function bucketSort(array, bucketSize = 5 /* 桶的默认容量为 5 */) {
  if (array.length === 0) {
    return array;
  }

  let i;
  let minValue = array[0];
  let maxValue = array[0];
  // 一次遍历获取数组中的最小值和最大值
  for (i = 1; i < array.length; i++) {
    if (array[i] < minValue) {
      minValue = array[i]; // 输入数据的最小值
    } else if (array[i] > maxValue) {
      maxValue = array[i]; // 输入数据的最大值
    }
  }

  // 桶的数量
  const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
  /**
   * 桶
   * @type {number[][]}
   */
  const buckets = new Array(bucketCount).fill(0).map(() => []);

  // 利用映射函数将数据分配到各个桶中
  for (i = 0; i < array.length; i++) {
    buckets[Math.floor((array[i] - minValue) / bucketSize)].push(array[i]);
  }

  // 清空原数组
  array.length = 0;

  // 对每个桶进行排序
  for (i = 0; i < buckets.length; i++) {
    // 使用了插入排序对每个桶进行排序
    insertionSort(buckets[i]);
    // 将桶里排序后的数据放入数组
    array.push(...buckets[i]);
  }

  return array;

  /**
   * 插入排序
   * @param array
   * @return {*}
   */
  function insertionSort(array) {
    const len = array.length;
    // 从第二个开始遍历
    for (let i = 1; i < len; i++) {
      // 获取当前值
      const curValue = array[i];
      let j = i - 1;
      // 遍历 i 之前的元素，如果大于curValue，则直接往后挪一位
      while (j >= 0 && array[j] > curValue) {
        array[j + 1] = array[j];
        j--;
      }
      // 插入 curValue
      array[j + 1] = curValue;
    }
    return array;
  }
}
```

## 基数排序

基数排序是一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。

### 算法步骤

- 先得知数组中最大数值的最大位数
- 从个位开始比较，以个位作为桶的下标，放入桶中，然后再按照从小到大的顺序合并桶，形成新的排序数组
- 接着进位，重复步骤二，直至最高位数

![radixSort.gif](/images/docs/sort/radixSort.gif)

### 稳定性

通过上面的排序过程，我们可以看到，每一轮映射和收集操作，都保持从左到右的顺序进行，如果出现相同的元素，则保持他们在原始数组中的顺序。

可见，基数排序是一种稳定的排序。

### 使用场景

基数排序要求较高，元素必须是整数，整数时长度 10W 以上，最大值 100W 以下效率较好，但是基数排序比其他排序好在可以适用字符串，或者其他需要根据多个条件进行排序的场景，例如日期，先排序日，再排序月，最后排序年 ，其它排序算法可是做不了的。

### 对比基数排序、计数排序、桶排序

这三种排序算法都利用了桶的概念，但对桶的使用方法上有明显差异：

- 基数排序：根据键值的每位数字来分配桶；
- 计数排序：每个桶只存储单一键值；
- 桶排序：每个桶存储一定范围的数值；

### 代码实现

```javascript
/**
 * 基数排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(NK) 空间复杂度：O(N + K) 排序方式：out-place
 * @param array {number[]}
 * @return {number[]}
 */
function radixSort(array) {
  // 找到最大值，为了得知数组中最大位数
  const maxValue = Math.max(...array);

  // 定义当前要遍历的位数
  let m = 1;

  // 初始化一个桶
  const buckets = [];

  // 保证遍历完所有可能的位数
  while (m <= maxValue) {
    // 清空桶
    buckets.length = 0;
    // 放入桶
    for (const number of array) {
      // digit表示number的某位数的值
      const digit = ~~((number % (m * 10)) / m);
      // 把该位数的值放到桶buckets中
      !buckets[digit]
        ? (buckets[digit] = [number])
        : buckets[digit].push(number);
    }

    // 从桶buckets中取值，完成了一次位数排序
    array.length = 0;
    for (let i = 0; i < buckets.length; i++) {
      if (buckets[i]) array.push(...buckets[i]);
    }

    // 每次最外层while循环后m要乘等10，也就是要判断下一位 比如当前是个位 下次就要判断十位
    m *= 10;
  }

  return array;
}
```

基数排序跟计数排序有同样的缺陷，就是不能排序负数。 如果想要实现负数排序，可以参考计数排序的解决方法。

```javascript
/**
 * 基数排序
 * @author 欧怼怼
 * @desc 时间复杂度：O(NK) 空间复杂度：O(N + K) 排序方式：out-place
 * @param array {number[]}
 * @return {number[]}
 */
function radixSort(array) {
  // 没有负数的情况
  if (Math.min(...array) >= 0) {
    return _radixSort(array);
  }
  // 有负数的情况
  else {
    let pArr = [];
    let nArr = [];
    for (let i = 0; i < array.length; i++) {
      array[i] >= 0 ? pArr.push(array[i]) : nArr.push(-1 * array[i]);
    }

    return [
      ..._radixSort(nArr).reduce((acc, cur) => {
        acc.unshift(-1 * cur);
        return acc;
      }, []),
      ..._radixSort(pArr),
    ];
  }

  /**
   * 基数排序核心代码
   * @param array {number[]}
   * @return {number[]}
   * @private
   */
  function _radixSort(array) {
    // 找到最大值，为了得知数组中最大位数
    const maxValue = Math.max(...array);

    // 定义当前要遍历的位数
    let m = 1;
    // 初始化一个桶
    const buckets = [];

    // 保证遍历完所有可能的位数
    while (m <= maxValue) {
      // 清空桶
      buckets.length = 0;
      // 放入桶
      for (const number of array) {
        // digit表示number的某位数的值
        const digit = ~~((number % (m * 10)) / m);
        // 把该位数的值放到桶buckets中
        !buckets[digit]
          ? (buckets[digit] = [number])
          : buckets[digit].push(number);
      }

      // 从桶buckets中取值，完成了一次位数排序
      array.length = 0;
      for (let i = 0; i < buckets.length; i++) {
        if (buckets[i]) array.push(...buckets[i]);
      }

      // 每次最外层while循环后m要乘等10，也就是要判断下一位 比如当前是个位 下次就要判断十位
      m *= 10;
    }

    return array;
  }
}
```
