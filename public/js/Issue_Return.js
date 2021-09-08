function stu_facu_issue() {
  document.getElementById("book-issue-message").innerHTML = "";
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
  if (book_ids[0] == undefined) {
    document.getElementById("book-issue-message").innerHTML = "No Book Entered";
  } else {
    document.getElementById("book-issue-message").innerHTML = "";
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
          document.getElementById("book-issue-message").innerHTML =
            responce.message;
        } else {
          document.getElementById("no-book-issue").innerHTML = "";
          document.getElementById("i-detail-head").innerHTML = "";
          document.getElementById("book-issue-check-table").innerHTML = "";
          document.getElementById("check-detail-rollnumber").innerHTML = "";
          document.getElementById("check-detail-name").innerHTML = "";
          document.getElementById("check-detail-department").innerHTML = "";
          document.getElementById("check-detail-batch").innerHTML = "";
          document.getElementById("check-error").innerHTML = "";
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
}

function stu_facu_issue_check() {
  document.getElementById("i-detail-head").innerHTML = "";
  document.getElementById("book-issue-check-table").innerHTML = "";
  document.getElementById("check-detail-rollnumber").innerHTML = "";
  document.getElementById("check-detail-name").innerHTML = "";
  document.getElementById("check-detail-department").innerHTML = "";
  document.getElementById("check-detail-batch").innerHTML = "";
  document.getElementById("check-error").innerHTML = "";

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
  if (role == "" || role_number == "" || roll_search == "") {
    document.getElementById("check-error").innerHTML = "Input Field Empty";
  } else {
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
        if (responce.roll_detail == undefined) {
          document.getElementById("curr_hold").style.display = "none";
          document.getElementById("issue-book-div").style.display = "none";
          document.getElementById("check-error").innerHTML =
            "Role Number Does Not Exist";
        } else {
          document.getElementById("no-book-issue").innerHTML = "";
          document.getElementById("curr_hold").style.display = "block";
          document.getElementById("issue-book-div").style.display = "block";
          document.getElementById("i-detail-head").innerHTML = "ID Details";
          document.getElementById("check-detail-rollnumber").innerHTML =
            "Roll Number &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp; " +
            responce.roll_detail.roll_number;
          document.getElementById("check-detail-name").innerHTML =
            "Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp; " +
            responce.roll_detail.name;
          document.getElementById("check-detail-department").innerHTML =
            "Department &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp; " +
            responce.roll_detail.department;
          if (responce.roll_detail.batch == undefined) {
            document.getElementById("check-detail-batch").innerHTML = "";
          } else {
            document.getElementById("check-detail-batch").innerHTML =
              "Batch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp; " +
              responce.roll_detail.batch;
          }
          var table_div = document.getElementById("book-issue-check-table");
          if (document.getElementsByClassName("table_exist")) {
            table_div.innerHTML = "";
          }

          var tblHead = document.createElement("thead");
          var th1 = document.createElement("th");
          th1.innerHTML = "Book ID";
          th1.className = "table_exist";
          var th2 = document.createElement("th");
          th2.innerHTML = "Book Title";
          tblHead.appendChild(th1);
          tblHead.appendChild(th2);

          var tbl = document.createElement("table");
          var tblBody = document.createElement("tbody");
          if (responce.issued_detail == undefined) {
            document.getElementById("no-book-issue").innerHTML =
              "No Book Issued";
          } else {
            for (var i = 0; i < responce.issued_detail.length; i++) {
              var row = document.createElement("tr");

              for (var j = 0; j < 2; j++) {
                var cell = document.createElement("td");
                if (j == 0) {
                  var cellText = document.createTextNode(
                    responce.issued_detail[i].book_id
                  );
                  cell.appendChild(cellText);
                  row.appendChild(cell);
                } else {
                  var cellText = document.createTextNode(
                    responce.issued_detail[i].book_title
                  );
                  cell.appendChild(cellText);
                  row.appendChild(cell);
                }
              }
              tblBody.appendChild(row);
            }
          }
          tbl.appendChild(tblHead);
          tbl.appendChild(tblBody);
          table_div.appendChild(tbl);
        }
      });
    });
  }
}

function stu_facu_return_check() {
  document.getElementById("r-detail-head").innerHTML = "";
  document.getElementById("book-issue-check-table").innerHTML = "";
  document.getElementById("r-check-detail-rollnumber").innerHTML = "";
  document.getElementById("r-check-detail-name").innerHTML = "";
  document.getElementById("r-check-detail-department").innerHTML = "";
  document.getElementById("r-check-detail-batch").innerHTML = "";
  document.getElementById("return-check-error").innerHTML = "";
  var role = document.getElementById("return_role").value;
  var role_number = document.getElementById("return_roll_number").value;
  var return_div = document.getElementById("return-check-bokes");
  return_div.innerHTML = "";

  if (role == "Student") {
    var roll_search = "Student_DB";
  } else {
    if (role == "Faculty") {
      var roll_search = "Faculty_DB";
    } else {
      var roll_search = "";
    }
  }
  if (role == "" || role_number == "" || roll_search == "") {
    document.getElementById("return-check-error").innerHTML =
      "Input Field Empty";
  } else {
    fetch("/issue-return/check-return", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
        roll_number: role_number,
        roll_search: roll_search,
      }),
    }).then((res) => {
      res.json().then((responce) => {
        if (responce.roll_detail == undefined) {
          document.getElementById("return-book-btn").style.display = "none";
          document.getElementById("return-check-error").innerHTML =
            "Role Number Does Not Exist";
        } else {
          if (responce.return_detail.length == 0) {
            document.getElementById("return-check-error").innerHTML =
              "No Book Issued";
          } else {
            document.getElementById("return-book-btn").style.display = "block";
            for (let i = 0; i < responce.return_detail.length; i++) {
              var return_div = document.getElementById("return-check-bokes");
              var radio_input_div = document.createElement("div");
              var radio_input = document.createElement("input");
              var radio_lable = document.createElement("label");
              radio_input.value = responce.return_detail[i].book_id;
              radio_input.type = "checkbox";
              radio_input.className = "radio_ids[]";
              radio_lable.innerHTML =
                responce.return_detail[i].book_id +
                " | " +
                responce.return_detail[i].book_title;
              radio_input_div.appendChild(radio_input);
              radio_input_div.appendChild(radio_lable);
              return_div.appendChild(radio_input_div);
            }

            document.getElementById("r-detail-head").innerHTML = "ID Details";
            document.getElementById("r-check-detail-rollnumber").innerHTML =
              "Roll Number &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp; " +
              responce.roll_detail.roll_number;
            document.getElementById("r-check-detail-name").innerHTML =
              "Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp; " +
              responce.roll_detail.name;
            document.getElementById("r-check-detail-department").innerHTML =
              "Department &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp; " +
              responce.roll_detail.department;
            if (responce.roll_detail.batch == undefined) {
              document.getElementById("r-check-detail-batch").innerHTML = "";
            } else {
              document.getElementById("r-check-detail-batch").innerHTML =
                "Batch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp; " +
                responce.roll_detail.batch;
            }
          }
        }
      });
    });
  }
}

function stu_facu_return() {
  document.getElementById("return-check-error").innerHTML = "";
  return_book_ids = [];
  for (
    let i = 0;
    i < document.getElementsByClassName("radio_ids[]").length;
    i++
  ) {
    if (document.getElementsByClassName("radio_ids[]")[i].checked) {
      return_book_ids.push(
        document.getElementsByClassName("radio_ids[]")[i].value
      );
    }
  }
  if (return_book_ids[0] == undefined) {
    document.getElementById("return-check-error").innerHTML =
      "No Book Selected";
  } else {
    var role_number = document.getElementById("return_roll_number").value;
    fetch("/issue-return/return", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        return_books: return_book_ids,
        return_roll_number: role_number,
      }),
    }).then((res) => {
      res.json().then((responce) => {
        if (responce.message == "Currently One of the Book is Not Available") {
          document.getElementById("book-return-message").innerHTML =
            responce.message;
        } else {
          document.getElementById("r-detail-head").innerHTML = "";
          document.getElementById("book-issue-check-table").innerHTML = "";
          document.getElementById("r-check-detail-rollnumber").innerHTML = "";
          document.getElementById("r-check-detail-name").innerHTML = "";
          document.getElementById("r-check-detail-department").innerHTML = "";
          document.getElementById("r-check-detail-batch").innerHTML = "";
          document.getElementById("return-check-error").innerHTML = "";
          document.getElementById("return_role").value = "";
          document.getElementById("return_roll_number").value = "";

          var return_div = document.getElementById("return-check-bokes");
          return_div.innerHTML = "";

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
}

function add_book() {
  if (document.getElementsByName("book_ids[]").length < 6) {
    var input_div = document.getElementById("book-id-input");
    var new_input = document.createElement("input");
    new_input.autocomplete = "off";
    new_input.placeholder = "Book ID";
    new_input.type = "text";
    new_input.name = "book_ids[]";
    input_div.append(new_input);
  }
}

function remove_book() {
  var input_div = document.getElementById("book-id-input");
  if (document.getElementsByName("book_ids[]").length > 0) {
    input_div.removeChild(input_div.lastElementChild);
  }
}

function success_noted() {
  document.getElementById("no-book-issue").innerHTML = "";
  document.getElementById("curr_hold").style.display = "none";
  document.getElementById("return-book-btn").style.display = "none";
  document.getElementById("issue-book-div").style.display = "none";
  var noted_div = document.getElementById("success-div");
  noted_div.remove();
}
