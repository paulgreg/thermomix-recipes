<?php
$javascripts = array(
    'jquery-1.12.4.min.js',
    'jquery-migrate-1.4.1.min.js',
    'Markdown.Converter.js',
    'Markdown.Sanitizer.js',
    'jquery.mobile-1.2.1.min.js',
    'jqm.page.params.js',
    'underscore-min.js',
    'l10n.js',
    'thermomix-main.js',
    'thermomix-data.js',
    'thermomix-controller.js',
    'thermomix-views.js'
);

header('Content-type: application/javascript');
foreach($javascripts as $file) {
    echo file_get_contents(__DIR__."/".$file);
}
