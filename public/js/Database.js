function add_student() {
  document.getElementById("stu_error_message").innerHTML = "";

  var roll_number = document.getElementById("stu_roll_number").value;
  var name = document.getElementById("stu_name").value;
  var batch = document.getElementById("stu_batch").value;
  var department = document.getElementById("stu_department").value;
  if (roll_number == "" || name == "" || batch == "" || department == "") {
    document.getElementById("stu_error_message").innerHTML =
      "Input Field is Empty";
  } else {
    fetch("/add-view/add-student", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roll_number: roll_number,
        name: name,
        batch: batch,
        department: department,
      }),
    }).then((res) => {
      res.json().then((responce) => {
        if (responce.message == "Student Added Succesfully") {
          var success_div = document.createElement("div");
          success_div.id = "success-div";
          success_div.innerHTML =
            "<div><span class='success-msg'>" +
            responce.message +
            "</span><a onclick='success_noted()'>OK</a></div>";
          document.body.appendChild(success_div);
          document.getElementById("stu_roll_number").value = "";
          document.getElementById("stu_name").value = "";
          document.getElementById("stu_batch").value = "";
          document.getElementById("stu_department").value = "";
        } else {
          document.getElementById("stu_error_message").innerHTML =
            responce.message;
        }
      });
    });
  }
}

function add_student_xlsx() {
  document.getElementById("stu_xlsx_success_message").innerHTML = "";
  document.getElementById("stu_xlsx_error_message").innerHTML = "";
  if (document.getElementById("student_excel_file").files[0] == undefined) {
    document.getElementById("stu_xlsx_error_message").innerHTML =
      "No File Selected";
  } else {
    var data = new FormData();
    data.append("file", document.getElementById("student_excel_file").files[0]);
    fetch("/upload/students", {
      method: "POST",
      body: data,
    }).then((res) => {
      res.json().then((responce) => {
        if (responce.message == "Successfully Students Added to Library") {
          var success_div = document.createElement("div");
          success_div.id = "success-div";
          success_div.innerHTML =
            "<div><span class='success-msg'>" +
            responce.message +
            "</span><a onclick='success_noted()'>OK</a></div>";
          document.body.appendChild(success_div);
          document.getElementById("student_excel_file").value = "";
        } else {
          document.getElementById("student_excel_file").value = "";
          document.getElementById("stu_xlsx_error_message").innerHTML =
            responce.message;
        }
      });
    });
  }
}

function add_faculty() {
  document.getElementById("facu_error_message").innerHTML = "";

  var roll_number = document.getElementById("facu_roll_number").value;
  var name = document.getElementById("facu_name").value;
  var department = document.getElementById("facu_department").value;

  if (roll_number == "" || name == "" || department == "") {
    document.getElementById("facu_error_message").innerHTML =
      "Input Filed is Empty";
  } else {
    fetch("/add-view/add-faculty", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roll_number: roll_number,
        name: name,
        department: department,
      }),
    }).then((res) => {
      res.json().then((responce) => {
        if (responce.message == "Faculty Added Successfully") {
          var success_div = document.createElement("div");
          success_div.id = "success-div";
          success_div.innerHTML =
            "<div><span class='success-msg'>" +
            responce.message +
            "</span><a onclick='success_noted()'>OK</a></div>";
          document.body.appendChild(success_div);
          document.getElementById("facu_roll_number").value = "";
          document.getElementById("facu_name").value = "";
          document.getElementById("facu_department").value = "";
        } else {
          document.getElementById("facu_error_message").innerHTML =
            responce.message;
        }
      });
    });
  }
}

function add_faculty_xlsx() {
  document.getElementById("facu_xlsx_success_message").innerHTML = "";
  document.getElementById("facu_xlsx_error_message").innerHTML = "";
  if (document.getElementById("faculty_excel_file").files[0] == undefined) {
    document.getElementById("facu_xlsx_error_message").innerHTML =
      "No file Selected";
  } else {
    var data = new FormData();
    data.append("file", document.getElementById("faculty_excel_file").files[0]);
    fetch("/upload/facultys", {
      method: "POST",
      body: data,
    }).then((res) => {
      res.json().then((responce) => {
        if (responce.message == "Successfully Facultys Added to Library") {
          var success_div = document.createElement("div");
          success_div.id = "success-div";
          success_div.innerHTML =
            "<div><span class='success-msg'>" +
            responce.message +
            "</span><a onclick='success_noted()'>OK</a></div>";
          document.body.appendChild(success_div);
          document.getElementById("faculty_excel_file").value = "";
        } else {
          document.getElementById("faculty_excel_file").value = "";
          document.getElementById("facu_xlsx_error_message").innerHTML =
            responce.message;
        }
      });
    });
  }
}

function add_book() {
  document.getElementById("book_error_message").innerHTML = "";
  var book_id = document.getElementById("book_id").value;
  var title = document.getElementById("book_title").value;
  var author = document.getElementById("book_author").value;
  var author_type = document.getElementById("book_author_type").value;
  var publisher = document.getElementById("book_publisher").value;

  if (title == "" || author == "" || author_type == "" || publisher == "") {
    document.getElementById("book_error_message").innerHTML =
      "Input Field is Empty";
  } else {
    fetch("/add-view/add-book", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        book_id: book_id,
        title: title,
        author: author,
        author_type: author_type,
        publisher: publisher,
      }),
    }).then((res) => {
      res.json().then((responce) => {
        if (responce.message == "Book Sucessfully Added") {
          var success_div = document.createElement("div");
          success_div.id = "success-div";
          success_div.innerHTML =
            "<div><span class='success-msg'>" +
            "Book Sucessfully Added</span><a onclick='success_noted()'>OK</a></div>";
          document.body.appendChild(success_div);
          document.getElementById("book_id").value = "";
          document.getElementById("book_title").value = "";
          document.getElementById("book_author").value = "";
          document.getElementById("book_author_type").value = "";
          document.getElementById("book_publisher").value = "";
        } else {
          document.getElementById("book_error_message").innerHTML =
            responce.message;
        }
      });
    });
  }
}

function add_book_xlsx() {
  document.getElementById("book_xlsx_success_message").innerHTML = "";
  document.getElementById("book_xlsx_error_message").innerHTML = "";

  if (document.getElementById("book_excel_file").files[0] == undefined) {
    document.getElementById("book_xlsx_error_message").innerHTML =
      "No File Selected";
  } else {
    var data = new FormData();
    data.append("file", document.getElementById("book_excel_file").files[0]);
    fetch("/upload/books", {
      method: "POST",
      body: data,
    }).then((res) => {
      res.json().then((responce) => {
        if (responce.message == "Successfully Books Added to Library") {
          var success_div = document.createElement("div");
          success_div.id = "success-div";
          success_div.innerHTML =
            "<div><span class='success-msg'>Books Successfully Added to Library</span><a onclick='success_noted()'>OK</a></div>";
          document.body.appendChild(success_div);
          document.getElementById("book_excel_file").value = "";
        } else {
          document.getElementById("book_excel_file").value = "";
          document.getElementById("book_xlsx_error_message").innerHTML =
            responce.message;
        }
      });
    });
  }
}

function success_noted() {
  document.getElementById("facu_error_message").innerHTML = "";
  document.getElementById("book_error_message").innerHTML = "";
  document.getElementById("stu_error_message").innerHTML = "";
  var noted_div = document.getElementById("success-div");
  noted_div.remove();
}
