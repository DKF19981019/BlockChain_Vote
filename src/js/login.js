$('document').ready(function(){

	$('.main-box button ').on("click", function(e) {
		var $address=document.getElementById('address').value;
        var $pwd = document.getElementById('pwd').value;
       e.preventDefault();
      var jsonBooks={
			useraddress:$address,
			password:$pwd
		};
		if ($address==""||$pwd=="") {
			alert("请输入地址和密码！");
		}
		else{
		$.ajax({
		url:'http://localhost/VoteSystem/src/sever/login.php',
		type:'POST',
		data:jsonBooks,
		dataType:'json',
		 success:function(data) {
                    console.log(data);
                    $name=data.name;
                    window.close();
                  	window.open("../index.html?"+"name="+$name);
             
                },
         complete: function() { 
            

        },
        error: function() {
            console.log("数据加载失败");
            alert("地址或者密码错误！");
  	}

	});
	}




});
});

// function login(email,pwd){
// 	var jsonBooks={
// 			useremail:email,
// 			password:pwd
// 		};
// 		if (email==""||pwd=="") {
// 			alert("请输入账号或者密码！");
// 		}
// 		else{
// 		$.ajax({
// 		url:'http://localhost/school_library-master/sever/login.php',
// 		type:'post',
// 		data:jsonBooks,
// 		datatype:'text',
// 		 success:function(data) {  
//                     console.log(data);
                   
//                 },
//          complete: function() { 
            

//         },
//         error: function() {
//             console.log("数据加载失败");
//   	}

// 	});
// 	}
// }