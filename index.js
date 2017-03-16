'use strict'

const COLOR_RED = 1
const COLOR_BLACK = 2

const LEFT_CHILD = 1
const RIGHT_CHILD = 2

function TreeNode(value, color) {
    if (!color) {
        color = COLOR_RED
    }
    this.value = value
    this.color = color
    this.leftChild = null
    this.rightChild = null
    this.parent = null
}

TreeNode.prototype.getColor = function() {
    return this.color
}

TreeNode.prototype.setColor = function(color) {
    this.color = color
    return this
}

TreeNode.prototype.setValue = function(value) {
    this.value = value
    return this
}

TreeNode.prototype.getValue = function() {
    return this.value
}

TreeNode.prototype.isRedNode = function() {
    return this.color === COLOR_RED
}

TreeNode.prototype.isBlackNode = function() {
    return this.color === COLOR_BLACK
}

TreeNode.prototype.hasLeftChild = function() {
    return this.leftChild != null
}

TreeNode.prototype.hasRightChild = function() {
    return this.rightChild != null
}

TreeNode.prototype.hasBlackLeftChildOrLeftLeaf = function() {
    return this.leftChild == null || this.leftChild.isBlackNode()
}

TreeNode.prototype.hasBlackRightChildOrRightLeaf = function() {
    return this.rightChild == null || this.rightChild.isBlackNode()
}

TreeNode.prototype.hasParent = function() {
    return this.parent != null
}

TreeNode.prototype.deleteLeftChild = function() {
    var node = this.leftChild
    this.leftChild = null
    return node
}

TreeNode.prototype.deleteRightChild = function() {
    var node = this.rightChild
    this.rightChild = null
    return node
}

TreeNode.prototype.setLeftChild = function(leftChild) {
    this.leftChild = leftChild
    return this
}

TreeNode.prototype.setRightChild = function(rightChild) {
    this.rightChild = rightChild
    return this
}

TreeNode.prototype.getLeftChild = function() {
    return this.leftChild
}

TreeNode.prototype.getRightChild = function() {
    return this.rightChild
}

TreeNode.prototype.setParent = function(parent) {
    this.parent = parent
    return this
}

TreeNode.prototype.getParent = function() {
    return this.parent
}

TreeNode.prototype.toString = function() {
    if (this.value instanceof Object) {
        return this.value.toString()
    }
    return this.value
}



function RedBlackTree() {
    this.root = null
    this.nodeCount = 0
    this.comparator = null
}

RedBlackTree.prototype.insert = function(value) {
    var node = null
    var parent = null

    //empty tree
    if (this.root == null) {
        this.root = (new TreeNode(value)).setColor(COLOR_BLACK).setParent(null)
    } else {
        //default color is red
        node = this.insertIntoTree(this.root, value).setColor(COLOR_RED)
        this.insertFixUp(node)
    }
    this.nodeCount += 1
    return this
}

RedBlackTree.prototype.delete = function(value) {
    var node = this.search(value)
    var hasLeftChild = false
    var hasRightChild = false
    var x = null
    var y = null
    var xParent = null
    var yParent = null
    if (!node) {
        return false
    }

    hasLeftChild = node.hasLeftChild()
    hasRightChild = node.hasRightChild()

    if (!hasLeftChild || !hasRightChild) {
        y = node
    } else {
        y = this.getSuccessor(node)
    }

    if (y.hasLeftChild()) {
        x = y.getLeftChild()
    } else {
        x = y.getRightChild()
    }

    yParent = y.getParent()
    x && x.setParent(yParent)
    xParent = yParent

    if (!yParent) {
        this.root = x
    } else if (yParent.getLeftChild() == y) {
        yParent.setLeftChild(x)
    } else {
        yParent.setRightChild(x)
    }

    if (y !== node) {
        node.setValue(y.getValue())
    }

    if (y.isBlackNode()) {
        this.deleteFixUp(x, xParent)
    }
    this.nodeCount -= 1
    return true
}

RedBlackTree.prototype.getMinValue = function(node) {
    var node = this.getMinNode(node)
    return node ? node.value : null
}


RedBlackTree.prototype.getMinNode = function(node) {
    if (!node) {
        node = this.root
    }
    while (node && node.hasLeftChild()) {
        node = node.getLeftChild()
    }
    if (!node) {
        return null
    }
    return node
}

RedBlackTree.prototype.getMaxValue = function(node) {
    var node = this.getMaxNode(node)
    return node ? node.value : null
}

RedBlackTree.prototype.getMaxNode = function(node) {
    if (!node) {
        node = this.root
    }
    while (node && node.hasRightChild()) {
        node = node.getRightChild()
    }
    if (!node) {
        return null
    }
    return node
}

RedBlackTree.prototype.getSuccessor = function(node) {
    if (!node) {
        return null
    }

    if (node.hasRightChild()) {
        return this.getMinNode(node.getRightChild())
    }

    var x = node
    var y = x.getParent()
    while (y && x == y.getRightChild()) {
        x = y
        y = y.getParent()
    }
    return y
}

RedBlackTree.prototype.search = function(value) {
    return this.searchFrom(this.root, value)
}

RedBlackTree.prototype.deleteFixUp = function(node, parent) {
    var grandParent = null
    var uncle = null
    var brother = null

    //while current node is not root and is black
    while (node != this.root && (node == null || node.isBlackNode())) {
        if (node) {
            parent = node.getParent()
        }
        //current node is left child
        if (parent.getLeftChild() == node) {
            brother = parent.getRightChild()

            if (brother && brother.isRedNode()) {
                brother.setColor(COLOR_BLACK)
                parent.setColor(COLOR_RED)
                this.leftRotate(parent)
                brother = parent.getRightChild()
            }

            if (brother.hasBlackLeftChildOrLeftLeaf() && brother.hasBlackRightChildOrRightLeaf()) {
                brother.setColor(COLOR_RED)
                node = parent
            } else if (brother.hasBlackRightChildOrRightLeaf()) {
                brother.getLeftChild().setColor(COLOR_BLACK)
                brother.setColor(COLOR_RED)
                this.rightRotate(brother)
                brother = parent.getRightChild()
            } else {
                brother.setColor(parent.getColor())
                parent.setColor(COLOR_BLACK)
                brother.hasRightChild() && brother.getRightChild().setColor(COLOR_BLACK)
                this.leftRotate(parent)
                node = this.root
                parent = null
            }
        }
        //current node is right child
        else {
            brother = parent.getLeftChild()

            if (brother && brother.isRedNode()) {
                brother.setColor(COLOR_BLACK)
                parent.setColor(COLOR_RED)
                this.rightRotate(parent)
                brother = parent.getLeftChild()
            }

            if (brother.hasBlackLeftChildOrLeftLeaf() && brother.hasBlackRightChildOrRightLeaf()) {
                brother.setColor(COLOR_RED)
                node = parent
            } else if (brother.hasBlackLeftChildOrLeftLeaf()) {
                brother.getRightChild().setColor(COLOR_BLACK)
                brother.setColor(COLOR_RED)
                this.leftRotate(brother)
                brother = parent.getLeftChild()
            } else {
                brother.setColor(parent.getColor())
                parent.setColor(COLOR_BLACK)
                brother.hasLeftChild() && brother.getLeftChild().setColor(COLOR_BLACK)
                this.rightRotate(parent)
                node = this.root
                parent = null
            }
        }
    }
    node && node.setColor(COLOR_BLACK)
    return true
}

RedBlackTree.prototype.insertFixUp = function(node) {
    if (!node) {
        return false
    }
    var grandParent = null
    var parent = null
    var uncle = null

    //while current node and parent are red node
    while (node.hasParent() && (parent = node.getParent()).isRedNode()) {
        grandParent = parent.getParent()

        //parent is grantParent's left child
        if (grandParent.getLeftChild() == parent) {
            uncle = grandParent.getRightChild()

            //uncle is black
            if (!uncle || uncle.isBlackNode()) {
                //current node is right child
                if (node == parent.getRightChild()) {
                    node = parent
                    this.leftRotate(node)
                } else {
                    parent.setColor(COLOR_BLACK)
                    grandParent.setColor(COLOR_RED)
                    this.rightRotate(grandParent)
                }
            }
            //uncle is red
            else {
                parent.setColor(COLOR_BLACK)
                uncle.setColor(COLOR_BLACK)
                grandParent.setColor(COLOR_RED)
                node = grandParent
            }
        }
        //parent is grantParent's right child
        else {
            uncle = grandParent.getLeftChild()

            //uncle is black
            if (!uncle || uncle.isBlackNode()) {
                //current node is left child
                if (node == parent.getLeftChild()) {
                    node = parent
                    this.rightRotate(node)
                } else {
                    parent.setColor(COLOR_BLACK)
                    grandParent.setColor(COLOR_RED)
                    this.leftRotate(grandParent)
                }
            }
            //uncle is red
            else {
                parent.setColor(COLOR_BLACK)
                uncle.setColor(COLOR_BLACK)
                grandParent.setColor(COLOR_RED)
                node = grandParent
            }

        }

    }
    this.root && this.root.setColor(COLOR_BLACK)
    return true
}


//  |                        |
//  x   (left rotate x)      y
// /  \   ==========>       / \
// a   y                    x  r 
//    / \                  / \
//    b  r                 a  b
RedBlackTree.prototype.leftRotate = function(node) {
    var x = node
    var y = x.getRightChild()
    var b = y.getLeftChild()
    var r = y.getRightChild()
    var a = x.getLeftChild()
    var p = x.getParent()

    y.setParent(p)
    y.setLeftChild(x)

    p && (p.getLeftChild() == x ? p.setLeftChild(y) : p.setRightChild(y))

    x.setParent(y)
    x.setRightChild(b)

    b && b.setParent(x)

    if (x == this.root) {
        this.root = y
    }
}

//  |                        |
//  x   (right rotate y)     y
// /  \   <==========       / \
// a   y                    x  r 
//    / \                  / \
//    b  r                 a  b
RedBlackTree.prototype.rightRotate = function(node) {
    var y = node
    var x = y.getLeftChild()
    var r = y.getRightChild()
    var a = x.getLeftChild()
    var b = x.getRightChild()
    var p = y.getParent()

    x.setParent(p)
    x.setRightChild(y)

    p && (p.getLeftChild() == y ? p.setLeftChild(x) : p.setRightChild(x))

    y.setParent(x)
    y.setLeftChild(b)

    b && b.setParent(y)

    if (y == this.root) {
        this.root = x
    }
}

RedBlackTree.prototype.searchFrom = function(node, value) {
    if (!node) {
        return null
    }
    if (node.getValue() === value) {
        return node
    }
    var isGreater = this.isGreaterThan(value, node.getValue())
    if (isGreater) {
        if (node.hasRightChild()) {
            return this.searchFrom(node.getRightChild(), value)
        }
        return null
    }
    if (node.hasLeftChild()) {
        return this.searchFrom(node.getLeftChild(), value)
    }
    return null
}

RedBlackTree.prototype.insertIntoTree = function(node, value) {
    if (node == null) {
        return null
    }
    var isGreater = this.isGreaterThan(value, node.getValue())
    var newNode = null

    if (isGreater) {
        if (node.hasRightChild()) {
            return this.insertIntoTree(node.getRightChild(), value)
        }
        newNode = new TreeNode(value)
        newNode.setParent(node)
        node.setRightChild(newNode)
        return newNode
    }
    if (node.hasLeftChild()) {
        return this.insertIntoTree(node.getLeftChild(), value)
    }

    newNode = new TreeNode(value)
    newNode.setParent(node)
    node.setLeftChild(newNode)
    return newNode
}

RedBlackTree.prototype.getInOrderSequence = function(node) {
    if (!node) {
        if (this.root) {
            return this.getInOrderSequence(this.root)
        } else {
            return []
        }
    }

    var leftArr = []
    var rightArr = []
    if (node.hasLeftChild()) {
        leftArr = this.getInOrderSequence(node.getLeftChild())
    }
    if (node.hasRightChild()) {
        rightArr = this.getInOrderSequence(node.getRightChild())
    }
    return leftArr.concat([node.getValue()], rightArr)
}

RedBlackTree.prototype.setComparator = function(comparator) {
    this.comparator = comparator
    return this
}

RedBlackTree.prototype.getNodeCount = function() {
    return this.nodeCount
}

RedBlackTree.prototype.count = function() {
    return this.getNodeCount()
}

RedBlackTree.prototype.isGreaterThan = function(value1, value2) {
    if (this.comparator) {
        return this.comparator.call(this, value1, value2)
    }
    return value1 >= value2
}

RedBlackTree.prototype.has = function(value) {
    return this.search(value) != null
}

RedBlackTree.prototype.clear = function() {
    this.root = null
    this.nodeCount = 0
}

RedBlackTree.prototype.getRoot = function() {
    return this.root
}

// RedBlackTree.prototype.print = function() {
//     if (!this.root) {
//         console.log('[Empty Tree]')
//         return
//     }
//     var renderTree = []
//     var queue = [this.root]
//     var node = null
//     var row = 0
//     var column = 0
//     var len = 0
//     var nullCount = 0
//     var str = ''
//     var maxStrLen = -1
//     var maxRow = 0
//     var arr = null
//     while (queue && queue.length > 0) {
//         nullCount = 0
//         str = ''
//         for (column = 0, len = queue.length; column < len; column++) {
//             node = queue.shift()

//             if (node == null) {
//                 str = 'null'
//                 nullCount++
//                 queue.push(null, null)
//             } else {
//                 str = node.getValue() + (node.isRedNode() ? '(R) ' : '(B) ')
//                 queue.push(node.getLeftChild(), node.getRightChild())
//             }
//             if (nullCount == len) {
//                 queue = null
//                 maxRow = row - 1
//                 break
//             }

//             maxStrLen = Math.max(maxStrLen, str.length)
//             if (!renderTree[row]) {
//                 renderTree[row] = []
//             }
//             renderTree[row].push({
//                 row: row,
//                 column: column,
//                 total: len,
//                 str: str
//             })
//         }
//         row += 1
//     }
//     for (row = 0; row <= maxRow; row++) {
//         str = ''
//         arr = []
//         for (column = 0; column < renderTree[row].length; column++) {
//             if (column == 0) {
//                 str += ' '.repeat((Math.pow(2, (maxRow - row)) - 1) * maxStrLen - Math.floor(str.length / 2))
//             }
//             arr.push(renderTree[row][column].str)
//         }
//         console.log(str + arr.join(' '.repeat((Math.pow(2, (maxRow - row + 1)) - 1) * maxStrLen)))
//     }
//     console.log()
// }

module.exports = RedBlackTree