# Change directory to where the script is currently located on disk.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

BUILD_DIR=../../../build
DOCS_DIR=../../../docs

# Minified
java -jar $BUILD_DIR/compiler.jar \
--js=../src/main.js \
--js=../src/asset/soundmanager2.js \
--js=../src/plugin/plugin.js \
--js=../src/plugin/plugincollection.js \
--js=../src/error.js \
--js=../src/util.js \
--js=../src/point.js \
--js=../src/support.js \
--js=../src/event/eventproperties.js \
--js=../src/event/eventmanager.js \
--js=../src/node.js \
--js=../src/asset/asset.js \
--js=../src/asset/textfile.js \
--js=../src/asset/texture.js \
--js=../src/asset/bitmapfont.js \
--js=../src/asset/sound.js \
--js=../src/asset/assetbundle.js \
--js=../src/asset/assetmanager.js \
--js=../src/visual/visual.js \
--js=../src/action/action.js \
--js=../src/action/animateaction.js \
--js=../src/action/moveaction.js \
--js=../src/visual/sprite.js \
--js=../src/visual/bitmaplabel.js \
--js=../src/visual/canvaslabel.js \
--js=../src/visual/layer.js \
--js=../src/scene.js \
--js=../src/scenemanager.js \
--js=../src/engine.js \
--js_output_file=bin/pulse.min.js

# Full
java -jar $BUILD_DIR/compiler.jar \
--js=../src/main.js \
--js=../src/asset/soundmanager2.js \
--js=../src/plugin/plugin.js \
--js=../src/plugin/plugincollection.js \
--js=../src/error.js \
--js=../src/util.js \
--js=../src/point.js \
--js=../src/support.js \
--js=../src/event/eventproperties.js \
--js=../src/event/eventmanager.js \
--js=../src/node.js \
--js=../src/asset/asset.js \
--js=../src/asset/textfile.js \
--js=../src/asset/texture.js \
--js=../src/asset/bitmapfont.js \
--js=../src/asset/sound.js \
--js=../src/asset/assetbundle.js \
--js=../src/asset/assetmanager.js \
--js=../src/visual/visual.js \
--js=../src/action/action.js \
--js=../src/action/animateaction.js \
--js=../src/action/moveaction.js \
--js=../src/visual/sprite.js \
--js=../src/visual/bitmaplabel.js \
--js=../src/visual/canvaslabel.js \
--js=../src/visual/layer.js \
--js=../src/scene.js \
--js=../src/scenemanager.js \
--js=../src/engine.js \
--js_output_file=bin/pulse.js \
--compilation_level WHITESPACE_ONLY \
--formatting PRETTY_PRINT

# Copy the files to the main Pulse bin folder.
cp bin/pulse.min.js $BUILD_DIR/bin/
cp bin/pulse.js $BUILD_DIR/bin/

# Build the documentation.
java -jar $BUILD_DIR/jsdoc/jsrun.jar $BUILD_DIR/jsdoc/app/run.js -c=doc.pulse.conf
java -jar $BUILD_DIR/jsdoc/jsrun.jar $BUILD_DIR/jsdoc/app/run.js -c=doc.pulse.ejs.conf

# Copy docs to main docs folder.
mkdir $DOCS_DIR/pulse

cp -r bin/docs/HTML $DOCS_DIR/pulse
cp -r bin/docs/EJS $DOCS_DIR/pulse