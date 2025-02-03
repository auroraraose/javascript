import _ from 'lodash';

const numbers = [4, 2, 8, 6, 4, 2, 10, 8];
const users = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 35 },
    { id: 4, name: "David", age: 25 },
];
const sentence = "Hello World! Lodash is awesome.";
const obj1 = { a: 1, b: { c: 2 }, r: [2,3,4,5] };
const obj2 = { b: { d: 3 }, e: 4 };

export function findUserName(element) {
    const groupUsersByAge = (users) => {
        const res = _.groupBy(users, 'age');
        let resultText = 'Unique ages:\n';
        for (const age in res) {
            resultText += `Age ${age}\n`;
        }
        element.innerHTML = resultText;
        console.log(res);
    };

    groupUsersByAge(users);
}


export function groupUsersAge(element){
    const findUserByName = (users, name) => {
        var res =  _.find(users, { name: name });
        element.innerText = `User found: ${res.name}, Age: ${res.age}`;
        console.log(res);
    };
    findUserByName(users, "Charlie");
}

// console.log(groupUsersByAge(users));
