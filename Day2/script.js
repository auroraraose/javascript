async function getStudentJSON(){
   const apiRes = await fetch('http://localhost:3000/students');
   const data  = await apiRes.json();
   return data;
 }

 async function getTable() {

  showContainer();
   const student = await getStudentJSON();
   const tableBody = document.getElementById("table-body");
   tableBody.innerHTML = ''; 
   student.forEach((student, id) => {
     const row = document.createElement("tr");
     row.innerHTML = `
       <th scope="row">${student.id}</th>
       <td>${student.name}</td>
       <td>${student.age}</td>
       <td>${student.grade}</td>
       <td><button class="edit" id='${student.id}' onclick="edit('${student.id}')">Edit</button></td>
       <td><button class="delete" id='${student.id}' onclick="deletebyId('${student.id}')">delete</button></td>
       <td>  <input id="upload" type="file" accept='.png'> 
             <button class="upload"  onclick="upload()">Upload</button>
             </td>`;
     tableBody.appendChild(row);
   });
 }

 async function save() {
   const name = document.querySelector(".fName").value;
   const age = document.querySelector(".age").value;
   const grade = document.querySelector(".grade").value;

   const newStudent = {
     name: name,
     age: age,
     grade: grade,
   };

    await fetch(`http://localhost:3000/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    });
   
   document.querySelector(".id").value = '';
   document.querySelector(".fName").value = '';
   document.querySelector(".age").value = '';
   document.querySelector(".grade").value = '';

   getTable();
 }
 
 async function edit(id) {
  const response = await fetch(`http://localhost:3000/students/${id}`);
  const data = await response.json();

      console.log(data);
      hideContainer();

     document.querySelector(".fName").value = data.name;
     document.querySelector(".age").value = data.age;
     document.querySelector(".grade").value = data.grade;

     const updateButton = document.getElementById("savebtn");
      updateButton.onclick = function (){
        saveEditRecord(id);
        hideContainer();
      }
    }
   async function saveEditRecord(id) {

    
    const name = document.querySelector(".fName").value;
    const age = document.querySelector(".age").value;
    const grade = document.querySelector(".grade").value;
    
    const editStudent = {
      name: name,
      age: age,
      grade: grade,
    };
      await fetch(`http://localhost:3000/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editStudent),
      });
     getTable();
   }
   async function deletebyId(id){
     await fetch(`http://localhost:3000/students/${id}`,{
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
     });
     getTable();
   }

   async function upload(){
    debugger;
    const upload  = document.getElementById("upload");
    const formData = new FormData();
    formData.append('file',upload.files[0]);
    try{
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      console.log('uploaded', data);
    }catch(err){
      console.error(err);
      alert("only .png format");
    }
   }
    

 function hideContainer() {
   document.querySelector(".container-1").style.visibility = "hidden";
   document.querySelector(".container-2").style.visibility = "visible";
 }
 function showContainer() {
   document.querySelector(".container-1").style.visibility = "visible";
   document.querySelector(".container-2").style.visibility = "hidden";
 }

 getTable();




