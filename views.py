from django.http import HttpResponse
from django.shortcuts import render, redirect
import pickle

import pyautogui as pag

def index(request):
    if request.method == "POST":
        if 'login' in request.POST:
            return redirect('login')

        elif 'register' in request.POST:
            return redirect('register')
        else:
            try:
                pickle_in = open("dict.pickle","rb")
                users_dict = pickle.load(pickle_in)
                users_dict.clear()
                

                pickle_out = open("dict.pickle", "wb")
                pickle.dump(users_dict, pickle_out)
                pickle_out.close()

                pag.alert(text="All users data are reset now!", title="Alert!")
            except:
                pass

    return render(request=request,
                  template_name='index.html')

def login(request):
    login_flag = False
    if request.method == "POST":
        username = request.POST.get("loginusername")
        password = request.POST.get("loginpassword")
        msg = ""
        try:
            pickle_in = open("dict.pickle","rb")
            all_users_data = pickle.load(pickle_in)
            
            
            for i in all_users_data:
                if username == all_users_data[i].get("username"):
                    if password == all_users_data[i].get("password"):
                        msg = "login success"
                        login_flag = True
                        request.session["login_username"] = username
                        request.session["login_password"] = password
                        request.session["login_rgb_pattern"] = all_users_data[i].get("rgb_pattern")
                        request.session["login_listindex"] = all_users_data[i].get("listindex")
                    else:
                        msg = "please check your pass"
                else:
                    msg = "please create account first"

            

            if(login_flag):
                return redirect('login_level_2')
            else:
                pag.alert(text=msg, title="Alert!") 

        except:
            pass

            

    return render(request=request,template_name='login.html')

def login_level_2(request):
    

    if request.method == "POST":
        if 'reset' not in request.POST:
            rgb_pattern = request.POST.get("my_field")
            
            login_rgb_pattern = request.session["login_rgb_pattern"]
            if len(rgb_pattern) > 0:
                if rgb_pattern == login_rgb_pattern:
                    return redirect('login_level_3')
                else:
                    pag.alert(text="please check your pattern", title="Alert!")

    return render(request=request,template_name='login_level_2.html')

def login_level_3(request):
    

    if request.method == "POST":
        listindex = request.POST.get("listindex")
        login_listindex = request.session["login_listindex"]

        if login_listindex == listindex:
            pag.alert(text="login Successful", title="Alert!")
            return redirect('index')
        else:
            pag.alert(text="Please check image sequence!", title="Alert!")
            
    return render(request=request,template_name='login_level_3.html')

def register(request):
    
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        password2 = request.POST.get("password2")

        request.session["username"] = username
        request.session["password"] = password

        if password == password2:
            return redirect('register_level_2')
        else:
            pag.alert(text="Please check your password!", title="Alert!")
            return render(request=request,template_name='register.html')

    return render(request=request,template_name='register.html')

def register_level_2(request):
    

    if request.method == "POST":
        if 'reset' not in request.POST:
            rgb_pattern = request.POST.get("my_field")
            request.session["rgb_pattern"] = rgb_pattern
            print(rgb_pattern)
            if len(rgb_pattern)<9 or len(rgb_pattern) ==0:
                pag.alert(text="Please Select Color Pattern from 3 given colors.", title="Alert!")
                

            if len(rgb_pattern) > 0 and len(rgb_pattern)==9:
                return redirect('register_level_3')

            

    return render(request=request,template_name='register_level_2.html')

def register_level_3(request):
    all_users_data={}
    if request.method == "POST":
        listindex = request.POST.get("listindex")

        username = request.session["username"]
        password = request.session["password"]
        rgb_pattern = request.session["rgb_pattern"]

        try:
            pickle_in = open("dict.pickle","rb")
            all_users_data = pickle.load(pickle_in)
            print(all_users_data)
        except:
            pass

        print(username)
        print(password)
        print(rgb_pattern)

        all_users_data[username] = {"username":username, "password":password, "rgb_pattern":rgb_pattern, "listindex":listindex}
       
        pickle_out = open("dict.pickle", "wb")
        pickle.dump(all_users_data, pickle_out)
        pickle_out.close()


        pickle_in = open("dict.pickle","rb")
        example_dict = pickle.load(pickle_in)
        print(example_dict)

        pag.alert(text="Your Registration is successful.", title="Alert!")
        

        return redirect('index')
        

    return render(request=request,template_name='register_level_3.html')
