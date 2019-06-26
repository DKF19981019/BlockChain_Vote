<?php
header("Content-type:application/json;charset=UTF-8");

header('Access-Control-Allow-Origin:*');

$link=mysqli_connect('localhost','root','19981019','vote','3306');
if($link){
	$theme= $_POST['theme'];
	$name=$_POST['name'];
	$sql="SELECT * FROM content WHERE `theme`='{$theme}' and `name`='{$name}'";
	mysqli_query($link,'SET NAMES utf8');
	$result = mysqli_query($link,$sql);
	 if(mysqli_num_rows($result)>0){
	 	echo (array('信息'=>'可关闭'));
	 }else{
	 	echo "不可以关闭";
	 	echo $theme;
	 	echo json_encode($name);
	 }
}

mysqli_close($link);
?>