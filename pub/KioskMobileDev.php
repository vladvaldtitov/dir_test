﻿<?error_reporting(E_ALL);define('DATA','../data');$strSetttings = file_get_contents(DATA."/settings.json");$settings = json_decode($strSetttings);$strLabels = file_get_contents(DATA."/".$settings->labels);$labels = json_decode($strLabels);foreach($labels as $label)$labels[$label->index]=$label->value; ?><!DOCTYPE html><html lang="en"><head>	<title>INTERACTIVE DIRECTORIES</title>	<meta name="viewport" content="width=device-width, initial-scale=1" />    <script src="js/libs/jquery-2.1.0.min.js"></script>    <link rel="stylesheet" href="js/libs/bootstrap.css" />    <link rel="stylesheet" href="js/libs/font-awesome.css" />    <link rel="stylesheet" href="css/lightblue.css" />     <script type="text/javascript">	 var scr;	 <?	 $js=' var u_settings='.$strSetttings;     $js.="\n\r".' var u_labels='.$strLabels;     if(isset($settings->pages))$js.="\n\r".' var u_pages='.file_get_contents(DATA.'/'.$settings->pages);	 echo $js;	 ?>	 </script>    <style type="text/css">	<?		include('css/mobile.css');	?> 			.hidden{		display:none;		}	        #FrontPage{            background-image: url('<?= $labels['background']; ?>');                   }	</style></head><body class="body"><div class="hidden">		<?		if(isset($settings->front_page))include('htms/mobile/FilterPage.php');		?></div><div id="Container">    <section id="Header" class="row">         </section>       <section id="Content" data-id="container">        <?            if(isset($settings->front_page))include($settings->front_page);			else include('htms/mobile/FilterPage.php');                  ?>    </section>    <section id="Footer" class="container text-center">        <?= isset($labels['footer'])?$labels['footer']:''; ?>    </section><? include('htms/mobile/NavigationBar.php'); ?></div><section id="ImageView">    <img></section><script src="js/com/Utils.js"></script><script src="js/kiosk/Registry.js"></script><script src="js/kiosk/Connector.js"></script><script src="js/kiosk/search/models.js"></script><script src="js/mobile/InfoPage.js"></script><script src="js/mobile/FilterPage.js"></script><script src="js/mobile/FrontPage.js"></script><script src="js/mobile/Utils.js"></script><script src="js/mobile/Menu.js"></script><script src="js/view/Views.js"></script><script src="js/kiosk/search/DetailsLarge.js"></script><script src="js/mobile/GoogleMap.js"></script><script src="js/mobile/Mobile.js"></script></body></html>