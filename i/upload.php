<?php
$secret_key = "your_secret_here";
$lengthofstring = 6; //Length of the file name

function RandomString($length) {
    $keys = array_merge(range(0,9), range('a', 'z'));
	$key = "";
    for($i=0; $i < $length; $i++) {
        $key .= $keys[mt_rand(0, count($keys) - 1)];
    }
    return $key;
}

if(isset($_POST['secret']))
{
    if($_POST['secret'] == $secret_key)
    {
        $filename = RandomString($lengthofstring); //This is where the 6-character string is generated. This is where I want to use my custom name defined in ShareX.
        $target_file = $_FILES["sharex"]["name"];
        $fileType = pathinfo($target_file, PATHINFO_EXTENSION);

        if (move_uploaded_file($_FILES["sharex"]["tmp_name"], $filename.'.'.$fileType))
        {
            echo $filename.'.'.$fileType;
        }
            else
        {
           echo 'ERROR: File upload failed';
        }  
    }
    else
    {
        echo 'ERROR: Invalid secret key';
    }
}
else
{
    echo 'ERROR: No post data recieved';
}
?>