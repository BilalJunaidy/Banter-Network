document.addEventListener('DOMContentLoaded', function() {
    const UserUpdateForm = document.getElementById("UserUpdateForm")
    const UpdateProfileButton = document.getElementById('UpdateProfileButton')
    const userimagetext = document.querySelector('[for="id_user_image"]')
    const SuccessMessageAlert = document.getElementById('SuccessMessageAlert')


    UserUpdateForm.style.display = 'none';
    userimagetext.style.display = 'none';

    if (UpdateProfileButton != undefined) {

        UpdateProfileButton.addEventListener('click', function() {     
        if (UpdateProfileButton.innerHTML === 'Update Profile') {
            UserUpdateForm.style.display = 'block';
            UpdateProfileButton.innerHTML = 'Hide Form'
        }
        else {
            UserUpdateForm.style.display = 'none';
            UpdateProfileButton.innerHTML = 'Update Profile'
            SuccessMessageAlert.style.display = 'none';
            
        }

    })

    }


    // The following code manages the UserUpdateForm being submitted and also the success message showing 
    

    UserUpdateForm.addEventListener('submit', function(event) {
        event.preventDefault();
        Save_Form();
        SuccessMessageAlert.innerHTML = "Profile Updated";
        SuccessMessageAlert.style.display = 'block';
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


    // The following code manages the edit post form show feature 
    const edit_post_btn = document.querySelectorAll('.edit_post_btn')
    edit_post_btn.forEach(function(btn) {
    btn.addEventListener('click', function(btn) {
        if (this.innerHTML === 'Edit') {
            console.log(this.dataset.post_id);
            this.innerHTML = 'Hide Form';
            display_post_edit_form(this.dataset.post_id);
            document.getElementById(`${this.dataset.post_id}_edit_form`).style.display = 'block';               

        }
        else {
            this.innerHTML = 'Edit';
            const textarea_to_remove = document.getElementById(`${this.dataset.post_id}_textarea_form`);
            textarea_to_remove.remove(); 
            const btn_to_remove = document.getElementById(`${this.dataset.post_id}_edit_post_btn`);
            btn_to_remove.remove();
            const currently_image_field_to_remove = document.getElementById(`${this.dataset.post_id}_post_image_currently_field`)
            currently_image_field_to_remove.remove();
            const image_file_picker_to_remove = document.getElementById(`${this.dataset.post_id}_post_image_field`)
            image_file_picker_to_remove.remove();
        }


    })
})

    // The following code manages the follow and unfollow feature 
    const follow_unfollow_btn = document.getElementById('follow_unfollow_btn')
    follow_unfollow_btn.addEventListener('click', function() {
        if (this.innerText === 'Follow') {
            Update_Follow_Model(`${this.dataset.follower_id}`, `${this.dataset.followed_id}`, 'Follow');
            this.innerText = 'Unfollow';
        }
        else {
            Update_Follow_Model(`${this.dataset.follower_id}`, `${this.dataset.followed_id}`, 'Unfollow');
            this.innerText = 'Follow';
        }
        
    })



})



function Save_Form() {
const csrftoken = getCookie('csrftoken');


url = 'api/updateprofile'
fetch(url, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
        'first_name':UserUpdateForm.id_first_name.value,
        'last_name':UserUpdateForm.id_last_name.value,
        'bio': UserUpdateForm.id_bio.value,
        'country': UserUpdateForm.id_country.value,
        'user_image': UserUpdateForm.id_user_image.value,
    })
})
.then(response => response.json())
.then(function(data) {
    console.log(data);
    document.getElementById('profile_bio').innerHTML = data.user_bio
    document.getElementById('profile_country_name').innerHTML = data.user_country_name
    document.getElementById('profile_country_flag').src = data.user_country_flag
    document.getElementById('profile_image_url').innerHTML = data.user_image_url

    Update_Profile_Page_Posts(data);

})

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

}

function edit_post_function(id) {
var id = id;
const csrftoken = getCookie('csrftoken');
url = "api/editpost"
fetch(url, {
    method: 'PUT', 
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
    },
body: JSON.stringify({
    "id": id,
    "content": document.getElementById(`${id}_textarea_form`).value,
    'post_image': document.getElementById(`${id}_post_image_field`).value,
})
})
.then(response => response.json())
.then(function(data) {
    document.getElementById(`${id}_content`).innerText = data.content;
    document.getElementById(`${id}_post_image_currently_field`).innerText = `Currently ${data.post_image}`
    document.getElementById(`${id}_post_image_currently_field`).href = data.post_image;
    document.getElementById(`${id}_post_image`).src = data.post_image;

    console.log(data); 
    SuccessMessageAlert.innerHTML = "Post Updated";
    SuccessMessageAlert.style.display = 'block';
})
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


function Update_Profile_Page_Posts(data) {
const post_owner_flag_img = document.querySelectorAll('.post_owner_flag_img')
post_owner_flag_img.forEach(function(post) {
    post.src = data.user_country_flag;
})
}

function Update_Follow_Model(id1, id2, state) {

const csrftoken = getCookie('csrftoken');
url = '/api/editfollow'
fetch(url, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
        'follower_id': id1,
        'followed_id': id2,
        'state': state,
    })
})
.then(response => response.json())
.then(function(data) {
    console.log(data);
    document.getElementById('followers_count').innerHTML = `${data.followers} followers`
    document.getElementById('following_count').innerHTML = `${data.following} following`


})

}