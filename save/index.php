<?php


$servername = "mysql.badsallysoftware.com";
$username = "perseus_group";
$password = "gobeavers";
$dbname = "cs467_perseus";


try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully"; 
    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }
    
    $qry = $conn->prepare("INSERT INTO perseus_savegames(name) VALUES('Testing')");
    $qry->execute();

    $qry = $conn->prepare("SELECT * FROM perseus_savegames");
    $qry->execute();

/* Fetch all of the remaining rows in the result set */

    $result = $qry->fetchAll(PDO::FETCH_ASSOC);

    echo "<pre>";
    var_dump($result);
    echo "</pre>";

    $conn = null;

?>