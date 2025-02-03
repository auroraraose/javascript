import axios from "axios";

// API Endpoints
const API_URL = "http://localhost:3000/students";
const UPLOAD_URL = "http://localhost:3000/upload";

// Select UI Elements
const formBtn = document.getElementById("show-form") as HTMLButtonElement;
const tableBtn = document.getElementById("show-table") as HTMLButtonElement;
const studentForm = document.getElementById("student-form") as HTMLDivElement;
const studentTable = document.getElementById("student-table") as HTMLDivElement;
const studentList = document.getElementById("student-list") as HTMLTableSectionElement;
const studentFormElement = document.getElementById("add-student-form") as HTMLFormElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const ageInput = document.getElementById("age") as HTMLInputElement;
const gradeInput = document.getElementById("grade") as HTMLInputElement;
const saveBtn = document.getElementById("save-student") as HTMLButtonElement;
let editStudentId: number;

// Show Form and Table
formBtn.onclick = () => {
  studentForm.style.display = "block";
  studentTable.style.display = "none";
  resetForm();
  fetchStudents();
};

tableBtn.onclick = () => {
  studentForm.style.display = "none";
  studentTable.style.display = "block";
  fetchStudents();
};

// Fetch Students from API
function fetchStudents() {
  axios.get(API_URL)
    .then(response => {
      renderTable(response.data);
    })
    .catch(error => {
      console.error("Error fetching students:", error);
    });
}

// Render Student Table
function renderTable(students: any[]) {
  studentList.innerHTML = "";
  students.forEach((student) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.grade}</td>
      <td>
        <button class="edit-btn" data-id="${student.id}">Edit</button>
        <button class="delete-btn" data-id="${student.id}">Delete</button>
        <input type="file" accept="image/png" class="upload-file" data-id="${student.id}">
      </td>
    `;

    studentList.appendChild(row);
  });

  // Add event listeners to Edit and Delete buttons
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const id = parseInt((event.target as HTMLButtonElement).dataset.id || '0');
      if (id) editStudent(id);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const id = parseInt((event.target as HTMLButtonElement).dataset.id || '0');
      if (id) deleteStudent(id);
    });
  });

  document.querySelectorAll('.upload-file').forEach(input => {
    input.addEventListener('change', (event) => {
      const id = parseInt((event.target as HTMLInputElement).dataset.id || '0');
      if (id) uploadFile(id, event);
    });
  });
}

const checkStudentExists = async (id: number): Promise<boolean> => {
  try {
    const response = await axios.get(`/students/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error('Error checking student ID:', error);
    return false;
  }
};

// Move Student Details to Form for Editing
function editStudent(id: number) {
  studentForm.style.display = "block";
  studentTable.style.display = "none";
   debugger;
  axios.get(`${API_URL}/${id}`)
    .then(response => {
      const student = response.data;
      nameInput.value = student.name;
      ageInput.value = student.age.toString();
      gradeInput.value = student.grade;
      // saveBtn.innerText = "Update Student";
      editStudentId = id;
    })
    .catch(error => {
      if (error.response) {
        console.error("Error fetching student details:", error.response.data);
        alert("Failed to fetch student details. Please try again.");
      } else if (error.request) {
        console.error("Error: No response from server:", error.request);
        alert("No response from the server. Please check your connection.");
      } else {
        console.error("Error in request setup:", error.message);
        alert("An error occurred while setting up the request.");
      }
    });
}

// Add or Update Student
studentFormElement.onsubmit = (event) => {
  event.preventDefault(); 
  const studentData = {
    name: nameInput.value,
    age: Number(ageInput.value),
    grade: gradeInput.value
  };

  checkStudentExists(editStudentId).then((exists) => {
    if (exists) {
      // Update Existing Student
      axios.put(`${API_URL}/${editStudentId}`, studentData)
        .then(() => {
          alert("Student updated successfully!");
          fetchStudents();
          resetForm();
        })
        .catch(error => {
          console.error("Error updating student:", error);
        });
    } else {
      // Add New Student
      axios.post(API_URL, studentData)
        .then(() => {
          alert("Student added successfully!");
          // resetForm();
          fetchStudents();
          resetForm();
        })
        .catch(error => {
          console.error("Error adding student:", error);
        });
    }
  });
};

// Delete Student
function deleteStudent(id: number) {
  axios.delete(`${API_URL}/${id}`)
    .then(() => {
      alert("Student deleted!");
      fetchStudents();
      // studentTable.style.display = "block";
      // studentForm.style.display = "none";
    })
    .catch(error => {
      console.error("Error deleting student:", error);
    });
}

// Upload File
function uploadFile(id: number, event: Event) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files?.length) {
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    axios.post(UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(() => {
        alert(`File uploaded for Student ID: ${id}`);
      })
      .catch(error => {
        console.error("Error uploading file:", error);
      });
  }
}

// Reset Form
function resetForm() {
  nameInput.value = "";
  ageInput.value = "";
  gradeInput.value = "";
  saveBtn.innerText = "Save";
}
