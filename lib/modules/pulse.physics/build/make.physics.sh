# Change directory to where the script is currently located on disk.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

BUILD_DIR=../../../../build
DOCS_DIR=../../../../docs

# Minified
java -jar ../../../../build/compiler.jar \
--js=../src/Box2dWeb-2.1.a.3.min.js \
--js=../src/physics.js \
--js_output_file=bin/pulse.physics.min.js

# Full
java -jar ../../../../build/compiler.jar \
--js=../src/Box2dWeb-2.1.a.3.min.js \
--js=../src/physics.js \
--js_output_file=bin/pulse.physics.js \
--compilation_level WHITESPACE_ONLY \
--formatting PRETTY_PRINT

# Build the documentation
java -jar $BUILD_DIR/jsdoc/jsrun.jar $BUILD_DIR/jsdoc/app/run.js -c=doc.pulse.physics.conf
java -jar $BUILD_DIR/jsdoc/jsrun.jar $BUILD_DIR/jsdoc/app/run.js -c=doc.pulse.physics.ejs.conf

# Copy the files to the main Pulse bin folder.
cp bin/pulse.physics.min.js ../../../../build/bin/modules/
cp bin/pulse.physics.js ../../../../build/bin/modules/

# Copy docs to main docs folder.
mkdir $DOCS_DIR/modules/pulse.physics

cp -r ../docs/HTML $DOCS_DIR/modules/pulse.physics
cp -r ../docs/EJS $DOCS_DIR/modules/pulse.physics