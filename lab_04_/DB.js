import EventEmitter from "events";
import { data } from "./data.js";

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

class DB extends EventEmitter {

  sort(){
    data.sort((a, b) => a.id - b.id);
  }

  get() {
    return data;
  }

  post(object_data) {
    if (data.some((user) => Number(user.id) == Number(object_data.id))) {
      return false;
    } else {
      object_data.dateBD =  formatDate( new Date(object_data.dateBD));
      data.push(object_data);
      return true;
    }
  }

  put(old_id, replacement_object_data) {
    const index = data.findIndex((obj) => Number(obj.id) == Number(old_id));

    replacement_object_data["dateBD"] = formatDate(new Date(replacement_object_data.dateBD));;
    if (index !== -1) {
      data[index] = replacement_object_data;
      return true;
    }
    return false;
  }

  delete(id) {

    let copydata = data.filter((item) => Number(item.id) != Number(id));
    
    copydata.map((item, index) => {
      data[index] = item;
    });
  }
}

export { DB };
