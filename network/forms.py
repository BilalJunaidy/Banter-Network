from .models import *
from django import forms 
from django.forms import ModelForm
from django_countries.widgets import CountrySelectWidget

class UserRegistrationForm(ModelForm):
    password_confirmation = forms.CharField(widget=forms.PasswordInput())
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password','password_confirmation','country']
        widgets = {'country': CountrySelectWidget()}

class PostCreateForm(ModelForm):
    class Meta:
        model = Post
        exclude = ['created_at', 'owner', 'likes']
        widgets = {
            "privacy_setting":forms.RadioSelect()
        }

class UserUpdateForm(ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'bio','country', 'user_image']
        widgets = {'country': CountrySelectWidget()}
        
    

