import '../utils/redirect';

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

  for (const role of roles) {
    const selected = selected_role === role;

    str += `<option ${selected ? 'selected' : ''} >${role}</option>`;
  }

  return str;
}

window.open_modal = function open_modal() {
  update_employees();
  modal.css('display', "block");
}

window.close_modal = function close_modal() {
  modal.css('display', "none");
}

$(function () {

});

// this will be database oriented later
function update_employees() {

  const employee_select = $("#employees");
  const role_select = $("#roles");

  employee_select.empty();

  for (const emp_name of employee_list) {
    // prevent same employee being added twice
    const index = active_employees.findIndex(employee => employee.name === emp_name);
    if (index === -1) {
      employee_select.append(`<option>${emp_name}</option>`);
    }
  }

  role_select.empty();
  for (let i = 0; i < roles.length; i++) {
    role_select.append(`<option>${roles[i]}</option>`);
  }
}

function add_employee(eName, eRole) {
  //console.log(get_roles_as_select_menu());
  const emp_form = $("#emp_info")[0];

  active_employees.push({ name: eName, role: eRole });

  staff_list.append(`
  <li class="list-group-item employee_list_item">
    <span class="employee_list_item_name">${eName}</span>
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
    const $this = $(this);

    const ename = $this.find(".employee_list_item_name").text();

    const role = $this.find("option:selected").text();

    if (role === "DELETE EMPLOYEE") {
      $this.remove();
      for (let i = 0; i < active_employees.length; i++) {
        if (active_employees[i].name === ename) {
          active_employees.splice(i, 1);
          console.log(active_employees);
        }
      }
      console.log(ename);
      //console.log(active_employees);
      update_employees();
    } else {
      $this.find(".employee_list_item_role").text(role);
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
