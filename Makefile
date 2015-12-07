.DEFAULT_GOAL: init

init: src/scripts/outliner.min.js

src/scripts/outliner.min.js: node_modules/h5o/dist/outliner.min.js
	@echo '* Deploy outliner library code'
	@cp -v $< $@

# internal dev setup
# sync between linux and windows box
.PHONY: devsync
devsync:
	@echo "sync files among windows box..."
	@unison -batch -fat ./src/ ~/Public/webpage-indexer/
