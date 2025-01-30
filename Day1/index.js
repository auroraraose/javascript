
function cal(operation) {
    const num1 = Number(document.getElementById('num1').value);
    const num2 = Number(document.getElementById('num2').value);
    let result;

    if (num1==null || num2==null) {
        result = "valid numbers pls!";
    } else {
        switch (operation) {
            case 'add':
                result = num1 + num2;
                break;
            case 'subtract':
                result = num1 - num2;
                break;
            case 'multiply':
                result = num1 * num2;
                break;
            case 'divide':
                result = num2 !== 0 ? num1 / num2 : "Cannot divide by zero.";
                break;
            default:
                result = "Invalid operation.";
        }
    }
    debugger;
    document.getElementById('result').textContent=`Result : ${result}`;
    
}