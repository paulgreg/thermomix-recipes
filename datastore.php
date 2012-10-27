<?php

if (isset($_SERVER) && isset($_SERVER['REQUEST_METHOD'])) {

    $ds = new DataStore();

    switch ($_SERVER['REQUEST_METHOD']) {
        case "GET":
            $name = $ds->sanitizeFileName($_GET["n"]);
            $ds->check($name, "Parameter n is mandatory.");
            $ds->read($name);
            break;
        case "POST":
            $name = $ds->sanitizeFileName($_GET["n"]);
            $value = $ds->sanitize($_POST["v"]);
            $ds->check($name, "Parameter n in URL is mandatory.");
            $ds->check($value, "Parameter v in form data is mandatory.");
            $ds->write($name, $value);
            $ds->read($name);
            break;
        default:
            $ds->stop(501, "501 Method not implemented");
    }
}

class DataStore {

    public function sanitize($param) {
        return filter_var($param, FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES);
    }

    public function sanitizeFileName($param) {
        $filtered = $this->sanitize($param);
        return preg_replace("/\W/", "", $filtered);
    }

    public function check(&$param, $errorMsg) {
        if (empty($param)) {
            $this->stop(400, $errorMsg);
        }
    }

    function stop($code, $errorMsg) {
        switch($code) {
            case 400:
                header("HTTP/1.1 400 Bad Request");
                die($errorMsg);
                break;
            case 404:
                header("HTTP/1.1 404 Not Found");
                die($errorMsg);
                break;
            case 500:
                header("HTTP/1.1 500 Internal Server Error");
                die($errorMsg);
                break;
            case 501:
                header("HTTP/1.1 501 Not Implemented");
                die($errorMsg);
                break;
        }
    }

    public function read($name) {
        $file = "./data/$name.json";
        if (file_exists($file)) {
            $handle = fopen($file, "r");
            $size = filesize($file);
            header("HTTP/1.1 200 Ok");
            header('Content-type: application/json; charset=UTF-8');
            header("Content-length: $size");
            echo fread($handle, $size);
            fclose($handle);
        } else {
            $this->stop(404, "404 Document not found");
        }
    }

    public function write($name, $value) {
        $file = "./data/$name.json";
        $handle = fopen($file, "w");
        if (fwrite($handle, $value) !== strlen($value)) {
            $this->fclose($handle);
            stop(500, "Failed to write data");
        }
        fclose($handle);
    }
}
?>
