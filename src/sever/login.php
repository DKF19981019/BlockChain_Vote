<?php
	header("Content-type:application/json;charset=UTF-8");
	header("Access-Control-Allow-Origin: *");
	date_default_timezone_set('PRC');
	$link=mysqli_connect('localhost','root','19981019','vote','3306');
	if($link){
		$address=$_POST['useraddress'];
		$pwd=$_POST['password'];
		$sql="SELECT * FROM user WHERE `address`='{$address}' and `pwd`='{$pwd}'";
		mysqli_query($link,'SET NAMES utf8');
		$result = mysqli_query($link,$sql);
		if(mysqli_num_rows($result)>0){
			while ($row=mysqli_fetch_assoc($result)) {
			$arr['list'][]=array(
                  'name'=>$row['name'],
         );
		}
		foreach($arr['list'] as $k=>$val){
			$name=$val['name'];
		}
			$arr1=array(
				'name'=>$name,
			);
			
			echo json_encode($arr1);
		}
	}
	else{
		echo "<script>alert('地址或者密码错误，请重新输入');location='login.html'</script>";
	}
	mysqli_close($link);
?>