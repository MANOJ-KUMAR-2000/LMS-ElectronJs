var link = window.location.href;
var re = /#/;

var id_code = link.split("/");
id_code = id_code[id_code.length - 1]

var elements_to_rem = document.getElementsByClassName("active");
for (let i = 0; i < elements_to_rem.length; i++) {
    elements_to_rem[i].classList.remove("active");
}

var element_to_active = document.getElementById(id_code);
element_to_active.classList.add("active");