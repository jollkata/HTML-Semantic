
//Load staff form to create new user
TStaff.prototype.CreateNewUser = function () {
    var strDiv = "#" + TStaff.prototype.target_div;
    $(strDiv).empty();

    $(strDiv).load(TStaff.prototype.staff_form, function () {
        /*load language information*/
        var str_lang = localStorage.getItem("lang_id");
        $("#lang_id").text(str_lang);
        Application.ReloadLanguage(str_lang);
        $("#lang_id").click(function () {
            Application.ChangeLanguage();
        });
        $('#pass_req').hide();
        $("#user_pass_button").hide();
        $('#functions button').css('cursor', 'default');
        $("input").empty();
        $('#user_pass').mouseover(function () {
            $('#pass_req').show();
        });// end of click function
        $('#user_pass').mouseleave(function () {
            $('#pass_req').hide();
        });// end of click function
        $("#save_staff").click(function () {
            TStaff.prototype.SaveUser();
        });// end of click function
    }); // end of loading process  
};// end of function

//Get users info form database
TStaff.prototype.SaveUser = function () {
    var first_name = $("#first_name").val();
    var sec_name = $("#sec_name").val();
    var family = $("#family").val();
    var user_name = $("#user_name").val();
    var pass = $("#user_pass").val();
    var pass2 = $("#user_pass2").val();
    var user_right = $("#user_right").val();
    var data = {name: "3"};
    $.ajax({
        url: '/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            TStaff.prototype.CheckUserInfo(data[0], user_name, first_name, sec_name, family, pass, pass2, user_right);
        }// end of success
    });// end of ajax
}; // end of function

//Notify that the user has been saved 
TStaff.prototype.ConfirmUser = function () {
    setTimeout(function () {
        if (TStaff.prototype.str_lang === 'bg') {
            $("#operation_status").html("Потребителят беше записан успешно!");
        }
        if (TStaff.prototype.str_lang === 'en') {
            $("#operation_status").html("The user was successfully saved!");
        }
    }, 1000);
    setTimeout(function () {
        $("#operation_status").html("");
    }, 5000);
}; // end of function

//Check if user exists
TStaff.prototype.CheckUserInfo = function (data, user_name, first_name, sec_name, family, pass, pass2, user_right) {
    $("#operation_status").html("");
    var num = /[0-9]/;
    var upp_letter = /[A-Z]/;
    var low_letter = /[a-z]/;
    if (first_name.length === 0 || sec_name.length === 0 || family.length === 0 || user_name.length === 0 || pass.length === 0 || pass2.length === 0) {
        if (TStaff.prototype.str_lang === 'bg') {
            $("#operation_status").html("Моля попълнете всички полета!");
        }
        if (TStaff.prototype.str_lang === 'en') {
            $("#operation_status").html("Please fill in all fields!");
        }
    } else if (pass !== pass2) {
        if (TStaff.prototype.str_lang === 'bg') {
            $("#operation_status").html("Паролите не съвпадат!");
        }
        if (TStaff.prototype.str_lang === 'en') {
            $("#operation_status").html("Passwords does not match!");
        }
    } else if (pass.length < 6) {
        if (TStaff.prototype.str_lang === 'bg') {
            $("#operation_status").html("Паролата трябва да съдържа минимум 6 символа!");
        }
        if (TStaff.prototype.str_lang === 'en') {
            $("#operation_status").html("The password must contain at least 6 characters!");
        }
    } else if (num.test(pass) === false) {
        if (TStaff.prototype.str_lang === 'bg') {
            $("#operation_status").html("Паролата трябва да съдържа поне една цифра (0-9)!");
        }
        if (TStaff.prototype.str_lang === 'en') {
            $("#operation_status").html("The password must contain at least 1 digit (0-9)!");
        }
    } else if (low_letter.test(pass) === false) {
        if (TStaff.prototype.str_lang === 'bg') {
            $("#operation_status").html("Паролата трябва да съдържа поне една малка буква (a-z)!");
        }
        if (TStaff.prototype.str_lang === 'en') {
            $("#operation_status").html("The password must contain at least 1 small letter (a-z)!");
        }
    } else if (upp_letter.test(pass) === false) {
        if (TStaff.prototype.str_lang === 'bg') {
            $("#operation_status").html("Паролата трябва да съдържа поне една главна буква (A-Z)!");
        }
        if (TStaff.prototype.str_lang === 'en') {
            $("#operation_status").html("The password must contain at least 1 capital letter (A-Z)!");
        }
    } else {
        TStaff.prototype.exist = 'false';
        for (var item in data) {
            if (data[item].first_name === first_name && data[item].sec_name === sec_name && data[item].family === family) {
                if (TStaff.prototype.str_lang === 'bg') {
                    $("#operation_status").html("Потребителят вече съществува!");
                }
                if (TStaff.prototype.str_lang === 'en') {
                    $("#operation_status").html("This user already exists!");
                }
                TStaff.prototype.exist = 'true';
            } else if (data[item].user_name === user_name) {
                if (TStaff.prototype.str_lang === 'bg') {
                    $("#operation_status").html("Избрали сте съществуващо потребителско име!");
                }
                if (TStaff.prototype.str_lang === 'en') {
                    $("#operation_status").html("You have chosen an existing user name!");
                }
                TStaff.prototype.exist = 'true';
            }// end of if-else statement
        }// end of for
        if (TStaff.prototype.exist === 'false') {
            TStaff.prototype.Save(user_name, first_name, sec_name, family, pass, user_right);
        }// end of if
    }// end of if-else statement
};// end of function

//Save checked user info
TStaff.prototype.Save = function (user_name, first_name, sec_name, family, pass, user_right) {
    $("#operation_status").html('');
    var data = {name: "2", first_name: first_name, sec_name: sec_name, family: family, user_name: user_name,
        user_pass: pass, user_right: user_right};
    $.ajax({
        url: '/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            $.getJSON('json_config/config.json', function (data) {
                console.log(data);
            });
            var homedir = '/home/' + user_name;
            var www = homedir + '/www';
            var personal = homedir + '/personal';
            var vpn = homedir + '/vpn';
            TStaff.prototype.MakeDir(homedir, '777');
            TStaff.prototype.MakeDir(www, '777');
            TStaff.prototype.MakeDir(personal, '777');
            TStaff.prototype.MakeDir(vpn, '777');
            TStaff.prototype.ConfirmUser();
            TStaff.prototype.AllowUserFunctions(data[0][0].id_user, user_name);

        }// end of success
    });// end of ajax
};// end of function
