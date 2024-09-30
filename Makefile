SHELL := /bin/bash

run_unit_tests:
	ENVIRONMENT=test pytest -m "not integration_test and not end2end_test"

run_integration_tests:
	env ENVIRONMENT=test python3 populate_test_db.py
	ENVIRONMENT=test pytest -m integration_test -vv
	rm database_test.sqlite
  unset ENVIRONMENT

run_end2end_tests:
	env ENVIRONMENT=test python3 populate_test_db.py
	ENVIRONMENT=test pytest -m end2end_test -vv
	rm database_test.sqlite
	unset ENVIRONMENT

run_all_tests:
	ENVIRONMENT=test python3 populate_test_db.py
	pytest -vv
	rm database_test.sqlite
	unset ENVIRONMENT
