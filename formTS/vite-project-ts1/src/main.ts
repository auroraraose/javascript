import axios from "axios";
import { Chart } from "chart.js";

const formContainer = document.getElementById("formContainer") as HTMLElement;
const tableContainer = document.getElementById("tableContainer") as HTMLElement;
const chartContainer = document.getElementById("chartContainer") as HTMLElement;
const studentTable = document.getElementById("studentTable") as HTMLTableElement;
const studentForm = document.getElementById("studentForm") as HTMLFormElement;

document.getElementById("showForm")?.addEventListener("click", () => {
    formContainer.style.display = "block";
    tableContainer.style.display = "none";
    chartContainer.style.display = "none";
});

document.getElementById("showTable")?.addEventListener("click", () => {
    formContainer.style.display = "none";
    tableContainer.style.display = "block";
    chartContainer.style.display = "none";
    fetchStudents();
});

document.getElementById("showChart")?.addEventListener("click", () => {
    formContainer.style.display = "none";
    tableContainer.style.display = "none";
    chartContainer.style.display = "block";
    generateChart();
});

// Fetch students and populate the table
function fetchStudents() {
    axios.get("http://localhost:3000/students")
        .then(response => {
            return axios.get("http://localhost:3000/students/marks").then(marksRes => {
                return { students: response.data, marks: marksRes.data };
            });
        })
        .then(({ students, marks }) => {
            studentTable.innerHTML = "";
            students.forEach((student: any) => {
                const markRecord = marks.find((m: any) => m.id === student.id);
                const row = `<tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.age}</td>
                    <td>${student.grade}</td>
                    <td>${markRecord ? markRecord.mark : "N/A"}</td>
                    <td>
                        <button onclick="editStudent(${student.id})">Edit</button>
                        <button onclick="deleteStudent(${student.id})">Delete</button>
                    </td>
                </tr>`;
                studentTable.innerHTML += row;
            });
        })
        .catch(error => console.error("Error fetching students:", error));
}

// Handle form submission
studentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const studentId = (document.getElementById("studentId") as HTMLInputElement).value;
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const age = parseInt((document.getElementById("age") as HTMLInputElement).value);
    const grade = (document.getElementById("grade") as HTMLInputElement).value;

    if (studentId) {
        // Update student
        axios.put(`http://localhost:3000/students/${studentId}`, { name, age, grade })
            .then(() => fetchStudents());
    } else {
        // Add new student
        axios.post("http://localhost:3000/students", { name, age, grade })
            .then(() => fetchStudents());
    }

    studentForm.reset();
});

// Edit student function
function editStudent(id: number) {
    axios.get(`http://localhost:3000/students/${id}`)
        .then(response => {
            (document.getElementById("studentId") as HTMLInputElement).value = response.data.id;
            (document.getElementById("name") as HTMLInputElement).value = response.data.name;
            (document.getElementById("age") as HTMLInputElement).value = response.data.age;
            (document.getElementById("grade") as HTMLInputElement).value = response.data.grade;
            formContainer.style.display = "block";
            tableContainer.style.display = "none";
        })
        .catch(error => console.error("Error fetching student:", error));
}

// Delete student function
function deleteStudent(id: number) {
    axios.delete(`http://localhost:3000/students/${id}`)
        .then(() => fetchStudents())
        .catch(error => console.error("Error deleting student:", error));
}

// Generate Chart
function generateChart() {
    axios.get("http://localhost:3000/students/marks")
        .then(response => {
            
            const names = response.data.map((s: any) => s.name);
            const marks = response.data.map((s: any) => s.mark);

            const ctx = (document.getElementById("marksChart") as HTMLCanvasElement).getContext("2d");
            new Chart(ctx!, {
                type: "bar",
                data: {
                    labels: names,
                    datasets: [{
                        label: "Marks",
                        data: marks,
                        backgroundColor: "blue",
                        borderColor: "black",
                        borderWidth: 1
                    }]
                }
            });
        })
        .catch(error => console.error("Error fetching chart data:", error));
}

// Allow global access to functions for button clicks
(window as any).editStudent = editStudent;
(window as any).deleteStudent = deleteStudent;
