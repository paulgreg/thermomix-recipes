SOURCE_DIR = 'src'
BUILD_DIR = 'dist'

task :default do

  puts "Cleaning..."
  FileUtils.rm_r BUILD_DIR, :force => true

  puts "Copying files..."
  FileUtils.mkdir_p "#{BUILD_DIR}/data"
  FileUtils.cp "#{SOURCE_DIR}/index.html", BUILD_DIR
  FileUtils.cp "#{SOURCE_DIR}/datastore.php", BUILD_DIR
  FileUtils.cp "./dist.htaccess", "#{BUILD_DIR}/.htaccess"
  FileUtils.cp_r "#{SOURCE_DIR}/css", BUILD_DIR
  FileUtils.cp_r "#{SOURCE_DIR}/imgs", BUILD_DIR

  puts "Inserting commit info in index.html"
  open("#{BUILD_DIR}/index.html", 'a') { |f|
      info = `git log --pretty=format:'%H at %ai' -n 1`.gsub(/\n/, "")
      f.puts "<!-- #{info} -->"
  }

  puts "Concatening and minifying JS files"
  system "grunt concat min"

  puts "Removing non minified css/js files"
  FileUtils.rm "#{BUILD_DIR}/js/thermomix-recipes.js"

  puts "Generate manifest"
  system "(cd dist && ../build_manifest.py)"

  puts "Build done !"
  system "notify-send 'Build done'"
end
