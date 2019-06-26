<?php
	header("Content-type:application/json;charset=UTF-8");
	header("Access-Control-Allow-Origin: *");
	date_default_timezone_set('PRC');
	$link=mysqli_connect('localhost','root','19981019','vote','3306')or die("连接数据库服务失败".mysql_error());
	if ($link) {
		# code...
		$address=$_POST['address'];
		$name=$_POST['username'];
		$pwd=$_POST['pwd'];
		$email=$_POST['email'];
		$sql="SELECT * FROM user WHERE `address`='{$address}'";
		mysqli_query($link,'SET NAMES utf8');
		$result = mysqli_query($link,$sql);
		if(mysqli_num_rows($result)>0){
			echo "此地址已被注册!";
		}else{
            $sql2="INSERT INTO user(`address`,`name`,`pwd`,`email`)VALUES('{$address}','{$name}','{$pwd}','{$email}'))";
		$result2=mysqli_query($link,$sql2);
		echo json_encode(array('success'=>'注册成功'));
		}

	}else{
	echo json_encode(array('连接信息'=>'连接失败'));
	}

	mysqli_close($link);
?>