class Student {
    constructor(name, id){
        this.name = name;
        this.id = id;
    }
    async getData(){
        const response = await fetch('https://run.mocky.io/v3/2380ad60-44a1-4ee2-a19a-424773ccb224');
        const data = await response.json();
        return data;  
    }

    async studentById(id){
        const data = await this.getData();
        if (data.id == id) {
            this.name = data.name;  
            this.grade = data.grade;
        }
    }
}

async function main() {
    const s = new Student();
    const p = new Student("rao", 1);

    console.log(p.name + " " + p.id); 

}

main();
