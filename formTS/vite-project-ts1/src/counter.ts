import axios from "axios";

const API_URL = "http://localhost:3000/students/marks";

// Student Interface
export interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  marks: number;
}

export async function getStudentJSON(button: HTMLButtonElement): Promise<Student[] | void> {
  try {
    button.disabled = true;
    button.innerText = "Loading...";

    const response = await axios.get<Student[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching student data:", error);
  } finally {
    button.disabled = false;
    button.innerText = "Fetch Students";
  }
}

export async function upload(id: string): Promise<void> {
  try {
    const fileInput = document.getElementById(`upload-${id}`) as HTMLInputElement;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a .png file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const response = await axios.post(`http://localhost:3000/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("File uploaded successfully:", response.data);
    alert("Upload successful!");
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("Only .png format is allowed.");
  }
}

export async function saveEditRecord(id: string): Promise<void> {
  try {
    const name = (document.querySelector(".fName") as HTMLInputElement).value;
    const age = parseInt((document.querySelector(".age") as HTMLInputElement).value, 10);
    const grade = (document.querySelector(".grade") as HTMLInputElement).value;

    const updatedStudent: Partial<Student> = { name, age, grade };

    await axios.put(`http://localhost:3000/students/${id}`, updatedStudent);

    console.log(`Updated student with ID: ${id}`);
    alert("Student record updated successfully!");

    getTable(document.getElementById("fetch-btn") as HTMLButtonElement); 
    hideContainer(); 
  } catch (error) {
    console.error("Error updating student record:", error);
    alert("Failed to update student record.");
  }
}


export async function deleteById(id: string, button: HTMLButtonElement): Promise<void> {
  try {
    button.disabled = true;
    button.innerText = "Deleting...";

    await axios.delete(`http://localhost:3000/students/${id}`);
    console.log(`Deleted student with ID: ${id}`);

    getTable(button);
  } catch (error) {
    console.error("Error deleting student:", error);
  } finally {
    button.disabled = false;
    button.innerText = "Delete";
  }
}

export async function edit(id: string): Promise<void> {
  try {
    const response = await axios.get<Student>(`http://localhost:3000/students/${id}`);
    const student = response.data;

    (document.querySelector(".fName") as HTMLInputElement).value = student.name;
    (document.querySelector(".age") as HTMLInputElement).value = student.age.toString();
    (document.querySelector(".grade") as HTMLInputElement).value = student.grade;

    showContainer(); 

    const updateButton = document.getElementById("savebtn") as HTMLButtonElement;
    updateButton.onclick = function () {
      saveEditRecord(id);
    };
  } catch (error) {
    console.error("Error fetching student details:", error);
  }
}


export async function getTable(button: HTMLButtonElement): Promise<void> {
  showContainer();
  const students = await getStudentJSON(button);
  if (!students) return;

  const tableBody = document.getElementById("table-body") as HTMLElement;
  tableBody.innerHTML = "";

  students.forEach((student: Student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <th scope="row">${student.id}</th>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.grade}</td>
      <td>${student.marks}</td>
      <td><button class="edit" data-id="${student.id}">Edit</button></td>
      <td><button class="delete" data-id="${student.id}">Delete</button></td>
      <td>
        <input type="file" accept=".png" id="upload-${student.id}"> 
        <button class="upload" data-id="${student.id}">Upload</button>
      </td>`;
    tableBody.appendChild(row);
  });
  document.querySelectorAll(".edit").forEach((btn) =>
    btn.addEventListener("click", (event) => {
      const id = (event.target as HTMLButtonElement).getAttribute("data-id");
      if (id) edit(id);
    })
  );
  document.querySelectorAll(".delete").forEach((btn) =>
    btn.addEventListener("click", (event) => {
      const id = (event.target as HTMLButtonElement).getAttribute("data-id");
      if (id) deleteById(id, button);
    })
  );

  document.querySelectorAll(".upload").forEach((btn) =>
    btn.addEventListener("click", (event) => {
      const id = (event.target as HTMLButtonElement).getAttribute("data-id");
      if (id) upload(id);
    })
  );
}

export function hideContainer(): void {
  const container1 = document.querySelector(".container-1") as HTMLElement;
  const container2 = document.querySelector(".container-2") as HTMLElement;

  if (container1 && container2) {
    container1.style.visibility = "hidden";
    container2.style.visibility = "visible";
  }
}

export function showContainer(): void {
  const container1 = document.querySelector(".container-1") as HTMLElement;
  const container2 = document.querySelector(".container-2") as HTMLElement;

  if (container1 && container2) {
    container1.style.visibility = "visible";
    container2.style.visibility = "hidden";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const fetchButton = document.getElementById("fetch-btn") as HTMLButtonElement;
  fetchButton.addEventListener("click", () => getTable(fetchButton));

  document.querySelector(".hide_me")?.addEventListener("click", hideContainer);
  document.querySelector(".show_me")?.addEventListener("click", showContainer);
});
