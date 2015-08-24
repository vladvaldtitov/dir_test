<?php
session_start();
$get=$_GET;
$post=$_POST;
//$a=explode('.',strtok(basename($_SERVER['REQUEST_URI']),'?'));

if(!isset($get['a'])) {
	echo 'Hello world';
	exit;
}
$a=explode('.',$get['a']);
$result= false;


switch(array_shift($a)){
	case 'get_updates':
	$result=new stdClass();
	$stapm=(int)$get['stamp'];

	$mystamp=filemtime('../data/control.json');
	if($stapm==0) $result->stamp=$mystamp;
	else if($mystamp>$stapm){				
		 $result=json_decode(file_get_contents('../data/control.json'));
		// $result->stamp=$mystamp;
	}
	
	break;
	case 'log_error':
		error_log(file_get_contents("php://input")."|\n\r|", 3,'../data/logs/k_error'.date('m-y').'.log');			
	echo 'OK';		
	break;
	case 'log_log':
		file_put_contents('../data/logs/kiosk'.date("m-y").'.log', file_get_contents("php://input")."|\n\r|", FILE_APPEND);	
		echo 'OK';
	break;
	case 'log_stat':
		$type=$get['type'];		
		$val=$get['val'];
		$who=$get['who'];
		$id = $get['id'];		
		$stamp= $get['stamp'];
		if(strlen($stamp)>10)$stamp= substr($stamp,0,10);
		$db=new PDO('sqlite:../data/statistics.db');
		$db->query('CREATE TABLE IF NOT EXISTS stats (id INTEGER PRIMARY KEY, type CHAR(10),val CHAR(10),who CHAR(10),did INTEGER,stamp INTEGER)');				
		$res= $db->query("INSERT INTO stats (type,val,who,did,stamp) VALUES ('$type','$val','$who',$id,$stamp)");
		if($res) echo 'OK';
		else echo json_encode($db->errorInfo());		
			
	break;
	case 'get_data':
		$fn='../data/'.$get['file_name'];
		echo file_exists($fn)?file_get_contents($fn):'NO';
			      
	break;
	case 'get_page':
		
		$fn='../data/pages/p'.$get['id'].'.htm';
		$result= file_exists($fn)?file_get_contents($fn):'NO';			      
	break;
	
	case 'get_categories':
		include_once('cl/DbConnector.php');
		$con= new DbConnector();
		$sql='SELECT catid,label FROM categories WHERE enable=1 ORDER BY sort';		
		$result=json_encode($con->query($sql));	
		//header('Content-type: application/json'); 
			      
	break;
	
	case 'get_settings':
	header('Content-type: application/json');
	echo file_get_contents('../data/settings.json');
	break;
		
	case 'get_dests':
	include 'cl/DbConnector.php';	
		$con=new DbConnector();
		$out=new stdClass();
		header('Content-type: application/json');
		$cats = $con->query('SELECT * FROM categories WHERE enable=1 ORDER BY sort');
		foreach($cats as $val) $val->id=(int)$val->id;		
		$out->cats = $cats;
		
		$dests = $con->query('SELECT * FROM destinations ORDER by LOWER(name)');
		foreach($dests as $val) $val->id=(int)$val->id;		
		$out->dests = $dests;
		
		echo json_encode($out);


	break;
	case 'get_messages':
		$fn='../data/messages.json';
		$result= file_exists($fn)?file_get_contents($fn):'NO';	
	break;
	case 'get_advanced':
        if(!isset($get['id'])) break;
		$fn='../data/details/a'.$get['id'].'.htm';
		$result = file_exists($fn)?file_get_contents($fn):'NO';	
	break;
	
	case 'get_background':
	include 'cl/Screen.php';		
		$ctr= new Screen();
		$result=$ctr->getBackground();
	break;	
	case 'get_stamp':
		if(!isset($get['id']) || !isset($get['stamp'])) die('ERROR');
		header('Content-type: application/json');
		
		echo json_encode(trackKiosk($get));	
		
	break;

	case 'get_rss':
	
	$id=json_decode(file_get_contents('../data/settings.json'))->screensaver->rss;
	
	$rss=json_decode(file_get_contents('../data/rss.json'));
	$rss = $rss[$id]->url;
	if($rss) $result= curl_exec(curl_init($rss)); 
	exit();
	
	break;
}



function trackKiosk($get){		
		$out=new stdClass();
		$out->success='success';			
		$file_name='../data/kiosks.json';
		
		$id=$get['id'];
		$track = json_decode(file_get_contents($file_name));
		if(!isset($track->$id)){
			$out->success='nothing';
		return $out;
		}		
		$kiosk = $track->$id;					
		$stamp=(int)$get['stamp'];
		$k_time=(int)@$get['now'];
		$timer=(int)@$get['timer'];
		$status=@$get['status'];
		
		if($stamp==0) {
			$stamp=time();
			$kiosk->status='started';// 1 status started;  2 status working ; 3 status screensaver; 100 restart with url; 99 reload
			$kiosk ->start_at = $k_time;
			$kiosk->stamp = $stamp;
			$kiosk->ip = $_SERVER['REMOTE_ADDR'];
			$out->success = 'stamp';
			$out->result = $stamp;
			$out->ktime = $k_time;
			$track->$id = $kiosk;
			file_put_contents($file_name,json_encode($track));
			return $out;
		}
							
		if($kiosk->status=='restart'){
			$out->success='restart';
			$out->result='Kiosk1080.php?device='.$id;
		}
		if($kiosk->status=='reload'){
			$out->success='reload';
			$out->result=''.$id;
		}
		
		$kiosk->status=$status;
		$kiosk->K_time=$k_time;
		$kiosk->ping=(int)@$get['ping'];
		$kiosk->S_time = time();
		$kiosk->timer=$timer;
		$track->$id=$kiosk;
		file_put_contents($file_name,json_encode($track));
		
					
					
		
			
			return $out;
		
}



