var RedBlackTree = require('../index')


//example 1
var tree = new RedBlackTree()

//set comparator
tree.setComparator(function(value1, value2) {
    return value1.id >= value2.id
})


var tom = {id: 1,name: 'tom'}
var jack = {id: 10,name: 'jack'}
var tim = {id: 33,name: 'tim'}

tree.insert(tom)
tree.insert(tim)
tree.insert(jack)

//check if element exists in tree
console.log(tree.has(tom))  //return true
console.log(tree.has({id:1,name:'tom'})) //return false

//count nodes in tree
console.log(tree.count()) //return 3

//delete an element in tree
tree.delete(tom)

console.log(tree.count()) //return 2



//example 2
var tree = new RedBlackTree()
for(var i = 1; i <= 10; i++) {
    tree.insert(i)
}

//get the min value in tree
console.log(tree.getMinValue()) //return 1

//get the max value in tree
console.log(tree.getMaxValue()) //return 10

//get the inorder sequence
console.log(tree.getInOrderSequence()) //return [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]