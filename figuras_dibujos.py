# Dibujos con caracteres de las figuras
# "O" representa una casilla de la figura
# "." no forman parte de la figura, solo están para que la forma sea rectangular
dibujos = {
    1 : [
        "O..",
        "OOO",
        "O.."
    ],
    2 : [
        "OO..",
        ".OOO"
    ],
    3 : [
        "..OO",
        "OOO."
    ],
    4 : [
        "O..",
        "OO.",
        ".OO"
    ],
    5 : [
        "OOOOO",
    ],
    6 : [
        "O..",
        "O..",
        "OOO"
    ],
    7 : [
        "OOOO",
        "...O"
    ],
    8 : [
        "...O",
        "OOOO"
    ],
    9 : [
        "..O",
        "OOO",
        ".O."
    ],
    10 : [
        "..O",
        "OOO",
        "O.."
    ],
    11 : [
        "O..",
        "OOO",
        ".O."
    ],
    12 : [
        "O..",
        "OOO",
        "..O"
    ],
    13 : [
        "OOOO",
        "..O."
    ],
    14 : [
        "..O.",
        "OOOO"
    ],
    15 : [
        ".OO",
        "OOO"
    ],
    16 : [
        "O.O",
        "OOO"
    ],
    17 : [
        ".O.",
        "OOO",
        ".O."
    ],
    18 : [
        "OOO",
        ".OO"
    ],
    19 : [
        ".OO",
        "OO."
    ],
    20 : [
        "OO",
        "OO"
    ],
    21 : [
        "OO.",
        ".OO"
    ],
    22 : [
        ".O.",
        "OOO"
    ],
    23 : [
        "OOO",
        "..O"
    ],
    24 : [
        "OOOO"
    ],
    25 : [
        "..O",
        "OOO"
    ],
}

# Funcion auxiliar para visualizar dibujos
def mostrar(dibujo):
    for line in dibujo:
        print(line)