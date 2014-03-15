REPORTER = dot
MOCHA ?= ./node_modules/.bin/mocha
JSCOVERAGE ?= ./node_modules/.bin/jscoverage
JSHINT ?= ./node_modules/.bin/jshint
UGLIFYJS ?= ./node_modules/.bin/uglifyjs

all: lint test

test: .FORCE
	@echo "MOCHA      test"
	@$(MOCHA) \
		--reporter $(REPORTER) \
		--growl \
		$(TESTS)

test-watch:
	@echo "MOCHA      test"
	@$(MOCHA) \
		--reporter $(REPORTER) \
		--growl -w\
		$(TESTS)

coverage: .FORCE
	@echo visit file://$$PWD/coverage.html
	@COVERAGE=1 $(MOCHA) \
		--reporter html-cov \
		$(TESTS) > coverage.html || true

lib-cov: .FORCE
	@echo "JSCOVERAGE $@"
	@$(JSCOVERAGE) lib $@
	@echo "SED        index-cov.js"
	@sed "s#lib/#lib-cov/#" index.js > index-cov.js

lint:
	@echo "LINT       lib index.js"
	@$(JSHINT) lib index.js
	@echo "LINT       test"
	@$(JSHINT) test/*.js
	@echo "LINT       examples"
	@$(JSHINT) examples/*/*.js

torture: 
	@node samples/ansi_rendering/app.js samples/data/vt100test.txt

.FORCE:
