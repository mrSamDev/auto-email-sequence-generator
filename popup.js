function focusOnTab(tabId) {
  chrome.tabs.update(tabId, { active: true });
}

function closeTab(tabId) {
  chrome.tabs.remove(tabId);
  const elementToRemove = document.getElementById(tabId);
  elementToRemove.remove();
}

function updateResults() {
  const searchTerm = searchInput.value.toLowerCase();

  chrome.tabs.query({}, function (tabs) {
    console.log("tabs: ", tabs);
    let resultsHTML = "";

    for (const tab of tabs) {
      const title = tab.title.toLowerCase();
      if (title.includes(searchTerm)) {
        resultsHTML += `
        <div data-tabid=${tab.id} id=${tab.id} class="max-w-xs w-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-start gap-4 p-4">
       <div class="flex flex-row gap-4">

        <img  width=100 height=50 src=${tab.favIconUrl} alt="Placeholder Image" class="object-contain w-8" >
        <h2 class="text-base font-semibold">${tab.title}</h2>
     
        </div>
        <a href=${tab.url} class="text-gray-600">${tab.url}</a>
        <div class="flex justify-between mt-4 gap-2">
        <button data-tabid="${tab.id}"  class="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300" >Go to Tab</button>
        <button data-closetabid="${tab.id}" class="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300" data-tabid="1">Close Tab</button>
        </div>

        <div class="mt-4">
        <img src="" alt="Tab Preview" class="w-full rounded shadow-md hidden" id=${tab.id}>
    </div>

        </div>
        `;
      }
    }

    resultsContainer.innerHTML = resultsHTML;

    document.querySelectorAll("[data-tabid]").forEach(function (button) {
      button.addEventListener("click", function () {
        const tabId = parseInt(button.getAttribute("data-tabid"));
        if (!isNaN(tabId)) {
          focusOnTab(tabId);
        }
      });
    });
    document.querySelectorAll("[data-closetabid]").forEach(function (button) {
      button.addEventListener("click", function () {
        const tabId = parseInt(button.getAttribute("data-closetabid"));
        if (!isNaN(tabId)) {
          closeTab(tabId);
          updateResults();
        }
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", updateResults);
  updateResults();
});

// Add event listeners to trigger the update when input changes
