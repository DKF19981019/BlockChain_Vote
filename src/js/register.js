$('document').ready(function(){
	$('.main-box button').on("click",function(e){
		var $address=document.getElementById('address').value;
		var $username=document.getElementById('username').value;
		var $email=document.getElementById('email').value;
        var $pwd = document.getElementById('pwd').value;
		var $pwd2 = document.getElementById('pwd2').value;
        e.preventDefault();
        var jsonBooks={
        	address:$address,
        	username:$username,
			email:$email,
        	pwd:$pwd,
			pwd2:$pwd2
        }
        if($pwd != $pwd2){
        	alert("密码前后输入不一致");
		}
        if($address==""||$username==""||$pwd==""){
        	alert("请完善你的信息！");
        }else{
        	console.log(jsonBooks);
        $.ajax({
        	url:'http://localhost/VoteSystem/src/sever/register.php',
        	type:'POST',
        	data:jsonBooks,
        	dataType:'json',
        	success:function(data){
        		console.log(data);
        		alert("注册成功！请前往登录");
        		window.location.href="./login.html";
        	}
			// ,
			// error:function(){
			// 	alert("此地址已被使用，无法注册！")
			// }
        });
}


	});





});