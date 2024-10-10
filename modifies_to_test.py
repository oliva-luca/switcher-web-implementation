import pytest
from utils import Modifies 

@pytest.fixture
def modify_1():
    return Modifies(1, 1, 2)

@pytest.fixture
def modify_2():
    return Modifies(1, 2, 1)

@pytest.fixture
def modify_3():
    return Modifies(1, 2, 3)

@pytest.fixture
def modify_4():
    return Modifies(1, 3, 9)

@pytest.fixture
def modify_5():
    return Modifies(1, 9, 14)

@pytest.fixture
def modify_6():
    return Modifies(1, 14, 2)

@pytest.fixture
def modify_7():
    return Modifies(1, 37, 2)   

@pytest.fixture
def modify_8():
    return Modifies(1, 4, 3)

@pytest.fixture
def modify_9():
    return Modifies(1, 2, 5)