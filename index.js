function get_info (type) {
    if (type == "crystal")
        $url = "http://163.5.245.219:3000/api/1/crystalmines";
    else if (type == "metal")
        $url = "http://163.5.245.219:3000/api/1/metalmines";
    else if (type == "factorys")
        $url = "http://163.5.245.219:3000/api/1/factorys";
    $.ajax({
	url: $url,
	type : 'GET',
	data : {},
	xhrFields: { withCredentials: true },
	success : function(data){
            if (type == "crystal"){
                $info1 = "<p>Mine de Crystal de niveau "+data.level+"<br/>production ("+data.production+"/min)<br/>ressources ("+data.amount+")</p>";
                $info2 = "<br/><p>Ressources requises:<br/>"+data.costNext.metal+" unités de Metal<br/>"+data.costNext.crystal+" unités de Crystal</p><br/>";
                $("#describe_crystal").empty();
                $("#describe_crystal").append($info1).append($info2).append($("<button></button>").attr({id:"crystalmine", type:"submit", style:"z-index:2", onclick:"all_up('crystal');"}).text("Level Up"));
            }
            else if (type == "metal"){
                $info1 = "<p>Mine de Metal de niveau "+data.level+"<br/>production ("+data.production+"/min)<br/>ressources ("+data.amount+")</p>";
                $info2 = "<br/><p>Ressources requises:<br/>"+data.costNext.metal+" unités de Metal<br/>"+data.costNext.crystal+" unités de Crystal</p><br/>";
                $("#describe_metal").empty();
                $("#describe_metal").append($info1).append($info2).append($("<button></button>").attr({id:"metalmine", type:"submit", style:"z-index:2", onclick:"all_up('metal');"}).text("Level Up"));
            }
            else if (type == "factorys"){
                $info1 = "<p>Usine de niveau "+data.level+"<br/>file d'attente <br/></p>";
                $info2 = "<br/><p>Ressources requises:<br/>"+data.costNext.metal+" unités de Metal<br/>"+data.costNext.crystal+" unités de Crystal</p><br/>";
                $("#describe_factorys").empty();
                $("#describe_factorys").append($info1).append($info2).append($("<button></button>").attr({id:"factorys", type:"submit", style:"z-index:2;", onclick:"all_up('factorys');"}).text("Level Up"));
            }
        },
    });
}

function droids () {
    $.ajax({
        url: "http://163.5.245.219:3000/api/1/factorys/add_droid",
        type : 'PUT',
        data : {"level": 1},
        xhrFields: { withCredentials: true },
        success : function(data){
        }
    });
}

function all_up (type) {
    if (type == "crystal")
        $url = "http://163.5.245.219:3000/api/1/crystalmines/";
    else if (type == "metal")
        $url = "http://163.5.245.219:3000/api/1/metalmines/";
    else if (type == "factorys")
        $url = "http://163.5.245.219:3000/api/1/factorys/";
    $.ajax({
        url: $url,
        type : 'GET',
        data : {},
        xhrFields: { withCredentials: true },
        success : function(data){
            if (data.levelUpFinish)
            {
                var d = new Date();
                d.setTime(data.levelUpFinish)
                $("#"+type+"_finish").remove();
                $("#describe_"+type).append($("<p>"+d+"</p>").attr("id",type+"_finish"));
                get_info("");
            }
            else
            {
                console.log(data.levelUpFinish);
                $.ajax({
                    url: $url+"levelUp",
                    type : 'PUT',
                    data : {},
                    xhrFields: { withCredentials: true },
                    username: "login@etna-alternance.net",
                    password: "password",
                    success : function(data){
                        $lvl = data.level + 1;
                        alert("Passage au niveau "+$lvl);
                    }
                });
            }
        }
    });
}

function headCo(){
    $("div").css("display","none");
    $("body").append($("<input>").attr({'id':'login', 'type':'text', 'placeholder':'Login', 'style': 'position:relative; top:300px; left:40%;'}));
    $("body").append($("<input>").attr({'id':'pass', 'type':'password', 'placeholder':'Password', 'style': 'position:relative; top:300px; left:43%'}));
    $("body").append($("<button></button>").attr({'id':'co','style': 'position:relative; top:300px; left:46%','onclick':'connexion()'}).text("connexion"));

}
headCo();

function connexion(value){
    $.ajax({
	url: "http://163.5.245.219:3000/api/1/players/login",
	type : 'POST',
	data : {"username":$("#login").val(), "password":$("#pass").val()},
	xhrFields: { withCredentials: true },
	success : function(data){
            alert(data);
	    if (data == "OK")
	    {
                $("#login").remove();
                $("#pass").remove();
                $("#co").remove();
		$("div").css("display","");
                $("#Head").append($("<button></button>").attr({'id':'deco','style': 'position:relative; left:70%; z-index: 20;','onclick':'deconnexion()'}).text("deconnexion"));
                get_info('crystal');
                get_info('metal');
                get_info('factorys');
	    }
	},
	error : function(){ alert("Votre login ou votre mot de passe n'est pas correcte."); }
    });
}

function deconnexion(value){
    $.ajax({
        url: "http://163.5.245.219:3000/api/1/players/logout",
        type : 'POST',
        data : {},
        xhrFields: { withCredentials: true },
        success : function(data){
            alert(data);
            if (data == "OK")
            {
                $("#deco").remove();
                headCo();
            }
        },
    });
}