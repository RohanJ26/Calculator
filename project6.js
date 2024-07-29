const numbers=document.querySelectorAll(".numbers")
const operators=document.querySelectorAll(".operators")
const display=document.querySelector(".display")
const on=document.querySelector(".on")
const ac=document.querySelector(".ac")
const off=document.querySelector(".off")
const del=document.querySelector(".del")
const return_ans=document.querySelector(".return_ans")
const hist=document.querySelector(".hist")
const prev=document.querySelector(".prev")
const clr=document.querySelector(".clr")
let hist_count=-1;
let canWrite=false
let arr=[]

function displayEverything(content){
    if(canWrite){
        display.innerHTML+=content.innerHTML
    }
}

function clear(){
    display.innerHTML=""
}

function removeCharacter(str) {
    let n = str.length;
    let newString = "";
    for (let i = 0; i < n - 1; i++) {
        newString += str[i];
    }
    return newString;
}

numbers.forEach(function(number){
    number.addEventListener("click",function(e){
        displayEverything(number)
    })
})

operators.forEach(function(operator){
    operator.addEventListener("click",function(e){
        displayEverything(operator)
    })
})

on.addEventListener('click',(e)=>{
    canWrite=true
})
off.addEventListener('click',(e)=>{
    clear()
    canWrite=false
})
ac.addEventListener('click',function(e){
    clear()
})

del.addEventListener('click',function(e){
    display.innerHTML=removeCharacter(display.innerHTML)
})

hist.addEventListener('click',function(e){
    hist_count=-1;
    if(arr.length>0){
        display.innerHTML=`${arr[arr.length + hist_count].expression} = ${arr[arr.length + hist_count].exp_ans}`
    }
})
prev.addEventListener('click',function(e){
    hist_count-=1
    if(arr.length + hist_count>=0){
        display.innerHTML=`${arr[arr.length + hist_count].expression} = ${arr[arr.length + hist_count].exp_ans}`
    }
})

clr.addEventListener('click',function(e){
    arr=[];
    clear()
})

return_ans.addEventListener('click',function(e){
    display.innerHTML=removeCharacter(display.innerHTML)
    let inter_ans=in_to_post(display.innerHTML)
    let obj_ans=solve(inter_ans)
    if(obj_ans.toString().length>15){
        obj_ans=obj_ans.toFixed(7)
    }
    let ex=new calculator(display.innerHTML,obj_ans)
    arr.push(ex);
    display.innerHTML=obj_ans
})

class calculator{
    constructor(expression,exp_ans){
        this.expression=expression;
        this.exp_ans=exp_ans;
    }
}

function in_to_post(expression) {
    let output = [];
    let operators = [];
    let precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '(': 0
    };
    let associativity = {
        '+': 'L',
        '-': 'L',
        '*': 'L',
        '/': 'L'
    };
    expression = expression.replace(/\s+/g, "");
    for (let i = 0; i < expression.length; i++) {
        let token = expression[i];

        if (/\d|\./.test(token)) {
            let num = token;
            while (i + 1 < expression.length && /\d|\./.test(expression[i + 1])) {
                num += expression[++i];
            }
            output.push(num);
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                output.push(operators.pop());
            }
            operators.pop();
        } else if (['+', '-', '*', '/'].includes(token)) {
            while (
                operators.length &&
                precedence[operators[operators.length - 1]] >= precedence[token] &&
                associativity[token] === 'L'
            ) {
                output.push(operators.pop());
            }
            operators.push(token);
        }
    }
    while (operators.length) {
        output.push(operators.pop());
    }
    return output.join(" ");
}

function solve(expression) {
    let stack = [];
    let tokens = expression.split(" ");
    tokens.forEach(token => {
        if (!isNaN(token)) {
            stack.push(Number(token));
        } else {
            let b = stack.pop();
            let a = stack.pop();
            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    stack.push(a / b);
                    break;
                default:
                    throw new Error(`Unknown operator: ${token}`);
            }
        }
    });
    return stack.pop();
}