# Change directory to where the script is currently located on disk.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

BUILD_DIR=../../../../build
DOCS_DIR=../../../../docs

# Minified
java -jar ../../../../build/compiler.jar \
--js=../src/define.js \
--js=../src/logger.js \
--js=../src/timer.js \
--js=../src/fps.js \
--js=../src/counter.js \
--js=../src/paneltab.js \
--js=../src/performancetab.js \
--js=../src/panel.js \
--js=../src/consoletab.js \
--js=../src/inspecttab.js \
--js=../src/debugmanager.js \
--js=../src/debug.js \
--js_output_file=bin/pulse.debug.min.js

# Full
java -jar ../../../../build/compiler.jar \
--js=../src/define.js \
--js=../src/logger.js \
--js=../src/timer.js \
--js=../src/fps.js \
--js=../src/counter.js \
--js=../src/paneltab.js \
--js=../src/performancetab.js \
--js=../src/panel.js \
--js=../src/consoletab.js \
--js=../src/inspecttab.js \
--js=../src/debugmanager.js \
--js=../src/debug.js \
--js_output_file=bin/pulse.debug.js \
--compilation_level WHITESPACE_ONLY \
--formatting PRETTY_PRINT

# Build the documentation
java -jar $BUILD_DIR/jsdoc/jsrun.jar $BUILD_DIR/jsdoc/app/run.js -c=doc.pulse.debug.conf
java -jar $BUILD_DIR/jsdoc/jsrun.jar $BUILD_DIR/jsdoc/app/run.js -c=doc.pulse.debug.ejs.conf

# Copy the files to the main Pulse bin folder.
cp bin/pulse.debug.min.js ../../../../build/bin/modules/
cp bin/pulse.debug.js ../../../../build/bin/modules/

# Copy docs to main docs folder.
mkdir $DOCS_DIR/modules/pulse.debug

cp -r bin/docs/HTML $DOCS_DIR/modules/pulse.debug
cp -r bin/docs/EJS $DOCS_DIR/modules/pulse.debug