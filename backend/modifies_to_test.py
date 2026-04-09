import pytest
from utils import Modify 

@pytest.fixture
def modify_1():
    return Modify(1, 1, 2)

@pytest.fixture
def modify_2():
    return Modify(1, 2, 1)

@pytest.fixture
def modify_3():
    return Modify(1, 2, 3)

@pytest.fixture
def modify_4():
    return Modify(1, 3, 9)

@pytest.fixture
def modify_5():
    return Modify(1, 9, 14)

@pytest.fixture
def modify_6():
    return Modify(1, 14, 2)

@pytest.fixture
def modify_7():
    return Modify(1, 37, 2)   

@pytest.fixture
def modify_8():
    return Modify(1, 4, 3)

@pytest.fixture
def modify_9():
    return Modify(1, 2, 5)