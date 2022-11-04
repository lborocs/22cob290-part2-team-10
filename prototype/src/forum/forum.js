function collect_comments_and_tags() {
  backgroundComments = [
    {
      "title": "First Comment",
      "tags": ["Red Hats", "Funny"],
      "votes": 120,
      "content": "Every solid bottle is pure.",
      "poster": "Guy1",
      "date": "30/10/2022",
      "voted": false,
      "index": 3
    }, {
      "title": "Second Comment",
      "tags": ["Funny"],
      "votes": 24,
      "content": "An incomplete transfer on an environment graunts an equivelent environment.",
      "poster": "Guy2",
      "date": "30/10/2022",
      "voted": false,
      "index": 2
    }, {
      "title": "Third Comment",
      "tags": ["Red Hats"],
      "votes": 6,
      "content": "The fold of an environment is not surpassed by that of it's divisors.",
      "poster": "Bog",
      "date": "30/10/2022",
      "voted": false,
      "index": 1
    }, {
      "title": "Fourth Comment",
      "tags": ["Not Red Hats"],
      "votes": 2,
      "content": "Environment quotients can be multiplied.",
      "poster": "Guy3",
      "date": "30/10/2022",
      "voted": false,
      "index": 0
    }
  ];
  backgroundComments.forEach(
    c => c["tags"].forEach(
      t => add_filters(t)
    )
  );
}

function add_filters(topic) {
  const filterOptions = document.getElementById("filterOptions");
  if (!tagSet.has(topic)) {
    filterOptions.innerHTML += `
      <div class="col-auto topicDiv" onclick="flipTagFilterParity('${topic}')">
        <a id="-${topic}" class="tag">${topic}</a>
      </div>
    `;
  }
  tagSet.add(topic)
}

function get_comments() {
  const titleSub = document.getElementById("searchField").value.toLocaleLowerCase();
  const topicRoster = document.getElementById("filterOptions").childNodes;
  const tagFilters = [];
  var accept = false;
  const comments = [];
  for (let i = 1; i < topicRoster.length; i += 2) {
    if (topicRoster[i].childNodes[1].getAttribute("class").includes("active")) {
      tagFilters.push(topicRoster[i].childNodes[1].innerHTML)
    }
  }
  for (let i in backgroundComments) {
    accept = titleSub === "" || backgroundComments[i]["title"].toLocaleLowerCase().startsWith(titleSub);
    accept &= tagFilters.every(t => backgroundComments[i]["tags"].includes(t))
    if (accept) {
      comments.push(backgroundComments[i]);
    }
  }
  document.getElementById("counter").innerHTML = (0 < comments.length) ?
    (comments.length > 1) ?
      (comments.length > 100) ?
        "More than 100 comments were found" :
        comments.length + " comments were found" :
      "1 comment was found" :
    "No comment match your filters...";
  populate_commentboard(comments);
}

window.flipTagFilterParity = function flipTagFilterParity(topic) {
  const tag = document.getElementById("-" + topic);
  if (tag.getAttribute("class").endsWith("active")) {
    tag.setAttribute("class", "tag");
  } else {
    tag.setAttribute("class", "tag active");
  }
  get_comments();
}

window.activateTagFilter = function activateTagFilter(topic) {
  document.getElementById("-" + topic).setAttribute("class", "tag active");
  get_comments()
}

function populate_commentboard(comments) {
  let htmlTxt = "";
  for (let i in comments) {
    let tagLine = "";
    for (let j in comments[i]["tags"]) {
      tagLine += `
        <a class="tag" onclick="activateTagFilter('${comments[i]["tags"][j]}')">${comments[i]["tags"][j]}</a>
      `;
    }
    const state = comments[i]["voted"] ?
      "active" :
      "inactive";
    htmlTxt += `
      <div class="row commentDiv">
        <div class="card commentCard">
          <div class="card-body container-fluid">
            <div class="row">
              <div class="col-auto">
                <h5>${comments[i]["title"]}</h5>
              </div>
              <div class="col-auto">
                <h7>Posted By ${comments[i]["poster"]} on ${comments[i]["date"]}</h7>
              </div>
              <div class="col-auto">
                ${tagLine}
              </div>
              <div class="col voteContainer" onclick="flipVoteParity(${i}, ${comments[i]["index"]})">
                <a class="voteArrow ${state}"><h5><i class="fa fa-arrow-up" aria-hidden="true"></i></h5></a>
                <p>${comments[i]["votes"]}</P>
              </div>
            </div>
            <p class="card-text">${comments[i]["content"]}</p>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById("commentBoard").innerHTML = htmlTxt;
}

window.addTagToPost = function addTagToPost() {
  const postTopicsText = document.getElementById("postTopicsText");
  let topic = postTopicsText.value.trim().toLocaleLowerCase();
  if (topic.endsWith(",") && "," !== topic) {
    topic = topic.slice(0, topic.length - 1);
    postTopicsText.value = "";
    if (document.getElementById("*" + topic) == null) {
      const postTopics = document.getElementById("postTopics");
      postTopics.innerHTML += `
        <div id="*${topic}" class="topicDiv col-auto">
          <a class="tag newPostTag">${topic} &emsp;<i class="fa fa-times" aria-hidden="true" onclick="removeTopic('*${topic}')"></i></a>
        </div>
      `;
    }
  }
}

window.removeTopic = function removeTopic(topic) {
  document.getElementById(topic).remove();
}

window.flipVoteParity= function flipVoteParity(htmlIndex, index) {
  const container = document.getElementsByClassName("voteContainer")[htmlIndex];
  index = backgroundComments.length - index - 1;
  if (backgroundComments[index]["voted"]) {
    container.childNodes[1].setAttribute("class", "voteArrow inactive");
    backgroundComments[index]["voted"] = false;
    backgroundComments[index]["votes"] -= 1;
  } else {
    container.childNodes[1].setAttribute("class", "voteArrow active");
    backgroundComments[index]["voted"] = true;
    backgroundComments[index]["votes"] += 1;
  }
  container.childNodes[3].innerHTML = backgroundComments[index]["votes"];
  // update vote in database
}

window.addPost = function addPost(form, event) {
  event.preventDefault();
  console.log("ADD");

  const tagElements = document.getElementsByClassName("newPostTag");
  const tags = [];
  for (let i = 0; i < tagElements.length; i++) {
    tags.push(tagElements[i].textContent.trim());
    add_filters(tag);
  }
  const post = {
    "title": document.getElementById("postTitle").value,
    "tags": tags,
    "votes": 0,
    "content": document.getElementById("postTopicsText").value,
    "poster": "You",
    "date": "30/10/2022",
    "voted": false,
    "index": backgroundComments.length
  };
  backgroundComments.unshift(post);
  populate_commentboard(backgroundComments);

  form.reset();
  // remove topics
  $('#postTopics').empty();

  const modalElem = document.getElementById('commentEditor');
  const modal = bootstrap.Modal.getOrCreateInstance(modalElem);
  modal.hide();
}

const commentEditor = document.getElementById("commentEditor");
const newPost = document.getElementById("newPost");
commentEditor.addEventListener(
  "shown.bs.modal", function () {
    newPost.focus();
  }
);
let backgroundComments = [];
const tagSet = new Set();
collect_comments_and_tags();
get_comments();

import { redirect } from '../utils';

$(() => {
  $('.nav-link[href]').on('click', function (e) {
    e.preventDefault();

    const url = $(this).attr('href');

    const email = $('html').attr('data-email');

    redirect(url, { email });
  });
});
