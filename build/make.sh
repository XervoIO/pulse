# Make Pulse Core
sh make.pulse.sh

# Make Debug Module
sh ../src/pulse.debug/build/make.debug.sh

# Build documentation
java -jar jsdoc/jsrun.jar jsdoc/app/run.js -c=jsdoc/pulse.conf