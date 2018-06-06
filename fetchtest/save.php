<?php 
$file = "test.txt";
$data = file_get_contents('php://input');
if(file_put_contents($file, $data) === false)
{
    echo "{\"result\" : \"Error!\"}"; 
} else{
        echo "{\"result\" : \"Success!\"}";
} 



