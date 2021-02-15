from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from .forms import *
from django.contrib import messages
import json
from django.views.generic import (
    ListView, 
    DetailView, 
    CreateView,
    UpdateView,
    DeleteView,
    )
from django.contrib.auth.mixins import (
    LoginRequiredMixin,
    UserPassesTestMixin)

from django.contrib.auth.decorators import login_required
from .models import User, Follow


# The following is the function based view which doesn't rely on AJAX calls and therefore, will not be used.
# def index(request):
    
#     Form = PostCreateForm(request.POST or None)

#     if request.method == "POST":
#         if Form.is_valid():
#             Post = Form.save(commit = False)
#             Post.owner_id = request.user.id
#             Post.save()
#             return HttpResponse(f'All has been saved - Post is {Post}')
#             return redirect('index')

#         else:
#             return render(request, "network/index.html", Form)
       
#     return render(request, "network/index.html", {"form": Form})

# The following is the function based view which is geared towards AJAX calls


def index(request):
    if request.user.is_authenticated:
        Posts = Post.objects.all()
        Form = PostCreateForm(request.POST or None)
        users = User.objects.all()
        return render(request, "network/index.html", {
            "form": Form,
            "users": users,
            })
    else:
        return HttpResponseRedirect(reverse("login"))


# The following is a class based ListView 
class PostListView(LoginRequiredMixin, ListView):

    model = Post 
    template_name = 'network/world.html' #<app>/<model>_<viewtype>.html
    context_object_name = 'posts'
    ordering = ['-created_at']
    # paginate_by = 10



def save_post(request):
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)
    else:
        data = json.loads(request.body)
        
        Post.objects.create(
            content = data.get("content"),
            owner = request.user,
            privacy_setting = data.get("privacy_setting"),
            post_image = data.get("post_image")
        )
        return JsonResponse({"message": "Email sent successfully."}, status=201)
    
@login_required
def Profile(request, username):
    if request.method == 'PUT':
        data = json.loads(request.body)
        request.user.first_name = data.get("first_name")
        request.user.last_name = data.get("last_name")
        request.user.bio = data.get("bio")
        request.user.country = data.get("country")

        if not data.get("user_image") == "":
            request.user.user_image = data.get("user_image")

        request.user.save()

        return JsonResponse({
            "message": "User Profile Updated.",
            "user_bio": request.user.bio,
            'user_country_name': request.user.country.name,
            'user_country_flag': request.user.country.flag,
            'user_image_url': request.user.user_image.url,
            }, status=201)

        
    elif request.method == 'GET':
        profile_user = User.objects.get(username = username)
        Form = UserUpdateForm(instance = profile_user)
        posts = Post.objects.filter(owner_id = profile_user.id).order_by("-created_at")

        followers = Follow.objects.filter(followed_id = profile_user.id).count()
        following = Follow.objects.filter(follower_id = profile_user.id).count()

        current_follow_status = Follow.objects.filter(follower_id = request.user.id, followed_id = profile_user.id).count()
        if request.user != profile_user and current_follow_status == 1:
            btn_inner_text = "Unfollow"
        else:
            btn_inner_text = "Follow"
            



        context = {
            "posts": posts, 
            "form": Form,
            'profile_user': profile_user,
            'followers': followers,
            'following': following,
            'btn_inner_text': btn_inner_text,
        }
        return render(request, "network/profile.html", context)
    
    else:
        return JsonResponse({"error": "POST request is not allowed."}, status=400)


def UpdateLikes(request):
    if request.method != "PUT":
        return JsonResponse({"error": "Only PUT request is allowed."}, status=400)
    else:
        data = json.loads(request.body)
        current_post = Post.objects.get(pk = data.get("id"))

        if data.get("bool") == "Like":
            current_post.likes.add(request.user)
            likes = current_post.total_likes
        else: 
            current_post.likes.remove(request.user)
            likes = current_post.total_likes

    
        return JsonResponse({
            "message": "Likes updated.",
            "likes":likes,
            }, 
            status=201)


def EditPost(request):
    if request.method != "PUT":
        return JsonResponse({"error": "Only PUT request is allowed."}, status=400)
    else:
        data = json.loads(request.body)
        post = Post.objects.get(pk = data.get("id"))
        if request.user != post.owner:
            return JsonResponse({"error": "Unauthorized access."}, status=400)
        else: 
            post.content = data.get("content")
            post.post_image = data.get('post_image')
            post.save()
            return JsonResponse(
                {
                    "message": "Post updated successfully.",
                    "content": f"{post.content}",
                    'post_image': f"{post.post_image}"
                    }, status=201)
    

def CreateFollowers(request):
    if request.method != 'PUT':
        return JsonResponse({"error": "Only PUT request is allowed."}, status=400) 
    else:
        data = json.loads(request.body)
 
        if data.get('state') == 'Follow':
            follow = Follow()
            follow.follower_id = data.get("follower_id")
            follow.followed_id = data.get("followed_id")
            follow.save()
        else: 
            follow = Follow.objects.get(follower_id = data.get("follower_id"), followed_id = data.get("followed_id"))
            follow.delete()
        
        followers = Follow.objects.filter(followed_id = data.get("followed_id")).count()
        following = Follow.objects.filter(follower_id = data.get("followed_id")).count()
            
        return JsonResponse({
            'message': "Follow and Unfollow updated",
            'followers': followers,
            'following': following,
        }, 
        status = 201)


def following(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Only GET request is allowed."}, status=400)
    else:
        current_user = request.user 
        followers = User.objects.filter(following = current_user)
        return render(request, "network/following.html", {
            "followers": followers
        })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):

    form = UserRegistrationForm(request.POST or None) 

    if request.method == "POST":
        # Gathering all of the input fields from the form into python variables
        username = request.POST["username"]
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]
        password = request.POST["password"]
        password_confirmation = request.POST["password_confirmation"]
        country = request.POST["country"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        if password != password_confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.first_name = first_name
            user.last_name = last_name
            user.country = country
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken.",
                "form": UserRegistrationForm(request.POST)
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        

        return render(request, "network/register.html", {
            "form": form
        })


