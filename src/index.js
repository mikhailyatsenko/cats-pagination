const catsDiv = document.getElementById("cats");
const errorMessage = document.querySelector(".error");
let catsInString = "";
const preloader = document.querySelector(".spinner-border");
let url = `https://api.thecatapi.com/v1/images/search?limit=3&page=`;
const apiKey = "5cfde797-b89b-4074-9577-1cd0060f9e50";
const options = {
  headers: {
    "x-api-key": apiKey,
  },
};

const paginationUl = document.querySelector(".pagination");
let totalPages;
let page;

setTimeout(infiniteCats, 1000);

function showNetworkError() {
  errorMessage.classList.remove("hidden");
}

function hideNetworkError() {
  if (!errorMessage.classList.contains("hidden")) {
    errorMessage.classList.add("hidden");
  }
}

function showPreloader() {
  preloader.classList.remove("hidden");
}

function hidePreloader() {
  if (!preloader.classList.contains("hidden")) {
    preloader.classList.add("hidden");
  }
}

async function infiniteCats(page = 1) {
  showPreloader();
  try {
    catsInString = "";
    let pageInFetch = page - 1;
    let response = await fetch(url + pageInFetch, options);
    totalPages = response.headers.get("pagination-count");
    const jsonToArray = await response.json();

    for (let key in jsonToArray) {
      catsInString += `
        <div class="image"><img src="${jsonToArray[key].url}"></div>
      `;
    }

    catsDiv.innerHTML = catsInString;

    hidePreloader();
    hideNetworkError();
  } catch (error) {
    showNetworkError();
  }

  paginationUl.innerHTML = createPagination(totalPages, page);
  return;
}

function createPagination(totalPages, page) {
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;

  if (page > 1) {
    liTag += `<li class="page-item" onclick="createPagination(totalPages, ${
      page - 1
    });">Previous</li>`;
  }

  if (page > 2) {
    //if page value is less than 2 then add 1 after the previous button
    liTag += `<li class="page-item" onclick="createPagination(totalPages, 1);">1</li>`;

    if (page > 3) {
      //if page value is greater than 3 then add this (...) after the first li or page
      liTag += `<li class="page-item"><span>...</span></li>`;
    }
  }

  // how many pages or li show before the current li
  if (page == totalPages) {
    beforePage = beforePage - 2;
  } else if (page == totalPages - 1) {
    beforePage = beforePage - 1;
  }
  // how many pages or li show after the current li
  if (page == 1) {
    afterPage = afterPage + 2;
  } else if (page == 2) {
    afterPage = afterPage + 1;
  }

  for (let plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) {
      //if plength is greater than totalPage length then continue
      continue;
    }
    if (plength == 0) {
      //if plength is 0 than add +1 in plength value
      plength = plength + 1;
    }
    if (page == plength) {
      //if page is equal to plength than assign active string in the active variable
      active = "active";
    } else {
      //else leave empty to the active variable
      active = "";
    }
    liTag += `<li class="page-item ${active}" onclick="createPagination(totalPages, ${plength});">${plength}</li>`;
  }

  if (page < totalPages - 1) {
    //if page value is less than totalPage value by -1 then show the last li or page
    if (page < totalPages - 2) {
      //if page value is less than totalPage value by -2 then add this (...) before the last li or page
      liTag += `<li class="page-item">...</li>`;
    }
    liTag += `<li class="page-item" onclick="createPagination(totalPages, ${totalPages});">${totalPages}</li>`;
  }

  if (page < totalPages) {
    //show the next button if the page value is less than totalPage(20)
    liTag += `<li class="page-item" onclick="createPagination(totalPages, ${
      page + 1
    }); ">Next</li>`;
  }

  paginationUl.innerHTML = liTag; //add li tag inside ul tag

  paginationUl.onclick = switchPage;

  function switchPage() {
    catsDiv.innerHTML = "";
    infiniteCats(page);
  }

  return liTag; //reurn the li tag
}
