import axios from 'axios';
import Chart from 'chart.js/auto';
import { z } from 'zod';

interface Student {
  id?: number;
  name: string;
  age: number;
  grade: string;
  mark: number;
}

const StudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(1, "Age is required"),
  grade: z.enum(["A", "B", "C", "D", "F"], {
    errorMap: () => ({ message: "Grade must be between A and F" })
  }),
  mark: z.number().min(0).max(100, "Marks must be between 0 and 100"),
});
const API_URL = 'http://localhost:3000/students';

document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const studentListLink = document.getElementById('studentListLink');
  const studentUpdateLink = document.getElementById('studentUpdateLink');
  let editingStudentId: number | null = null;

  async function fetchStudents(): Promise<Student[]> {
    try {
      const response = await axios.get<Student[]>(API_URL);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students.');
      return [];
    }
  }

  async function renderStudents(): Promise<void> {
    if (!content) return;
    const students = await fetchStudents();
    if (students.length === 0) {
      content.innerHTML = '<p>No students found. Add a student.</p>';
      return;
    }

    const tableHTML = `
      <div>
        <canvas id="studentChart" style="width: 100%; height: 300px; margin-bottom: 20px;"></canvas>
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Grade</th>
              <th>Marks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(student => `
              <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.grade}</td>
                <td>${student.mark}</td>
                <td>
                  <button class="edit-btn" data-id="${student.id}">Edit</button>
                  <button class="delete-btn" data-id="${student.id}">Delete</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    content.innerHTML = tableHTML;
    renderChart(students);
    attachEventListeners();
  }

  function renderChart(students: Student[]): void {
    const canvas = document.getElementById('studentChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    
    const gradeCounts: Record<string, number> = {};
    students.forEach(student => {
      gradeCounts[student.grade] = (gradeCounts[student.grade] || 0) + 1;
    });

    const labels = Object.keys(gradeCounts).sort();
    const data = labels.map(label => gradeCounts[label]);

    // Destroy 
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Students per Grade',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Grade Distribution'
          }
        }
      }
    });
  }

  function attachEventListeners(): void {
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async (event) => {
        const target = event.target as HTMLButtonElement;
        const studentId = target.dataset.id;
        if (studentId && confirm('Are you sure you want to delete this student?')) {
          await deleteStudent(parseInt(studentId));
        }
      });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', async (event) => {
        const target = event.target as HTMLButtonElement;
        const studentId = target.dataset.id;
        if (studentId) {
          await loadStudent(parseInt(studentId));
        }
      });
    });
  }

  async function deleteStudent(studentId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${studentId}`);
      await renderStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student.');
    }
  }

  async function loadStudent(studentId: number): Promise<void> {
    try {
      const response = await axios.get<Student>(`${API_URL}/${studentId}`);
      const student = response.data;
      editingStudentId = student.id || null;
      renderForm(student);
    } catch (error) {
      console.error('Error loading student:', error);
      alert('Failed to load student.');
    }
  }

  function renderForm(student: Student | null = null): void {
    if (!content) return;
    content.innerHTML = `
      <form id="studentForm">
        <input type="text" id="studentName" placeholder="Name" value="${student?.name ?? ''}" required>
        <input type="number" id="studentAge" placeholder="Age" value="${student?.age ?? ''}" required min="1" max="150">
        <input type="text" id="studentGrade" placeholder="Grade" value="${student?.grade ?? ''}" required>
        <input type="number" id="studentMarks" placeholder="Marks" value="${student?.mark ?? ''}" required min="0" max="100">
        <button type="submit">Save</button>
      </form>`;

    document.getElementById('studentForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await saveStudent();
    });
  }

  async function saveStudent(): Promise<void> {
    const studentName = (document.getElementById('studentName') as HTMLInputElement).value.trim();
    const studentAge = parseInt((document.getElementById('studentAge') as HTMLInputElement).value);
    const studentGrade = (document.getElementById('studentGrade') as HTMLInputElement).value.trim();
    const studentMarks = parseInt((document.getElementById('studentMarks') as HTMLInputElement).value);

    const parsed = StudentSchema.safeParse({ name: studentName, age: studentAge, grade: studentGrade, mark: studentMarks });
    if (!parsed.success) {
      alert(parsed.error.format());
      return;
    }

    try {
      if (editingStudentId !== null) {
        await updateStudent(editingStudentId, parsed.data);
      } else {
        await createStudent(parsed.data);
      }
      editingStudentId = null;
      alert('Student saved successfully!');
      await renderStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student.');
    }
  }

  async function createStudent(student: Student): Promise<void> {
    await axios.post(API_URL, student);
  }

  async function updateStudent(studentId: number, student: Student): Promise<void> {
    await axios.put(`${API_URL}/${studentId}`, student);
  }

  studentListLink?.addEventListener('click', (e) => {
    e.preventDefault();
    renderStudents();
  });

  studentUpdateLink?.addEventListener('click', (e) => {
    e.preventDefault();
    renderForm();
  });

  renderStudents();
});