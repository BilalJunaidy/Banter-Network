// Start of new JavaScript expression
document.addEventListener('DOMContentLoaded', function() {


    // The following code block deals with hiding and unhiding the PostCreateForm
    const PostCreateForm = document.getElementById('PostCreateForm');
    const ShowPostCreateForm = document.getElementById('ShowPostCreateForm');
    
    
    
    if (ShowPostCreateForm != undefined) {
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
    if (PostCreateForm != undefined) {
        PostCreateForm.addEventListener('submit', function(event) {
            event.preventDefault();
            Save_Post();
            event.target.reset();
            window.location.href = '/'
    
    
            SuccessMessageAlert.style.display = 'block' 
        })
    } 
    



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
    if (PostCreateForm != undefined) {
        PostCreateForm.style.display = 'none';
    } 

    if (SuccessMessageAlert != undefined) {
        SuccessMessageAlert.style.display = 'none';
    }
    


    // The following code manages the edit post form show feature 
    // const edit_post_btn = document.querySelectorAll('.edit_post_btn')
    // edit_post_btn.forEach(function(btn) {
    // btn.addEventListener('click', function(btn) {
    //     if (this.innerHTML === 'Edit') {
    //         console.log(this.dataset.post_id);
    //         this.innerHTML = 'Hide Form';
    //         display_post_edit_form(this.dataset.post_id);
    //         document.getElementById(`${this.dataset.post_id}_edit_form`).style.display = 'block';               

    //     }
    //     else {
    //         this.innerHTML = 'Edit';
    //         const textarea_to_remove = document.getElementById(`${this.dataset.post_id}_textarea_form`);
    //         textarea_to_remove.remove(); 
    //         const btn_to_remove = document.getElementById(`${this.dataset.post_id}_edit_post_btn`);
    //         btn_to_remove.remove();
    //         const currently_image_field_to_remove = document.getElementById(`${this.dataset.post_id}_post_image_currently_field`)
    //         currently_image_field_to_remove.remove();
    //         const image_file_picker_to_remove = document.getElementById(`${this.dataset.post_id}_post_image_field`)
    //         image_file_picker_to_remove.remove();
    //     }


    //     })
    // })

    // The following mamages the comment creation form submission
    const commentcreateforms = document.querySelectorAll('.commentcreateform')
    commentcreateforms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault()
            let content = this.id_content.value
            console.log(`${this.dataset.post_id}`)
            Create_Comment(content, this.dataset.post_id)
            event.target.reset();
        })
    })

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


function display_post_edit_form(id) {
    
    var ID = id;
    // Getting the main form element
    const edit_form = document.getElementById(`${id}_edit_form`)


        // Creating the textarea form element 
        const textarea_form = document.createElement('textarea');
        textarea_form.cols = '40';
        textarea_form.rows = '10';
        textarea_form.classList.add("textarea")
        textarea_form.classList.add("form-control")
        textarea_form.id = `${id}_textarea_form`;
        

        // Appending the text of the original post within the textarea 
        textarea_form.innerHTML = document.getElementById(`${id}_content`).innerHTML

        //Creating the 'Currently' paragraph fields which is going to hold the value of the existing post image
        const post_image_currently_field = document.createElement('a')

        if(document.getElementById(`${id}_post_image`) != undefined) {
            source = document.getElementById(`${id}_post_image`).src
            post_image_currently_field.innerText = `Currently: ${source}`
            post_image_currently_field.href = source
        }
        else {
            post_image_currently_field.innerText = 'No Post Image so far'
        }
        
        //The following will apply in both conditions
        post_image_currently_field.id = `${id}_post_image_currently_field`

        //Creating the imagefield field 
        const post_image_field = document.createElement('input')
        post_image_field.type = 'file'
        post_image_field.accept = 'image/*'
        post_image_field.classList.add("clearablefileinput")
        post_image_field.classList.add("form-control-file")
        post_image_field.id = `${id}_post_image_field`

        // Creating the button 
        const edit_post_btn  = document.createElement('a')
        edit_post_btn.classList.add('btn')
        edit_post_btn.classList.add('btn-outline-info')
        edit_post_btn.innerHTML = 'Save Post'
        edit_post_btn.id = `${id}_edit_post_btn`;
        edit_post_btn.type = 'submit';
        
        edit_form.append(textarea_form);
        edit_form.append(post_image_currently_field);
        edit_form.append(post_image_field);
        edit_form.append(edit_post_btn);

        // Attaching the event handler to the save button
        edit_post_btn.addEventListener('click', function() {
            edit_post_function(ID);
        })

        function edit_post_function(id) {
            var id = id;
            const csrftoken = getCookie('csrftoken');
            url = "/api/editpost"
            fetch(url, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
            body: JSON.stringify({
        
        
                "id": id,
                "content": document.getElementById(`${id}_textarea_form`).value,
                "post_image": document.getElementById(`${id}_post_image_field`).value
            })
            })
            .then(response => response.json())
            .then(function(data) {
                console.log(data);
                document.getElementById(`${id}_content`).innerText = data.content;
                document.getElementById(`${id}_post_image_currently_field`).innerText = `Currently ${data.post_image}`
                document.getElementById(`${id}_post_image_currently_field`).href = data.post_image;
                document.getElementById(`${id}_post_image`).src = data.post_image;
        
                console.log(data); 
                SuccessMessageAlert.innerHTML = "Post Updated";
                SuccessMessageAlert.style.display = 'block';
            })
        }

}

function Create_Comment(content, post_id) {
    var content = content 
    var post_id = post_id
    const csrftoken = getCookie('csrftoken');
    url = '/api/createcomment'
    
    fetch(url, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    body: JSON.stringify({
        'post_id': post_id,
        'content': content,
    })
    })
    .then(response => response.json())
    .then(function(data) {
        console.log(data);
        const comment_div = document.getElementById(`${post_id}_comments`)
        const comment_owner_and_timestamp = document.createElement('small')
        comment_owner_and_timestamp.innerText = `On ${data.comment_created_at}, ${data.comment_owner} commented:`

        const comment_content = document.createElement('p')
        comment_content.innerText = `${data.comment_content}`

        comment_div.append(comment_owner_and_timestamp)
        comment_div.append(comment_content)
    })

}

