﻿<?
session_start();
if(!isset($_SESSION['directories_user'])){
	 echo file_get_contents('DirLogin.html');
	  exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Admin panel">
    <meta name="author" content="ulight Vlad">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="icon" href="favicon.ico" type="image/x-icon">

    <link href="js/lists/reset.css" rel="stylesheet" type="text/css"/>


    <script type="text/javascript" src="js/libs/jquery-2.1.0.min.js"></script>

   <!-- <script type="text/javascript" src="js/libs/bootstrap.min.js"></script>-->


<title>Interactive Directories Admin</title>

    <style>
        .umsg{
            position: absolute;
            z-index: 2000;
            background-color: ivory;
            padding: 0.3em;
            border-radius: 7px;
            box-shadow: 0 0 5px gray;

        }

        .abs{
            position:absolute;
        }

        .cover{
            background-color: rgba(0,0,0,0.5);
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            display: none;
        }

       #adminHeader{
            text-align: center;
        }
        .item.selected{
            background-color:khaki !important;
        }

        #Message{
            position: relative;
            z-index: 100;

        }
        #Message>div{
            background-color:#FFEFD5;
            padding: 0.5em;
            font-size: 0.7em;
            border-radius: 5px;
            position: absolute;

        }
        .border{
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .inline{
            display: inline-block;
        }
        .disabled{
            opacity: 0.5;
        }
        .breadcrumb li{
            cursor: pointer;
        }

        .breadcrumb li.active{
            cursor: auto;
        }
        .breadcrumb li.active:hover{
            text-decoration: none;
        }
        .breadcrumb li:hover{
            text-decoration: underline;
        }

    </style>
</head>
<body>
<div id="adminHeader" >
    <h4 ><span>Interactive Directory Admin Panel </span>

        <a id="btnLogout" data-id="btnLogout" class="btn pull-right"><span class="fa fa-user-times"></span> LogOut</a>
        <button id="btnRestartKiosks" class="btn btn-warning pull-right">Restart Kiosks</button>
    </h4>
<?
 include ('htms/admin/Navigation.htm');
?>
</div>
<hr/>
    <div id="error"></div>
    <div id="content" class="container">
    </div>
<!-------------------------pREVIEW kIOSK----------------------------------------------------------------------->
<?
    //include ('htms/admin/AdminMenu.htm');
    include ('htms/admin/AdminPreviewKiosk.htm');
    include ('htms/admin/AdminPreviewMobile.htm');
?>




<div id="cover" class="cover">

</div>
<div id="Confirm" class="modal">
    <style>
        #Confirm{
            background-color: rgba(200,200,200,0.2);
        }
    </style>
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-id="btnClose">×</button>
                <h4 class="modal-title" data-id="title">Modal title</h4>
            </div>
            <div class="modal-body" data-id="text">
                <p>One fine body…</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-id="btnYes">Confirm</button>
                <button type="button" class="btn btn-default" data-id="btnNo">Cancel</button>

            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<hr/>
<!-- -->
<link href="js/libs/font-awesome.css" rel="stylesheet" type="text/css"/>
<link href="js/libs/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<!---->

<script type="text/javascript" src="js/libs/underscore-min.js"></script>
<script type="text/javascript" src="js/libs/nicEdit.js"></script>
<script type="text/javascript" src="js/libs/Chart.js"></script>
<!--<script type="text/javascript" src="js/libs/bootstrap.min.js"></script>-->
<!---->


<script type="text/javascript" src="js/admin.js"></script>


    </body>
<script>
    $(document).ready(function(){
        var admin =  new uplight.Admin();
    })
</script>
</html>