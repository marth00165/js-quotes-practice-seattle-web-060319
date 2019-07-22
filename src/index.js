document.addEventListener('DOMContentLoaded', (event) => {
  main();
});



function main() {
  const ul = document.getElementById("quote-list")
//---fetch my posts
  fetch(`http://localhost:3000/quotes?_embed=likes`)
    .then(response => response.json())
    .then(posts => showPosts(posts, ul))
//showsPosts
//submitPosts

  const form = document.getElementById("new-quote-form")
    form.addEventListener("submit", submitPost)

}

//submit post function
  function submitPost(e){
    e.preventDefault();
   const quote = e.target.children[0].lastElementChild.value
   const author = e.target.children[1].lastElementChild.value

    fetch(`http://localhost:3000/quotes?_embed=likes`, {
       method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "quote" : quote,
        "author" : author
        })
      })
    }

    function createlikes (e, postLikes){
    const postid = e.target.getAttribute("post-id")
    fetch( `http://localhost:3000/likes`,{
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        "quoteId" : postid
      })
    })
    .then(res => res.json())
    .then(newlike => addLike(newlike, postid, postLikes))
  }

  function addLike(newlike, postid, postLikes){
    const newLikesArr = postLikes.push(newlike)
    console.log(newLikesArr)
    fetch('http://localhost:3000/quotes?_embed=likes' + "posts/" + postid,{
      method: "PUT",
      headers:{
        "Content-Type" : "application/json"
      },
      body: {
        "likes" : newLikesArr
      }
    })
  }


//show posts function
function showPosts(posts, ul) {
  posts.forEach( (post) => {
//get post info
      const postLikes = post.likes;

      const quote = post.quote;
      const author = post.author;
//create cards as list items
          const li = document.createElement("li")
          li.className = "quote-card";
            const blockquote = document.createElement("blockquote")
            blockquote.className = "blockquote";
              const p = document.createElement("p")
              p.className = "mb-0";
              p.innerText = quote;
              const footer = document.createElement("footer")
              footer.className = "blockquote-footer";
              footer.innerText = author;
              const likesButton = document.createElement("button")
              likesButton.className = "btn-success";
              likesButton.innerText = "Likes: " + postLikes.length;
              likesButton.setAttribute("post-id", post.id)

              console.log(postLikes)
              //likebutton functionality
              likesButton.addEventListener("click",function(e){
                createlikes( e, postLikes)
              })



              const deleteButton = document.createElement("button")
              deleteButton.className = "btn-danger";
              deleteButton.innerText = "Delete";
              deleteButton.setAttribute("post-id", post.id)
//append list to the ul
            ul.appendChild(li)
            li.appendChild(blockquote)
//append the quote to the list item
            blockquote.appendChild(p)
            blockquote.appendChild(footer)
            blockquote.appendChild(likesButton)
            blockquote.appendChild(deleteButton)
  });
}
