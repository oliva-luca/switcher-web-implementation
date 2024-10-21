SHELL := /bin/bash

run_unit_tests:
	ENVIRONMENT=test pytest -m "not integration_test and not end2end_test"
	rm database_test.sqlite

run_integration_tests:
	env ENVIRONMENT=test python3 populate_test_db.py
	ENVIRONMENT=test pytest -m integration_test -vv
	rm database_test.sqlite

run_all_tests:
	ENVIRONMENT=test python3 populate_test_db.py
	pytest --cov=.  --cov-report=term-missing -vv
	rm database_test.sqlite
	unset ENVIRONMENT
