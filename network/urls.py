
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("world", views.PostListView.as_view(), name="world"),
    path("profile/<str:username>", views.Profile, name="profile"),
    # path('following', views.following, name="following"),

    # The following are API views
    path("api/save_post", views.save_post, name="save_post"),
    path("api/updateprofile", views.UpdateProfile, name = "updateprofile"),
    path("api/updatelikes", views.UpdateLikes, name = "updatelikes"),
    path('api/editpost', views.EditPost, name='editpost'),
    path('api/editfollow', views.CreateFollowers, name="editfollow"),
    path('api/createcomment', views.CreateComment, name="createcomment")
]
