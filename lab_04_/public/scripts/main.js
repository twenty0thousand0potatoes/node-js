"use strign";

const loader = document.querySelector(".pop_up_loader");
const add_form = document.querySelector(".pop_up_add_elem");
const edit_pop_up_win = document.querySelector(".pop_up_edit_elem");
const table_body = document.querySelector(".table tbody");

const image_url = "../images/cart.png";
const image = document.createElement("img");
image.src = image_url;

let add_user_form;
let edit_form;
const dataObj = {};

const edit_data = (e) => {
  e.preventDefault();

  const form_data = new FormData(edit_form);
  const mess_server_p = document.querySelector(".message_server");

  form_data.forEach((value, key) => {
    dataObj[key] = value;
  });

  fetch("http://localhost:5000/api/db", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataObj),
  })
    .then((response) => {
      if (response.status === 422) {
        return response.json().then((error) => {
          mess_server_p.style.color = "red";
          mess_server_p.textContent = error.message;
        });
      } else {
        return response.json().then((data) => {
          mess_server_p.style.color = "green";
          mess_server_p.textContent = data.message;

          get(insert_data);
        });
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
};

function convertDateToISOFormat(dateString) {
  const parts = dateString.split(".");
  if (parts.length === 3) {
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    const isoDate = `${year}-${month}-${day}`;
    return isoDate;
  }
  return "";
}

const replacement_row = (data) => {
  edit_pop_up_win.classList.toggle("visible");
  edit_form = document.querySelector(".edit_form");
  edit_form.addEventListener("submit", edit_data);

  const idField = document.getElementById("edit_id_user");
  const nameField = document.getElementById("edit_name_user");
  const dateBDField = document.getElementById("edit_bd_user");

  const inputs = [idField, nameField, dateBDField];

  inputs.forEach((item, index) => {
    if (index < 2) item.value = data[index];
  });

  dateBDField.value = convertDateToISOFormat(data[2]);
  dataObj["oldID"] = idField.value;
};

const insert_data = (data) => {
  table_body.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.dateBD}</td>
      <td class="delete_btn" onClick = delete_elem(event) style="background-image: url('${image_url}'); background-repeat: no-repeat;  background-position: center center;"></td>
    `;

    row.addEventListener("dblclick", () => {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });

      const cells = row.querySelectorAll("td");
      const rowData = {};
      
      cells.forEach((cell, index) => {
        rowData[index] = cell.textContent;
      });

      replacement_row(rowData);
    });

    table_body.appendChild(row);
  });
};

const get = (callback) => {
  fetch("http://localhost:5000/api/db", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      callback(data);
    });
};

const add_elem_btn = document.getElementById("add_elem");
const close_cross = document.querySelector(".close_pop_up");
const close_cross_edit_pop_up = document.querySelector(".close_edit_pop_up");

close_cross_edit_pop_up.addEventListener("click", () => {

  edit_form.removeEventListener("submit", edit_data);

  const mess_server_p = document.querySelector(".message_server");
  mess_server_p.textContent = "";
  mess_server_p.style.color = "#000";

  get(insert_data);

  edit_pop_up_win.classList.toggle("visible");
  document.querySelector("body").style.overflow = "scroll";

});

const clear_form = () => {

  add_user_form = document.querySelector(".form");
  add_user_form.reset();

  const mess_server_p = document.querySelector(".message_server_1");

  mess_server_p.textContent = "";
  mess_server_p.style.color = "#000";

};

const form_work = (event) => {
  event.preventDefault();

  const formData = new FormData(add_user_form);
  const mess_server_p = document.querySelector(".message_server_1");

  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  fetch("http://localhost:5000/api/db", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 422) {
        return response.json().then((error) => {

          mess_server_p.style.color = "red";
          mess_server_p.textContent = error.message;

        });
      } else {
        return response.json().then((data) => {

          mess_server_p.style.color = "green";
          mess_server_p.textContent = data.message;

          get(insert_data);
        });
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
};

close_cross.addEventListener("click", () => {
  clear_form();

  add_user_form.removeEventListener("submit", form_work);
  add_form.classList.toggle("visible");

  document.querySelector("body").style.overflow = "scroll";

});

add_elem_btn.addEventListener("click", (e) => {

  add_form.classList.toggle("visible");
  document.querySelector("body").style.overflow = "hidden";

  add_user_form = document.querySelector(".form");
  add_user_form.addEventListener("submit", form_work);

});

const del_btns = document.querySelectorAll(".delete_btn");

const delete_elem = (event) => {
  
  loader.classList.toggle("visible");

  let clickedCell = event.target;
  let id = clickedCell.parentElement.firstElementChild.textContent;

  setTimeout(() => {
    fetch(`http://localhost:5000/api/db?id=${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "text/plain",
        "Content-Accept": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        loader.classList.toggle("visible");
        insert_data(data);
      });
  }, 2000);

};

get(insert_data);