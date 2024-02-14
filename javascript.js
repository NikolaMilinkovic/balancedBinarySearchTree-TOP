// Tree class constructor
class Tree {
    constructor(array){
        this.array = array;
        this.root = buildTree(array);
        this.preOrderValues = [];
        this.inOrderValues = [];
        this.postOrderValues = [];
    }

    sortArray(arr){
        return arr.sort((a, b) => a - b);
    }

    removeDuplicatesInArr(arr){
        let newArray = [];
        arr.forEach(element => {
            if(!newArray.includes(element))
                newArray.push(element);
        });
        return newArray;
    }
    
    // Method for inserting new values into the Tree
    insert(value, root = this.root){
        
        if (root === null){
            return new Node(value);
        }
        
        if (value < root.value){
            root.left = this.insert(value, root.left);
        }
        else if (value > root.value){
            root.right = this.insert(value, root.right);
        }
        
        return root;
    }
    
    // Method for removing values from the Tree
    remove(value, root = this.root, parent = null){

        if (root === null || root === undefined){
            return false;
        }

        if (root.value === value){

            // Removing leaf node
            if (root.left === null && root.right === null){

                if(parent.left === root){
                    parent.setLeft(null);
                }
                else{
                    parent.setRight(null);
                }
            }

            // Removing node with one child
            else if (root.left !== null && root.right === null){

                root.value = root.left.value;
                root.setRight(root.left.right);
                root.setLeft(null);
            }
            else if (root.right !== null && root.left === null){

                root.value = root.right.value;
                root.setLeft(root.right.left);
                root.setRight(null);
            }

            // Removing node with two children
            else {
                let successor = this.getSmallest(root.right);
                root.value = successor;
                this.remove(successor, root.right, root);
            }
            return true;
        }
        else if (value < root.value){
            return this.remove(value, root.left, root)
        }
        else if (value > root.value){
            return this.remove(value, root.right, root)
        }
    }
    
    // Method for searching the value inside the BST
    // Returns the requested node
    find(value, root = this.root){
        if (root === null || root === undefined){
            return false;
        }
        if (root.value === value){
            return root;
        }
        else if (value < root.value){
            return this.find(value, root.left)
        }
        else if (value > root.value){
            return this.find(value, root.right)
        }
    }

    // Method for finding the smallest value inside the given tree
    getSmallest(root = this.root){
        let smallest = root.value;

        if (root.left !== null){
            return this.getSmallest(root.left);
        }

        return smallest;
    }

    // Method that traverses the tree in breadth-first level order
    // Returns an array with all the values
    levelOrder(callback){
        let queue = [this.root];
        let levelOrderValues = [];
        !callback ? console.log() : console.log('Level order traversal:');

        while(queue.length > 0){
            let current = queue.shift();
            !callback ? levelOrderValues.push(current.value) : callback(current);

            if(current.left !== null) queue.push(current.left);
            if(current.right !== null) queue.push(current.right);
        }

        return levelOrderValues;
    }

    // Console logs each node value
    cLogValues(node){
        console.log(node.value);
    }

    // Inorder traversal method 
    inOrder(root = this.root, callback){
        if (root === null) return;

        this.inOrder(root.left);
        this.inOrderValues.push(root.value);
        this.inOrder(root.right);
    }

    // Preorder traversal method
    preOrder(root = this.root, callback){
        if (root === null) return;

        this.preOrderValues.push(root.value);
        this.preOrder(root.left);
        this.preOrder(root.right);
    }

    // Postorder traversal method
    postOrder(root = this.root, callback){
        if (root === null) return;
        let queue = [];

        // Level order traverse root.left
        queue = [root.left];
        while(queue.length > 0){
            let current = queue.shift();
            !callback ? this.postOrderValues.push(current.value) : callback(current);

            if(current.left !== null) queue.push(current.left);
            if(current.right !== null) queue.push(current.right);
        }

        // Level order traverse root.right
        queue = [root.right];
        while(queue.length > 0){
            let current = queue.shift();
            !callback ? this.postOrderValues.push(current.value) : callback(current);

            if(current.left !== null) queue.push(current.left);
            if(current.right !== null) queue.push(current.right);
        }

        // Add root.value at the end
        this.postOrderValues.push(root.value);
    }

    // Returns the height of the BST
    height(root = this.root){
        if(root === null) return -1;
        else {
            let left = this.height(root.left);
            let right = this.height(root.right);

            return Math.max(left, right) + 1;
        }
    }

    // Returns the given node's depth in the BST
    depth(value, root = this.root, depth = 0){
        if (root === null) return -1;
        if (root.value === value) return depth;

        // Checks left side of the tree for the value
        let left = this.depth(value, root.left, depth + 1);
        if (left !== -1) return left;

        // Checks right side of the tree for the value
        let right = this.depth(value, root.right, depth + 1);
        if (right !== -1) return right;

        return -1;
    }

    // Checks for BST balance and returns true / false
    isBalanced(root = this.root){
        let leftSubtree = this.height(root.left);
        let rightSubtree = this.height(root.right);

        if(leftSubtree === rightSubtree) return true;
        if(leftSubtree + 1 === rightSubtree) return true;
        if(leftSubtree - 1 === rightSubtree) return true;
        
        return false;
    }

    // Method for that rebalances unbalanced tree
    rebalance(){
        let isBalanced = this.isBalanced();
        console.log(isBalanced);
        if(isBalanced) return;
        else {
            this.inOrder();
            let arr = this.sortArray(this.removeDuplicatesInArr(this.inOrderValues));
            this.root = buildTree(arr, 0, arr.length - 1);
        }
    }
}

// Node class constructor
class Node {
    constructor(value = null){
        this.value = value;
        this.left = null;
        this.right = null;
    }
    setLeft(left){
        this.left = left;
    }
    setRight(right){
        this.right = right;
    }
}

// Method for creating a BST
function buildTree(array, start = 0, end = array.length - 1){
    if(start > end) return null;
    
    let mid = parseInt(Math.floor((start + end) / 2));
    let root = new Node(array[mid]);
    
    root.left = buildTree(array, start, mid - 1);
    root.right = buildTree(array, mid + 1, end);
    
    return root;
}

// Method for printing out the Tree
const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};

// =======================[TESTING]======================= //
let array = [10, 20, 30, 32, 34, 36, 40, 50, 60, 70, 80, 85];

let BST = new Tree(array);
console.log('Root is: ' + BST.root.value);
BST.insert(33);
BST.insert(83);
BST.insert(86);
BST.insert(81);
BST.insert(87);
BST.insert(86);
prettyPrint(BST.root);

console.log(BST.find(81));
console.log(BST.find(353535));
console.log(BST.find(87));
console.log(BST.find(8100));
console.log(BST.find(85));
BST.remove(36);
prettyPrint(BST.root);
BST.remove(85);
prettyPrint(BST.root);
BST.remove(70);
prettyPrint(BST.root);

BST.remove(40);
prettyPrint(BST.root);

BST.remove(30);
prettyPrint(BST.root);

BST.levelOrder();

BST.levelOrder(BST.cLogValues);
BST.inOrder();
BST.preOrder();
BST.postOrder();
BST.height();
BST.remove(81);
prettyPrint(BST.root);
BST.height();
BST.depth(50);

BST.isBalanced();
BST.insert(89);
BST.insert(5);
BST.insert(14);
BST.insert(7);
BST.insert(6);
BST.insert(9);
BST.insert(11);
BST.insert(13);
BST.insert(12);
BST.insert(14);
BST.isBalanced();
prettyPrint(BST.root);
BST.rebalance();
prettyPrint(BST.root);