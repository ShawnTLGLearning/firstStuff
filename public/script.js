// click #profile_btn to display profiles from http://localhost:8080/students inside of #profiles_container

document.querySelector("button").addEventListener("click", getStuff);
document.querySelector("form").addEventListener("click", postSomething);

function getStuff(e) {
  console.log("click");
  let URL = "http://localhost:8080/students";
  axios.get(URL).then((info) => {
    console.table(Object.values(info.data));
    document.getElementById(
      "profiles_container"
    ).innerHTML = info.data.map((student) => cardMaker(student)).join("");

    document.querySelectorAll('[magic="remove"]').forEach((element) => {
      element.addEventListener("click", deleteStuff);
    });
    document.querySelectorAll('[magic="edit"]').forEach((element) => {
      element.addEventListener("click", editStuff);
    });
  });
}

let cardMaker = (obj) => {
  let { name, linkedin, company, role, picture, _id } = obj;
  return `
      <div class="card" style="width: 18rem;" cardId=${_id}>
   <img class="card-img-top circle" src=${picture} alt="Card image cap">
   <div class="card-body">
     <h5 class="card-title">${name}, ${role} @ ${company}</h5>
     <a href="${linkedin}" class="btn btn-primary">LinkedIn</a>
     <button class="btn btn-secondary" magic="edit">Edit</button>
     <button class="btn btn-danger" magic="remove">Remove</button>
   </div>
 </div>
       `;
};

function deleteStuff(e) {
  console.log("clisomthingck");
  let card = e.target.parentElement.parentElement;
  let obj = { data: { _id: card.getAttribute("cardId") } };
  axios.delete("http://localhost:8080/students/", obj).then((info) => {
    console.log(info);
    getStuff();
  });
}

function editStuff(e) {
  let id = e.target.parentElement.parentElement.getAttribute("cardId");
  let URL = "http://localhost:8080/student/";
  axios.get(URL + id).then((info) => {
    let { name, linkedin, company, role, picture, _id } = info.data;
    console.log(info.data);
    name = prompt("New Name?", name);
    role = prompt("New Role?", role);
    company = prompt("New Company?", company);
    linkedin = prompt("New linkedIn?", linkedin);
    picture = prompt("New Picture?", picture);
    let obj = {
      stuff: {
        name,
        linkedin,
        company,
        role,
        picture,
      },
      _id,
    };
    axios.post("http://localhost:8080/update/", obj).then((info) => {
      console.log(info.data);
      getStuff();
    });
  });
}

function postSomething(e) {
  if (e.target.type === "submit") {
    e.preventDefault();
    let { name, role, company, linkedin, picture } = e.target.parentElement;
    let cardInfo = {
      name: name.value,
      role: role.value,
      company: company.value,
      linkedin: linkedin.value,
      picture: picture.value,
    };
    console.table(Object.entries(cardInfo));

    axios.post("http://localhost:8080/quotes/", cardInfo).then((res) => {
      console.log(res);
      getStuff();
    });
  }
}
