// ----------------------------------------------------------------------------

function load() {
  /**
   * Loads data from the database into the TopicSet and Posts collections.
   */

  const stuff = [
    {
      "title": "On solid bottles",
      "tags": ["water sort"],
      "votes": 120,
      "content": "Every solid bottle is pure.",
      "author": "Guy1",
      "date": "Mon Jul 25 2022",
      "voted": false,
      "index": 3
    }, {
      "title": "Fortnite",
      "tags": ["#lol", "#bestgirl", "#cringe"],
      "votes": 24,
      "content": "Wiiierd...",
      "author": "Jason",
      "date": "Mon Jul 25 2022",
      "voted": false,
      "index": 2
    }, {
      "title": "To Jason",
      "tags": ["jason"],
      "votes": 6,
      "content": "Could you not.",
      "author": "Ogg",
      "date": "Mon Jul 25 2022",
      "voted": false,
      "index": 1
    }, {
      "title": "Confession",
      "tags": ["#lol"],
      "votes": 2,
      "content": "I fart on Ogg's chair smoetimes.",
      "author": "Jason",
      "date": "Mon Jul 25 2022",
      "voted": false,
      "index": 0
    }
  ];
  stuff.forEach(
    c => (Posts.push(c), c.tags.forEach(t => add_filter(t)))
  );
}

// ----------------------------------------------------------------------------

function add_filter(topic) {
  /**
   * Adds a topic to the filter by topic section, and updates the TopicSet.
   * @param topic - The topic to be added.
   */

  const filterOptions = document.getElementById("filterOptions");
  if (!TopicSet.has(topic)) {
    filterOptions.innerHTML += `
      <div class="col-auto topicDiv"
        onclick="flip_tag_filter_parity('${topic}')"
      >
        <a id="-${topic}" class="tag">${topic}</a>
      </div>
    `;
  }
  TopicSet.add(topic)
}

// ----------------------------------------------------------------------------

window.get_posts = function get_posts() {
  /**
    Gets posts that correspond to selected filters, then put them
    into the dashboard.
  */

  const titleSub = 
    document.getElementById("searchField").value.toLocaleLowerCase();
  const topicRoster = document.getElementById("filterOptions").childNodes;
  const tagFilters = [];
  var accept = false;
  const filteredPosts = [];
  for (let i = 1; i < topicRoster.length; i += 2) {
    if (
      topicRoster[i].childNodes[1].getAttribute("class").includes("active")
    ) {
      tagFilters.push(topicRoster[i].childNodes[1].innerHTML)
    }
  }
  for (let i in Posts) {
    accept = titleSub === "" ||
      Posts[i].title.toLocaleLowerCase().startsWith(titleSub);
    accept &= tagFilters.every(t => Posts[i].tags.includes(t))
    if (accept) {
      filteredPosts.push(Posts[i]);
    }
  }
  document.getElementById("counter").innerHTML = (0 < filteredPosts.length) ?
    (filteredPosts.length > 1) ?
      (filteredPosts.length > 100) ?
        "More than 100 comments were found" :
        filteredPosts.length + " comments were found" :
      "1 comment was found" :
    "No comment matches your filters...";
  populate_postboard(filteredPosts);
}

// ----------------------------------------------------------------------------

function populate_postboard(filteredPosts) {
  /**
   * Adds each post from the filtered Posts array to the dashboard.
   * @param filteredPosts - The array of posts filtered from the global posts
   * constant.
   */

  let htmlTxt = "";
  for (let i in filteredPosts) {
    let tagLine = "";
    for (let j in filteredPosts[i].tags) {
      tagLine += `
        <a class="tag" 
          onclick="activate_tag_filter('${filteredPosts[i].tags[j]}')"
        >${filteredPosts[i].tags[j]}</a>
      `;
    }
    const state = filteredPosts[i].voted ?
      "active" :
      "inactive";
    htmlTxt += `
      <div class="row commentDiv">
        <div class="card commentCard">
          <div class="card-body container-fluid">
            <div class="row">
              <div class="col-auto">
                <h5>${filteredPosts[i].title}</h5>
              </div>
              <div class="col-auto">
                <h7>
                  Posted By ${filteredPosts[i].author}, on
                  ${filteredPosts[i].date}
                </h7>
              </div>
              <div class="col-auto">
                ${tagLine}
              </div>
              <div class="col voteContainer"
                onclick="flip_vote_parity(${i}, ${filteredPosts[i].index})"
              >
                <a class="voteArrow ${state}">
                  <h5><i class="fa fa-arrow-up" aria-hidden="true"></i></h5>
                </a>
                <p>${filteredPosts[i].votes}</P>
              </div>
            </div>
            <p class="card-text">${filteredPosts[i].content}</p>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById("commentBoard").innerHTML = htmlTxt;
}

// ----------------------------------------------------------------------------

window.flip_tag_filter_parity = function flip_tag_filter_parity(topic) {
  /**
   * Flips a topic filter tag from active to inactive or vice versa, depending
   * on the tag's current state. The dashboard is then refreshed, to align with
   * the new filter selections.
   * @param topic - The topic corresponding to the tag to be flipped.
   */
  
  const tag = document.getElementById("-" + topic);
  if (tag.getAttribute("class").endsWith("active")) {
    tag.setAttribute("class", "tag");
  } else {
    tag.setAttribute("class", "tag active");
  }
  get_posts();
}

// ----------------------------------------------------------------------------

window.activate_tag_filter = function activate_tag_filter(topic) {
  /**
   * Puts a topic filter's tag in an active state. The dashboard is then
   * refreshed, to align with the new filter selections.
   * @param - The topic corresponding to the tag to be set active.
   */

  document.getElementById("-" + topic).setAttribute("class", "tag active");
  get_posts()
}

// ----------------------------------------------------------------------------

window.add_tag_to_post = function add_tag_to_post() {
  /**
   * Takes the entered topic from the text section in the new post form,
   * and adds a tag, corresponding to the topic, to the tag section of the
   * form.
   */

  const postTopicsText = document.getElementById("postTopicsText");
  let topic = postTopicsText.value.trim().toLocaleLowerCase();
  if (topic.endsWith(",") && "," !== topic) {
    topic = topic.slice(0, topic.length - 1);
    postTopicsText.value = "";
    if (document.getElementById("*" + topic) == null) {
      const postTopics = document.getElementById("postTopics");
      postTopics.innerHTML += `
        <div id="*${topic}" class="topicDiv col-auto">
          <a class="tag newPostTag">
            ${topic} &emsp;
            <i class="fa fa-times" aria-hidden="true"
              onclick="remove_tag('*${topic}')"
            ></i>
          </a>
        </div>
      `;
    }
  }
}

// ----------------------------------------------------------------------------

window.remove_tag = function remove_tag(topic) {
  /**
   * Removes a topic tag from the topic section on the new post form.
   * @param topic - The topic corresponding to the tag to be removed.
   */

  document.getElementById(topic).remove();
}

// ----------------------------------------------------------------------------

window.flip_vote_parity = function flip_vote_parity(htmlIndex, index) {
  /**
   * Flips the state of a vote on a post to active or inactive, depending on
   * it's current state.
   * @param htmlIndex - The index of the post on the dashboard.
   * @param index - The index of the post in the global posts array.
   */

  const container =
    document.getElementsByClassName("voteContainer")[htmlIndex];
  index = Posts.length - index - 1;
  if (Posts[index].voted) {
    container.childNodes[1].setAttribute("class", "voteArrow inactive");
    Posts[index].voted = false;
    Posts[index].votes -= 1;
  } else {
    container.childNodes[1].setAttribute("class", "voteArrow active");
    Posts[index].voted = true;
    Posts[index].votes += 1;
  }
  container.childNodes[3].innerHTML = Posts[index].votes;
  // update vote in database
}

// ----------------------------------------------------------------------------

window.add_post = function add_post(form, event) {
  /**
    Adds a new post to the dashboard, Posts array and database.
    @param form - The new post form.
    @param event - The event which fires to call this function.
  */

  event.preventDefault();
  const tagElements = document.getElementsByClassName("newPostTag");
  const tags = [];
  for (let i = 0; i < tagElements.length; i++) {
    tags.push(tagElements[i].textContent.trim());
    add_filter(tags[i]);
  }
  const post = {
    "title": document.getElementById("postTitle").value.trim(),
    "tags": tags,
    "votes": 0,
    "content": document.getElementById("postText").value,
    "author": "You",
    "date": (new Date()).toDateString(),
    "voted": false,
    "index": Posts.length
  };
  Posts.unshift(post);
  get_posts();
  form.reset();
  document.getElementById("postTopics").innerHTML = "";
  const modalElem = document.getElementById('commentEditor');
  const modal = bootstrap.Modal.getOrCreateInstance(modalElem);
  modal.hide();
}

// ----------------------------------------------------------------------------

const commentEditor = document.getElementById("commentEditor");
const newPost = document.getElementById("newPost");
commentEditor.addEventListener(
  "shown.bs.modal", function () {
    newPost.focus();
  }
);

// ----------------------------------------------------------------------------

const TopicSet = new Set();
const Posts = [];

// ----------------------------------------------------------------------------

load();
get_posts();

// ----------------------------------------------------------------------------

import { redirect } from '../utils';

$(() => {
  $('.nav-link[href]').on(
    'click', function (e) {
      e.preventDefault();
      const url = $(this).attr('href');
      const email = $('html').attr('data-email');
      redirect(url, { email });
    }
  );
});

// ----------------------------------------------------------------------------
