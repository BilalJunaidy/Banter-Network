from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField


class User(AbstractUser): 
    user_image = models.ImageField(default = 'User_Images/default.png', upload_to = 'User_Images', null = True, blank = False)
    bio = models.TextField(max_length = 280, null=True, blank=True)
    country = CountryField(blank_label='(select country)')
    # following = models.ManyToManyField('Follow', through = 'Follow', blank=True)

class Follow(models.Model):
    follower = models.ForeignKey('User', on_delete = models.CASCADE, related_name = 'follower') 
    followed = models.ForeignKey('User', on_delete = models.CASCADE, related_name = 'following')

    def __str__(self):
        return f"{self.follower} follows {self.followed}"


class Post(models.Model):
    PRIVACY_OPTIONS = [
        # The first open in each of the tuples below refers to the "Value" of the selected choice, 
        # whereas the second item represents how the option appears in the form when rendered by the browser. 
        ("public","Public"),
        ("private","Private"),
    ]

    content = models.TextField(blank=False, null=False)
    owner = models.ForeignKey('User', on_delete = models.CASCADE)
    privacy_setting = models.CharField(_("Post Privacy"), max_length = 7, choices = PRIVACY_OPTIONS, default = 'public', blank = False, null = False)
    created_at = models.DateTimeField(auto_now_add = True)
    likes = models.ManyToManyField('User', related_name = 'posts')
    post_image = models.ImageField(upload_to = 'Post_Images', null = True, blank = True)
    
    @property   
    def total_likes(self):
        total = self.likes.count()
        return total 

class Comment(models.Model):
    post = models.ForeignKey('Post', on_delete = models.CASCADE)
    owner = models.ForeignKey('User', on_delete = models.CASCADE)
    content = models.CharField(_("Comment"), max_length = 140, blank = False, null = False)
    created_at = models.DateTimeField(auto_now_add = True, blank=True)



    
