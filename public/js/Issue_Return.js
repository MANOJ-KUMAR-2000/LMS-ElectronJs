function stu_facu_issue() {
  book_ids = [];
  var role = document.getElementById("role").value;
  var role_number = document.getElementById("roll_number").value;
  if (role == "Student") {
    var roll_search = "Student_DB";
  } else {
    if (role == "Faculty") {
      var roll_search = "Faculty_DB";
    } else {
      var roll_search = "";
    }
  }
  for (let i = 0; i < document.getElementsByName("book_ids[]").length; i++) {
    book_ids.push(document.getElementsByName("book_ids[]")[i].value);
  }
  fetch("/issue-return/issue", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roll_number: role_number,
      role_search: roll_search,
      book_ids: book_ids,
      role: role,
    }),
  }).then((res) => {
    res.json().then((responce) => {
      if (responce.message == "Currently One of the Book is Not Available") {
        console.log(responce.message);
      } else {
        document.getElementById("role").value = "";
        document.getElementById("roll_number").value = "";

        var input_div = document.getElementById("book-id-input");
        input_div.innerHTML = "";

        var success_div = document.createElement("div");
        success_div.id = "success-div";
        success_div.innerHTML =
          "<div><span class='success-msg'>" +
          responce.message +
          "</span><a onclick='success_noted()'>OK</a></div>";
        document.body.appendChild(success_div);
      }
    });
  });
}

function stu_facu_return() {}

function stu_facu_check() {
  var role = document.getElementById("role").value;
  var role_number = document.getElementById("roll_number").value;

  if (role == "student") {
    var roll_search = "Student_DB";
  } else {
    if (role == "faculty") {
      var roll_search = "Faculty_DB";
    } else {
      var roll_search = "";
    }
  }

  fetch("/issue-return/check-issued", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roll_number: role_number,
      roll_search: roll_search,
    }),
  }).then((res) => {
    res.json().then((responce) => {
      console.log(responce.message);
      console.log(responce.roll_detail);
      console.log(responce.issued_detail);
    });
  });
}

function add_book() {
  var input_div = document.getElementById("book-id-input");
  var new_input = document.createElement("input");
  new_input.type = "text";
  new_input.name = "book_ids[]";
  input_div.append(new_input);
}

function remove_book() {
  var input_div = document.getElementById("book-id-input");
  if (document.getElementsByName("book_ids[]").length > 0) {
    input_div.removeChild(input_div.lastElementChild);
  }
}

function success_noted() {
  var noted_div = document.getElementById("success-div");
  noted_div.remove();
}
