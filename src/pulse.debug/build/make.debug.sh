# Change directory to where the script is currently located on disk.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

# Minified
java -jar ../../../build/compiler.jar \
--js=../define.js \
--js=../logger.js \
--js=../timer.js \
--js=../fps.js \
--js=../counter.js \
--js=../paneltab.js \
--js=../performancetab.js \
--js=../panel.js \
--js=../consoletab.js \
--js=../inspecttab.js \
--js=../debugmanager.js \
--js=../debug.js \
--js_output_file=bin/pulse.debug.min.js

# Full
java -jar ../../../build/compiler.jar \
--js=../define.js \
--js=../logger.js \
--js=../timer.js \
--js=../fps.js \
--js=../counter.js \
--js=../paneltab.js \
--js=../performancetab.js \
--js=../panel.js \
--js=../consoletab.js \
--js=../inspecttab.js \
--js=../debugmanager.js \
--js=../debug.js \
--js_output_file=bin/pulse.debug.js \
--compilation_level WHITESPACE_ONLY \
--formatting PRETTY_PRINT

# Copy the files to the main Pulse bin folder.
cp bin/pulse.debug.min.js ../../../build/bin/
cp bin/pulse.debug.js ../../../build/bin/