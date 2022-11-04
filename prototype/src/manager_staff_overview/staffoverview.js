const modal = $("#modal");
const staff_list = $("#staff_list");

const active_employees = [
  {
    name: "John Gatsby",
    role: "Team Member",
  },
];

const employee_list = [
  "Loki Dillon",
  "Myrtle Blake",
  "Lennox O'Moore",
  "Danika Sellers",
  "Alberto Dunkley",
  "Ross Kouma",
  "Perry Macgregor",
  "Demi-Lee Hawes",
  "Keagan Mccormick",
  "Guto Guest",
];
const roles = [
  "Team Leader",
  "Team Member",
  "Analyst",
  "Consultant",
];

// set default option to its current role so that when u click save changes u dont have to change every role from the first one in list
function get_roles_as_select_menu(selected_role) {
  let str = "";

  for (let i = 0; i < roles.length; i++) {
    if (selected_role === roles[i]) {
      str = str.concat("<option selected>" + roles[i] + "</option>");
    } else {
      str = str.concat("<option>" + roles[i] + "</option>");
    }
  }

  return str;
}

function open_modal() {
  update_employees();
  modal.css('display', "block");
}

function close_modal() {
  modal.css('display', "none");
}

$(function () {

});

// this will be database oriented later
function update_employees() {

  const employee_select = $("#employees");
  const role_select = $("#roles");

  employee_select.empty();
  for (let i = 0; i < employee_list.length; i++) {
    // prevent same employee being added twice
    const index = active_employees.findIndex(employee => employee.name === employee_list[i]);
    if (index === -1) {
      employee_select.append("<option>" + employee_list[i] + "</option>");
    }
  }

  role_select.empty();
  for (let i = 0; i < roles.length; i++) {
    role_select.append("<option>" + roles[i] + "</option>");
  }
}

function add_employee(eName, eRole) {
  //console.log(get_roles_as_select_menu());
  const emp_form = $("#emp_info")[0];

  active_employees.push({ name: eName, role: eRole });

  staff_list.append(`
  <li class="list-group-item employee_list_item"><span class="employee_list_item_name">${eName}</span>
    <span class="employee_list_item_role" style="float: right">${eRole}</span>
    <select class="form-select emp_role_select">
      ${get_roles_as_select_menu(eRole)}
      <option style="background-color: #FF0000;">DELETE EMPLOYEE</option>
    </select>
  </li>
  `);

  update_employees();
  /*
  console.log(active_employees);
  */
}

function update_roles() {
  const employee_list_items = $(".employee_list_item");
  employee_list_items.each(function () {

    let name_span = $(this).children(".employee_list_item_name");
    let ename = name_span.text();

    const selectmenu = $(this).first(".emp_role_select")[0];
    const role = $("option:selected", selectmenu).text();
    if (role === "DELETE EMPLOYEE") {
      $(this).remove();
      for (i = 0; i < active_employees.length; i++) {
        if (active_employees[i].name === ename) {
          active_employees.splice(i, 1);
          console.log(active_employees);
        }
      }
      console.log(ename);
      //console.log(active_employees);
      update_employees();
    } else {
      $(this).children(".employee_list_item_role")[0].textContent = role;
    }
  });
}


$('#add_employee_btn').on('click', function (e) {
  const eName = $("#employees :selected").text();
  const eRole = $("#roles :selected").text();
  add_employee(eName, eRole);
  close_modal();
});

$('#save_changes_btn').on('click', function (e) {
  update_roles();
});

/*

for all elements with class name:
	check value of span


*/
