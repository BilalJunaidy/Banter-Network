// Start of new JavaScript expression
document.addEventListener('DOMContentLoaded', function() {


    // The following code block deals with hiding and unhiding the PostCreateForm
    const PostCreateForm = document.getElementById('PostCreateForm');
    const ShowPostCreateForm = document.getElementById('ShowPostCreateForm');
    
    
    
    if (ShowPostCreateForm != 'null') {
        ShowPostCreateForm.addEventListener('click', function() {

            if (ShowPostCreateForm.innerHTML === 'Make a new Post') {
                PostCreateForm.style.display = 'block';
                ShowPostCreateForm.innerHTML = "Hide Post Form"
            }
            else {
                PostCreateForm.style.display = 'none';
                ShowPostCreateForm.innerHTML = "Make a new Post"
            }
    
    
        });
    }
    

    // The following code block deals with updatating the content of the Success Message rendered on the page AND..... with the actual submission of the post createform
    const SuccessMessageAlert = document.getElementById('SuccessMessageAlert')
    PostCreateForm.addEventListener('submit', function(event) {
        event.preventDefault();
        Save_Post();
        event.target.reset();
        SuccessMessageAlert.style.display = 'block'
    })

    // The following code manages the like and dislike button feature
    const like_unlike_btns = document.querySelectorAll(".like_unlike_btn")
    like_unlike_btns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // console.log(`${this.dataset.post_id}`)
            if (this.innerHTML === "Like") {
            update_likes("Like", `${this.dataset.post_id}`);
            this.innerHTML = "Unlike"
            // console.log("Changed to Unlike");
            }
            else {
            this.innerHTML = "Like";
            update_likes("Unlike", `${this.dataset.post_id}`);
            }
        })
    })

    // The following code manages the edit post feature 
    // const edit_post_btn = document.querySelectorAll('.edit_post_btn')
    // edit_post_btn.forEach(function(btn) {
    //     btn.addEventListener('click', function(btn) {
    //         console.log(this.dataset.post_id);
    //     })
    // })

    
    // When the DOM Content has been loaded, we want to hide the Post Create Form as the default behaviour 
    PostCreateForm.style.display = 'none';
    SuccessMessageAlert.style.display = 'none';

});

function Save_Post() {
    const csrftoken = getCookie('csrftoken');

    url = 'api/save_post'
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            'content':PostCreateForm.id_content.value,
            'privacy_setting':get_privacy_settings(),
            'post_image':PostCreateForm.id_post_image.value,             
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
}

function get_privacy_settings() {
    if (document.getElementById('id_privacy_setting_1').checked === true) {
        return 'public';
    }
    else {
        return 'private';
    }
}




function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function update_likes(bool, id) {
    const csrftoken = getCookie('csrftoken');
        url = "api/updatelikes"
        fetch(url, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        body: JSON.stringify({
            "id": id,
            "bool": bool
        })
        })
        .then(response => response.json())
        .then(function(data) {
            let updated_likes = data.likes;
            document.getElementById(`${id}_likes`).innerHTML = `${updated_likes} likes`;
            console.log(data)    

        })
}