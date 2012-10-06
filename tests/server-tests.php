<?php
define('__ROOT__', dirname(dirname(__FILE__)));
require_once(__ROOT__."/datastore.php");

class DataStoreTest extends PHPUnit_Framework_TestCase {

    protected function setUp() {
        $this->ds = new DataStore();
    }

    public function testSanitize() {
        $this->assertEquals('foo', $this->ds->sanitize('foo'));
        $this->assertEquals('bar', $this->ds->sanitize('<i>bar</i>'));
        $this->assertEquals('{"json":"works"}', $this->ds->sanitize('{"json":"works"}'));
    }

    public function testSanitizeFileName() {
        $this->assertEquals('foo', $this->ds->sanitizeFileName('foo'));
        $this->assertEquals('foowithspaces', $this->ds->sanitizeFileName(' foo with spaces '));
        $this->assertEquals('bar', $this->ds->sanitizeFileName('<i>bar</i>'));
        $this->assertEquals('bar', $this->ds->sanitizeFileName('bar?^'));
    }
}
?>
